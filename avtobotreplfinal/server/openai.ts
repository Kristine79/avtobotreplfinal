import OpenAI from "openai";
import type { AssessmentResult, DamageItem, SeverityLevel, DecisionOutcome, DamageType } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const DAMAGE_ANALYSIS_PROMPT = `You are an expert vehicle damage assessor AI for the Russian market. Analyze the provided image of a vehicle and identify all visible damage.

CRITICAL: All prices are in RUSSIAN RUBLES (₽). One dollar = approximately 90 rubles. These are THOUSANDS of rubles, not dollars or euros.

Use these REAL RUSSIAN MARKET PRICES for repair cost estimates (based on 2024-2025 AUTOSTAT data):

BODY REPAIR (кузовной ремонт) - prices in RUBLES:
- Small dent (PDR/вмятина до 5см): 3000 to 8000 rubles
- Medium dent (вмятина 5-15см): 8000 to 20000 rubles
- Large dent with paint (вмятина с покраской): 15000 to 40000 rubles
- Deep scratch (глубокая царапина): 5000 to 15000 rubles
- Surface scratch (поверхностная царапина): 2000 to 5000 rubles
- Paint touch-up (локальная покраска): 8000 to 25000 rubles
- Full panel repaint (полная покраска панели): 25000 to 50000 rubles
- Bumper repair (ремонт бампера): 10000 to 30000 rubles
- Bumper replacement (замена бампера): 25000 to 80000 rubles
- Door repair (ремонт двери): 15000 to 45000 rubles
- Door replacement (замена двери): 40000 to 120000 rubles
- Hood repair (ремонт капота): 20000 to 50000 rubles
- Fender repair (ремонт крыла): 15000 to 40000 rubles

GLASS & LIGHTS (стёкла и оптика) - prices in RUBLES:
- Windshield replacement (замена лобового стекла): 15000 to 60000 rubles
- Side window (боковое стекло): 8000 to 25000 rubles
- Headlight repair (ремонт фары): 5000 to 15000 rubles
- Headlight replacement (замена фары): 15000 to 80000 rubles (original), 8000 to 25000 rubles (aftermarket)
- Tail light replacement (замена заднего фонаря): 10000 to 40000 rubles
- Mirror replacement (замена зеркала): 8000 to 35000 rubles

STRUCTURAL (структурные повреждения) - prices in RUBLES:
- Frame straightening (рихтовка рамы): 50000 to 200000 rubles
- Structural damage repair: 100000 to 500000 rubles or more
- Suspension damage: 30000 to 150000 rubles

RUST TREATMENT (обработка ржавчины) - prices in RUBLES:
- Small rust spot: 5000 to 15000 rubles
- Medium rust area: 15000 to 40000 rubles
- Extensive rust repair: 40000 to 100000 rubles or more

IMPORTANT: estimatedCost values MUST be whole numbers in rubles (e.g., 25000 not 25, 8000 not 8). Even a small scratch costs at least 2000 rubles minimum.

For each piece of damage you detect, provide:
1. Type of damage (one of: dent, scratch, crack, broken_light, broken_mirror, broken_window, paint_damage, rust, bumper_damage, structural_damage)
2. Severity (minor, moderate, or severe)
3. Location on the vehicle (e.g., "передний бампер", "водительская дверь", "заднее левое крыло")
4. Detailed description of the damage in Russian
5. Estimated repair cost in Russian Rubles (₽) - use the price ranges above
6. Your confidence level (0-100%)

Also provide:
- Overall severity assessment (minor, moderate, or severe)
- A decision recommendation:
  - "auto_approve" - for minor damage under 180,000₽ total that is clearly documented
  - "human_review" - for moderate damage between 180,000₽-630,000₽ or unclear damage
  - "escalate" - for severe damage over 630,000₽ or potential structural/safety issues
- Reason for the decision (in Russian)
- Repair recommendations (in Russian)
- Vehicle information if identifiable (make, model, year, color)

If no damage is visible, return an empty damages array and set decision to "auto_approve" with appropriate messaging.

Respond in JSON format matching this structure:
{
  "damages": [
    {
      "type": "dent",
      "severity": "minor",
      "location": "передний бампер",
      "description": "Небольшая вмятина диаметром около 5 см",
      "estimatedCost": 8000,
      "confidence": 85
    }
  ],
  "totalEstimatedCost": 8000,
  "overallSeverity": "minor",
  "decision": "auto_approve",
  "decisionReason": "Незначительное повреждение с чёткой документацией и низкой стоимостью ремонта",
  "repairRecommendations": ["Рекомендуется PDR (беспокрасочное удаление вмятин)", "Нет проблем с безопасностью"],
  "vehicleInfo": {
    "make": "Toyota",
    "model": "Camry",
    "year": "2022",
    "color": "серебристый"
  }
}`;

