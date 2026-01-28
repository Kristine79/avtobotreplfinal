import { pgTable, text, varchar, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Damage types detected by the AI
export const damageTypes = [
  "dent",
  "scratch",
  "crack",
  "broken_light",
  "broken_mirror",
  "broken_window",
  "paint_damage",
  "rust",
  "bumper_damage",
  "structural_damage",
] as const;

export type DamageType = typeof damageTypes[number];

// Severity levels
export const severityLevels = ["minor", "moderate", "severe"] as const;
export type SeverityLevel = typeof severityLevels[number];

// Decision outcomes
export const decisionOutcomes = ["auto_approve", "human_review", "escalate"] as const;
export type DecisionOutcome = typeof decisionOutcomes[number];

// Condition levels for manual valuation
export const conditionLevels = ["excellent", "good", "fair", "poor"] as const;
export type ConditionLevel = typeof conditionLevels[number];

// Drive types
export const driveTypes = ["fwd", "rwd", "awd"] as const;
export type DriveType = typeof driveTypes[number];

// Transmission types
export const transmissionTypes = ["automatic", "manual"] as const;
export type TransmissionType = typeof transmissionTypes[number];

// Body types (auto.ru criteria)
export const bodyTypes = ["sedan", "hatchback", "wagon", "suv", "coupe", "convertible", "minivan", "pickup", "van"] as const;
export type BodyType = typeof bodyTypes[number];

// Fuel types (auto.ru criteria)
export const fuelTypes = ["petrol", "diesel", "hybrid", "electric", "gas"] as const;
export type FuelType = typeof fuelTypes[number];

// Colors
export const carColors = ["black", "white", "silver", "gray", "red", "blue", "brown", "beige", "green", "orange", "yellow", "purple", "gold"] as const;
export type CarColor = typeof carColors[number];

// Vehicle details for manual valuation input (expanded with auto.ru criteria)
export const vehicleDetailsSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  bodyType: z.enum(bodyTypes).optional(),
  engineVolume: z.number().optional(),
  enginePower: z.number().optional(), // HP
  driveType: z.enum(driveTypes).optional(),
  fuelType: z.enum(fuelTypes).optional(),
  mileage: z.number().min(0).optional(),
  transmission: z.enum(transmissionTypes).optional(),
  color: z.enum(carColors).optional(),
  owners: z.number().min(1).optional(),
  condition: z.enum(conditionLevels),
});

export type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;

// Contact info for valuation request
export const contactInfoSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Full valuation request
export const valuationRequestSchema = z.object({
  vehicleDetails: vehicleDetailsSchema,
  contactInfo: contactInfoSchema,
});

export type ValuationRequest = z.infer<typeof valuationRequestSchema>;

// Individual damage item detected
export const damageItemSchema = z.object({
  type: z.enum(damageTypes),
  severity: z.enum(severityLevels),
  location: z.string(),
  description: z.string(),
  estimatedCost: z.number(),
  confidence: z.number().min(0).max(100),
});

export type DamageItem = z.infer<typeof damageItemSchema>;

// Vehicle valuation schema
export const vehicleValuationSchema = z.object({
  estimatedValueMin: z.number(),
  estimatedValueMax: z.number(),
  averageValue: z.number(),
  isPremiumBrand: z.boolean(),
  repairToValueRatio: z.number(),
});

export type VehicleValuation = z.infer<typeof vehicleValuationSchema>;

// Assessment result schema
export const assessmentResultSchema = z.object({
  damages: z.array(damageItemSchema),
  totalEstimatedCost: z.number(),
  overallSeverity: z.enum(severityLevels),
  decision: z.enum(decisionOutcomes),
  decisionReason: z.string(),
  repairRecommendations: z.array(z.string()),
  vehicleInfo: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.string().optional(),
    color: z.string().optional(),
  }).optional(),
  vehicleValuation: vehicleValuationSchema.optional(),
});

export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

// Database table for assessments
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array(),
  result: jsonb("result").$type<AssessmentResult>(),
  status: text("status").notNull().default("pending"),
  humanOverride: text("human_override"),
  humanOverrideReason: text("human_override_reason"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

// Standalone valuation (without damage assessment)
export const valuations = pgTable("valuations", {
  id: serial("id").primaryKey(),
  vehicleDetails: jsonb("vehicle_details").$type<VehicleDetails>().notNull(),
  contactInfo: jsonb("contact_info").$type<ContactInfo>().notNull(),
  valuation: jsonb("valuation").$type<VehicleValuation>(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
});

export type Valuation = typeof valuations.$inferSelect;
export type InsertValuation = z.infer<typeof insertValuationSchema>;

// Referral program
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referralCode: text("referral_code").notNull().unique(),
  telegramUserId: text("telegram_user_id").notNull(),
  telegramUsername: text("telegram_username"),
  referredCount: integer("referred_count").default(0).notNull(),
  bonusBalance: integer("bonus_balance").default(0).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

// Referral usage tracking
export const referralUsages = pgTable("referral_usages", {
  id: serial("id").primaryKey(),
  referralCode: text("referral_code").notNull(),
  usedByTelegramId: text("used_by_telegram_id").notNull(),
  usedAt: timestamp("used_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type ReferralUsage = typeof referralUsages.$inferSelect;
