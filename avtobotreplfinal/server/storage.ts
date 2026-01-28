import { type User, type InsertUser, type Assessment, type InsertAssessment, type AssessmentResult, type Valuation, type VehicleDetails, type ContactInfo, type VehicleValuation, type Referral, type ReferralUsage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAllAssessments(): Promise<Assessment[]>;
  createAssessment(imageUrl: string, imageUrls?: string[]): Promise<Assessment>;
  updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined>;
  
  getValuation(id: number): Promise<Valuation | undefined>;
  getAllValuations(): Promise<Valuation[]>;
  createValuation(vehicleDetails: VehicleDetails, contactInfo: ContactInfo): Promise<Valuation>;
  updateValuation(id: number, updates: Partial<Valuation>): Promise<Valuation | undefined>;
  
  // Referral program
  getReferralByCode(code: string): Promise<Referral | undefined>;
  getReferralByTelegramId(telegramId: string): Promise<Referral | undefined>;
  createReferral(telegramId: string, username?: string): Promise<Referral>;
  incrementReferralCount(code: string): Promise<Referral | undefined>;
  addReferralBonus(code: string, amount: number): Promise<Referral | undefined>;
  useReferralBonus(code: string, amount: number): Promise<Referral | undefined>;
  recordReferralUsage(code: string, usedByTelegramId: string): Promise<ReferralUsage>;
  hasUsedReferral(telegramId: string): Promise<boolean>;
  getAllReferrals(): Promise<Referral[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assessments: Map<number, Assessment>;
  private valuations: Map<number, Valuation>;
  private referrals: Map<string, Referral>;
  private referralUsages: ReferralUsage[];
  private assessmentIdCounter: number;
  private valuationIdCounter: number;
  private referralIdCounter: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.valuations = new Map();
    this.referrals = new Map();
    this.referralUsages = [];
    this.assessmentIdCounter = 1;
    this.valuationIdCounter = 1;
    this.referralIdCounter = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAllAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAssessment(imageUrl: string, imageUrls?: string[]): Promise<Assessment> {
    const id = this.assessmentIdCounter++;
    const assessment: Assessment = {
      id,
      imageUrl,
      imageUrls: imageUrls || [imageUrl],
      result: null,
      status: "pending",
      humanOverride: null,
      humanOverrideReason: null,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;
    
    const updated = { ...assessment, ...updates };
    this.assessments.set(id, updated);
    return updated;
  }

  async getValuation(id: number): Promise<Valuation | undefined> {
    return this.valuations.get(id);
  }

  async getAllValuations(): Promise<Valuation[]> {
    return Array.from(this.valuations.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createValuation(vehicleDetails: VehicleDetails, contactInfo: ContactInfo): Promise<Valuation> {
    const id = this.valuationIdCounter++;
    const valuation: Valuation = {
      id,
      vehicleDetails,
      contactInfo,
      valuation: null,
      createdAt: new Date(),
    };
    this.valuations.set(id, valuation);
    return valuation;
  }

  async updateValuation(id: number, updates: Partial<Valuation>): Promise<Valuation | undefined> {
    const valuation = this.valuations.get(id);
    if (!valuation) return undefined;
    
    const updated = { ...valuation, ...updates };
    this.valuations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