// Analyze multiple images for comprehensive damage assessment
export async function analyzeMultipleImages(imagesBase64: string[]): Promise<AssessmentResult> {
  try {
    // Build content array with all images
    const imageContent: any[] = [
      {
        type: "text",
        text: `Пожалуйста, проанализируйте эти ${imagesBase64.length} изображений автомобиля на предмет повреждений. Объедините все обнаруженные повреждения со всех фото в единую оценку. Используйте цены в российских рублях.`,
      },
      ...imagesBase64.map((img, idx) => ({
        type: "image_url",
        image_url: {
          url: img,
          detail: "high"
        },
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: DAMAGE_ANALYSIS_PROMPT + `

ВАЖНО: Вы анализируете несколько фотографий одного автомобиля. Объедините все обнаруженные повреждения в единый список, избегая дублирования. Если одно и то же повреждение видно на нескольких фото, учитывайте его только один раз.`,
        },
        {
          role: "user",
          content: imageContent,
        },
      ],
      max_completion_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI model");
    }

    const result = JSON.parse(content);
    
    // Validate and sanitize the response
    const validDamageTypes = ["dent", "scratch", "crack", "broken_light", "broken_mirror", "broken_window", "paint_damage", "rust", "bumper_damage", "structural_damage"];
    const validSeverities = ["minor", "moderate", "severe"];
    const validDecisions = ["auto_approve", "human_review", "escalate"];

    const damages: DamageItem[] = (result.damages || []).map((d: any) => {
      let cost = Number(d.estimatedCost) || 0;
      // If cost is suspiciously low (AI returned value in thousands instead of rubles),
      // multiply by 1000 to get proper ruble amount
      if (cost > 0 && cost < 1000) {
        cost = cost * 1000;
      }
      // Minimum cost for any damage is 2000 rubles
      cost = Math.max(2000, cost);
      
      return {
        type: validDamageTypes.includes(d.type) ? d.type : "scratch",
        severity: validSeverities.includes(d.severity) ? d.severity : "moderate",
        location: String(d.location || "Неизвестное расположение"),
        description: String(d.description || "Обнаружено повреждение"),
        estimatedCost: Math.round(cost),
        confidence: Math.min(100, Math.max(0, Number(d.confidence) || 50)),
      };
    });

    const totalCost = damages.reduce((sum, d) => sum + d.estimatedCost, 0);
    
    let decision: DecisionOutcome = "human_review";
    if (validDecisions.includes(result.decision)) {
      decision = result.decision;
    } else if (totalCost < 180000 && damages.every(d => d.severity === "minor")) {
      decision = "auto_approve";
    } else if (totalCost > 630000 || damages.some(d => d.severity === "severe")) {
      decision = "escalate";
    }

    const overallSeverity: SeverityLevel = validSeverities.includes(result.overallSeverity) 
      ? result.overallSeverity 
      : damages.some(d => d.severity === "severe") ? "severe"
        : damages.some(d => d.severity === "moderate") ? "moderate"
        : "minor";

    return {
      damages,
      totalEstimatedCost: totalCost || result.totalEstimatedCost || 0,
      overallSeverity,
      decision,
      decisionReason: String(result.decisionReason || "Оценка выполнена на основе анализа нескольких изображений"),
      repairRecommendations: Array.isArray(result.repairRecommendations) 
        ? result.repairRecommendations.map(String)
        : [],
      vehicleInfo: result.vehicleInfo ? {
        make: result.vehicleInfo.make,
        model: result.vehicleInfo.model,
        year: result.vehicleInfo.year,
        color: result.vehicleInfo.color,
      } : undefined,
    };
  } catch (error) {
    console.error("Error analyzing multiple vehicle images:", error);
    throw new Error("Failed to analyze vehicle damage. Please try again.");
  }
}

export async function analyzeVehicleDamage(imageBase64: string): Promise<AssessmentResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: DAMAGE_ANALYSIS_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Пожалуйста, проанализируйте это изображение автомобиля на предмет повреждений и предоставьте полную оценку с ценами в российских рублях.",
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_completion_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI model");
    }

    const result = JSON.parse(content);
    
    // Validate and sanitize the response
    const validDamageTypes = ["dent", "scratch", "crack", "broken_light", "broken_mirror", "broken_window", "paint_damage", "rust", "bumper_damage", "structural_damage"];
    const validSeverities = ["minor", "moderate", "severe"];
    const validDecisions = ["auto_approve", "human_review", "escalate"];

    const damages: DamageItem[] = (result.damages || []).map((d: any) => {
      let cost = Number(d.estimatedCost) || 0;
      // If cost is suspiciously low (AI returned value in thousands instead of rubles),
      // multiply by 1000 to get proper ruble amount
      if (cost > 0 && cost < 1000) {
        cost = cost * 1000;
      }
      // Minimum cost for any damage is 2000 rubles
      cost = Math.max(2000, cost);
      
      return {
        type: validDamageTypes.includes(d.type) ? d.type : "scratch",
        severity: validSeverities.includes(d.severity) ? d.severity : "moderate",
        location: String(d.location || "Неизвестное расположение"),
        description: String(d.description || "Обнаружено повреждение"),
        estimatedCost: Math.round(cost),
        confidence: Math.min(100, Math.max(0, Number(d.confidence) || 50)),
      };
    });

    const totalCost = damages.reduce((sum, d) => sum + d.estimatedCost, 0);
    
    // Determine decision based on cost and severity (thresholds in rubles)
    // 180,000₽ ≈ $2,000, 630,000₽ ≈ $7,000
    let decision: DecisionOutcome = "human_review";
    if (validDecisions.includes(result.decision)) {
      decision = result.decision;
    } else if (totalCost < 180000 && damages.every(d => d.severity === "minor")) {
      decision = "auto_approve";
    } else if (totalCost > 630000 || damages.some(d => d.severity === "severe")) {
      decision = "escalate";
    }

    const overallSeverity: SeverityLevel = validSeverities.includes(result.overallSeverity) 
      ? result.overallSeverity 
      : damages.some(d => d.severity === "severe") ? "severe"
        : damages.some(d => d.severity === "moderate") ? "moderate"
        : "minor";

    return {
      damages,
      totalEstimatedCost: totalCost || result.totalEstimatedCost || 0,
      overallSeverity,
      decision,
      decisionReason: String(result.decisionReason || "Оценка выполнена на основе обнаруженных повреждений"),
      repairRecommendations: Array.isArray(result.repairRecommendations) 
        ? result.repairRecommendations.map(String)
        : [],
      vehicleInfo: result.vehicleInfo ? {
        make: result.vehicleInfo.make,
        model: result.vehicleInfo.model,
        year: result.vehicleInfo.year,
        color: result.vehicleInfo.color,
      } : undefined,
    };
  } catch (error) {
    console.error("Error analyzing vehicle damage:", error);
    throw new Error("Failed to analyze vehicle damage. Please try again.");
  }
}
