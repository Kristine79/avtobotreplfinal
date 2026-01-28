/**
 * Car valuation logic adapted from Auto-Value-Bot
 * Calculates estimated market value for vehicles in Russian market
 */

export interface CarValuationInput {
  brand: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface CarValuationResult {
  estimatedValueMin: number;
  estimatedValueMax: number;
  averageValue: number;
  isPremiumBrand: boolean;
  depreciationYears: number;
}

export interface PricingSettings {
  basePrice: number;
  premiumBrandMultiplier: number;
  depreciationRate: number;
  mileagePenalty: number;
  captchaEnabled: boolean;
  vinSearchEnabled: boolean;
}

export interface BrandingSettings {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  telegramBot: string;
  telegramChannel: string;
  whatsapp: string;
  primaryColor: string;
  accentColor: string;
}

// Default pricing parameters (in Russian Rubles)
let currentSettings: PricingSettings = {
  basePrice: 2_000_000,
  premiumBrandMultiplier: 1.5,
  depreciationRate: 0.95,
  mileagePenalty: 2000,
  captchaEnabled: false,
  vinSearchEnabled: false,
};

// Default branding settings
let brandingSettings: BrandingSettings = {
  siteName: 'AutoValue Pro',
  siteTagline: 'Мгновенная оценка автомобиля',
  logoUrl: '',
  contactPhone: '',
  contactEmail: '',
  telegramBot: '',
  telegramChannel: '',
  whatsapp: '',
  primaryColor: '220 90% 56%',
  accentColor: '142 76% 36%',
};

// Get branding settings
export function getBrandingSettings(): BrandingSettings {
  return { ...brandingSettings };
}

// Update branding settings
export function updateBrandingSettings(settings: Partial<BrandingSettings>): BrandingSettings {
  brandingSettings = { ...brandingSettings, ...settings };
  return { ...brandingSettings };
}

// Get current settings
export function getPricingSettings(): PricingSettings {
  return { ...currentSettings };
}

// Update settings
export function updatePricingSettings(settings: Partial<PricingSettings>): PricingSettings {
  currentSettings = { ...currentSettings, ...settings };
  return { ...currentSettings };
}

// Premium brands in Russian market
const PREMIUM_BRANDS = [
  'bmw', 'mercedes', 'mercedes-benz', 'audi', 'lexus', 'porsche', 
  'infiniti', 'jaguar', 'land rover', 'volvo', 'cadillac', 'genesis',
  'bentley', 'maserati', 'ferrari', 'lamborghini', 'rolls-royce'
];

// Brand class multipliers (relative to base price)
const BRAND_CLASS_MULTIPLIERS: Record<string, number> = {
  // Economy (0.6x)
  'lada': 0.6, 'vaz': 0.6, 'datsun': 0.6,
  // Compact (0.9x)
  'hyundai': 0.9, 'kia': 0.9, 'skoda': 0.9, 
  'renault': 0.9, 'nissan': 0.9, 'mazda': 0.9,
  'honda': 0.9, 'ford': 0.9, 'chevrolet': 0.9,
  'opel': 0.9, 'peugeot': 0.9, 'citroen': 0.9,
  'volkswagen': 0.9, 'mitsubishi': 0.9, 'suzuki': 0.9,
  // Midsize (1.25x)
  'toyota': 1.25, 'subaru': 1.25,
  // Premium brands (1.75x)
  'bmw': 1.75, 'mercedes': 2.0, 'mercedes-benz': 2.0,
  'audi': 1.75, 'lexus': 2.0, 'volvo': 1.5,
  'infiniti': 1.5, 'genesis': 2.0,
  // Luxury (3x)
  'porsche': 3.0, 'jaguar': 2.5, 'land rover': 2.5,
  'bentley': 5.0, 'maserati': 4.0, 'ferrari': 8.0,
  'lamborghini': 8.0, 'rolls-royce': 6.0,
};

export function calculateCarValue(input: CarValuationInput): CarValuationResult {
  const brandLower = input.brand.toLowerCase().trim();
  const settings = currentSettings;
  
  // Determine if premium brand
  const isPremiumBrand = PREMIUM_BRANDS.some(pb => brandLower.includes(pb));
  
  // Get brand multiplier
  const brandMultiplier = BRAND_CLASS_MULTIPLIERS[brandLower] || 1.0;
  let basePrice = settings.basePrice * brandMultiplier;
  
  // Apply premium brand multiplier
  if (isPremiumBrand) {
    basePrice *= settings.premiumBrandMultiplier;
  }
  
  // Calculate depreciation based on age
  const currentYear = new Date().getFullYear();
  const carYear = input.year || currentYear - 5;
  const age = Math.max(0, currentYear - carYear);
  
  let currentValue = basePrice * Math.pow(settings.depreciationRate, age);
  
  // Mileage penalty (if mileage exceeds expected for age)
  const averageAnnualMileage = 15000;
  if (input.mileage !== undefined) {
    const expectedMileage = age * averageAnnualMileage;
    const excessMileage = Math.max(0, input.mileage - expectedMileage);
    currentValue -= excessMileage * (settings.mileagePenalty / 1000);
  }
  
  // Condition multiplier
  const conditionMultipliers: Record<string, number> = {
    'excellent': 1.15,
    'good': 1.0,
    'fair': 0.85,
    'poor': 0.65,
  };
  currentValue *= conditionMultipliers[input.condition] || 1.0;
  
  // Ensure minimum value
  currentValue = Math.max(150_000, currentValue);
  
  return {
    estimatedValueMin: Math.round(currentValue * 0.9),
    estimatedValueMax: Math.round(currentValue * 1.1),
    averageValue: Math.round(currentValue),
    isPremiumBrand,
    depreciationYears: age,
  };
}

/**
 * Determines condition based on detected damage severity
 */
export function determineConditionFromDamage(
  overallSeverity: 'minor' | 'moderate' | 'severe',
  totalRepairCost: number
): 'excellent' | 'good' | 'fair' | 'poor' {
  if (overallSeverity === 'severe' || totalRepairCost > 300_000) {
    return 'poor';
  }
  if (overallSeverity === 'moderate' || totalRepairCost > 100_000) {
    return 'fair';
  }
  if (totalRepairCost > 30_000) {
    return 'good';
  }
  return 'excellent';
}
