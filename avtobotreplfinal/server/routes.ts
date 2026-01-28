import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeVehicleDamage, analyzeMultipleImages } from "./openai";
import { calculateCarValue, determineConditionFromDamage, getPricingSettings, updatePricingSettings, getBrandingSettings, updateBrandingSettings } from "./carValuation";
import { vehicleDetailsSchema, contactInfoSchema } from "@shared/schema";
import { z } from "zod";

const analyzeRequestSchema = z.object({
  images: z.array(z.string().min(1)).min(1, "At least one image is required"),
});

const analyzeRequestSchemaLegacy = z.object({
  image: z.string().min(1, "Image data is required"),
});

const valuationRequestSchema = z.object({
  vehicleDetails: vehicleDetailsSchema,
  contactInfo: contactInfoSchema,
});

const pricingSettingsSchema = z.object({
  basePrice: z.number().optional(),
  premiumBrandMultiplier: z.number().optional(),
  depreciationRate: z.number().optional(),
  mileagePenalty: z.number().optional(),
  captchaEnabled: z.boolean().optional(),
  vinSearchEnabled: z.boolean().optional(),
});

const brandingSettingsSchema = z.object({
  siteName: z.string().optional(),
  siteTagline: z.string().optional(),
  logoUrl: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  telegramBot: z.string().optional(),
  telegramChannel: z.string().optional(),
  whatsapp: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all assessments
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  // Get single assessment
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid assessment ID" });
      }
      
      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ error: "Failed to fetch assessment" });
    }
  });

  // Analyze images and create assessment
  app.post("/api/assessments/analyze", async (req, res) => {
    try {
      let images: string[] = [];
      
      const parsedMulti = analyzeRequestSchema.safeParse(req.body);
      if (parsedMulti.success) {
        images = parsedMulti.data.images;
      } else {
        const parsedLegacy = analyzeRequestSchemaLegacy.safeParse(req.body);
        if (parsedLegacy.success) {
          images = [parsedLegacy.data.image];
        } else {
          return res.status(400).json({ 
            error: "Invalid request", 
            details: parsedMulti.error.errors 
          });
        }
      }

      const assessment = await storage.createAssessment(images[0], images);
      
      try {
        const result = images.length > 1 
          ? await analyzeMultipleImages(images)
          : await analyzeVehicleDamage(images[0]);
        
        if (result.vehicleInfo?.make) {
          const condition = determineConditionFromDamage(
            result.overallSeverity,
            result.totalEstimatedCost
          );
          
          const valuation = calculateCarValue({
            brand: result.vehicleInfo.make,
            model: result.vehicleInfo.model,
            year: result.vehicleInfo.year ? parseInt(result.vehicleInfo.year) : undefined,
            condition,
          });
          
          const repairToValueRatio = valuation.averageValue > 0 
            ? Math.round((result.totalEstimatedCost / valuation.averageValue) * 100)
            : 0;
          
          result.vehicleValuation = {
            estimatedValueMin: valuation.estimatedValueMin,
            estimatedValueMax: valuation.estimatedValueMax,
            averageValue: valuation.averageValue,
            isPremiumBrand: valuation.isPremiumBrand,
            repairToValueRatio,
          };
        }
        
        const updatedAssessment = await storage.updateAssessment(assessment.id, {
          result,
          status: "completed",
        });
        
        res.json(updatedAssessment);
      } catch (analysisError) {
        await storage.updateAssessment(assessment.id, {
          status: "error",
        });
        throw analysisError;
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to analyze image" 
      });
    }
  });

  // Override assessment decision (human-in-the-loop)
  app.post("/api/assessments/:id/override", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid assessment ID" });
      }

      const { decision, reason } = req.body;
      
      if (!decision || !["auto_approve", "human_review", "escalate"].includes(decision)) {
        return res.status(400).json({ error: "Invalid decision" });
      }
      
      if (!reason || typeof reason !== "string") {
        return res.status(400).json({ error: "Override reason is required" });
      }

      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      const updated = await storage.updateAssessment(id, {
        humanOverride: decision,
        humanOverrideReason: reason,
      });

      res.json(updated);
    } catch (error) {
      console.error("Error overriding assessment:", error);
      res.status(500).json({ error: "Failed to override assessment" });
    }
  });

  // Get all valuations
  app.get("/api/valuations", async (req, res) => {
    try {
      const valuations = await storage.getAllValuations();
      res.json(valuations);
    } catch (error) {
      console.error("Error fetching valuations:", error);
      res.status(500).json({ error: "Failed to fetch valuations" });
    }
  });

  // Create standalone valuation (without damage assessment)
  app.post("/api/valuations", async (req, res) => {
    try {
      const parsed = valuationRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parsed.error.errors 
        });
      }

      const { vehicleDetails, contactInfo } = parsed.data;
      
      const valuation = await storage.createValuation(vehicleDetails, contactInfo);
      
      const carValuation = calculateCarValue({
        brand: vehicleDetails.brand,
        model: vehicleDetails.model,
        year: vehicleDetails.year,
        mileage: vehicleDetails.mileage,
        condition: vehicleDetails.condition,
      });
      
      const valuationResult = {
        estimatedValueMin: carValuation.estimatedValueMin,
        estimatedValueMax: carValuation.estimatedValueMax,
        averageValue: carValuation.averageValue,
        isPremiumBrand: carValuation.isPremiumBrand,
        repairToValueRatio: 0,
      };
      
      const updatedValuation = await storage.updateValuation(valuation.id, {
        valuation: valuationResult,
      });

      res.json(updatedValuation);
    } catch (error) {
      console.error("Error creating valuation:", error);
      res.status(500).json({ error: "Failed to create valuation" });
    }
  });

  // Admin: Get pricing settings
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = getPricingSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Admin: Update pricing settings
  app.patch("/api/admin/settings", async (req, res) => {
    try {
      const parsed = pricingSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parsed.error.errors 
        });
      }

      const updatedSettings = updatePricingSettings(parsed.data);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Admin: Get branding settings
  app.get("/api/admin/branding", async (req, res) => {
    try {
      const settings = getBrandingSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching branding:", error);
      res.status(500).json({ error: "Failed to fetch branding settings" });
    }
  });

  // Admin: Update branding settings
  app.patch("/api/admin/branding", async (req, res) => {
    try {
      const parsed = brandingSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parsed.error.errors 
        });
      }

      const updatedSettings = updateBrandingSettings(parsed.data);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating branding:", error);
      res.status(500).json({ error: "Failed to update branding settings" });
    }
  });

  // Admin: Upload logo
  app.post("/api/admin/logo", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(400).json({ error: "Image data is required" });
      }

      // Store logo as base64 data URL
      const updatedSettings = updateBrandingSettings({ logoUrl: image });
      res.json({ logoUrl: updatedSettings.logoUrl });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  });

  return httpServer;
}
