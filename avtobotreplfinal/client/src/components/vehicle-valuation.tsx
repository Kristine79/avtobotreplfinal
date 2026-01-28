import type { VehicleValuation } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Car,
  Calculator,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

interface VehicleValuationProps {
  valuation: VehicleValuation;
  repairCost: number;
}

export function VehicleValuationCard({ valuation, repairCost }: VehicleValuationProps) {
  const ratio = valuation.repairToValueRatio;
  
  // Determine recommendation based on repair-to-value ratio
  const getRecommendation = () => {
    if (ratio <= 10) {
      return {
        text: "Ремонт выгоден",
        description: "Стоимость ремонта незначительна относительно цены автомобиля",
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle2,
      };
    }
    if (ratio <= 30) {
      return {
        text: "Ремонт оправдан",
        description: "Стоимость ремонта приемлема для данного автомобиля",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: TrendingUp,
      };
    }
    if (ratio <= 50) {
      return {
        text: "Требует оценки",
        description: "Высокая стоимость ремонта - рекомендуется получить альтернативные предложения",
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        icon: AlertTriangle,
      };
    }
    return {
      text: "Ремонт нецелесообразен",
      description: "Стоимость ремонта превышает разумный порог - рассмотрите продажу",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: TrendingDown,
    };
  };

  const recommendation = getRecommendation();
  const RecommendationIcon = recommendation.icon;

  return (
    <Card className="overflow-visible" data-testid="card-vehicle-valuation">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2" data-testid="text-valuation-title">
            <Car className="h-5 w-5 text-muted-foreground" />
            Оценка стоимости авто
          </CardTitle>
          {valuation.isPremiumBrand && (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 no-default-hover-elevate no-default-active-elevate" data-testid="badge-premium">
              Премиум бренд
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground" data-testid="label-car-value">Рыночная стоимость</p>
            <p className="text-xl font-bold text-primary" data-testid="text-car-value">
              {valuation.estimatedValueMin.toLocaleString('ru-RU')} - {valuation.estimatedValueMax.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground" data-testid="label-repair-ratio">Ремонт / Стоимость</p>
            <p className="text-xl font-bold" data-testid="text-repair-ratio">
              {ratio}%
            </p>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-md ${recommendation.className.replace('text-', 'bg-').split(' ')[0]}/20`}>
              <RecommendationIcon className={`h-5 w-5 ${recommendation.className.split(' ')[1]}`} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge className={`${recommendation.className} no-default-hover-elevate no-default-active-elevate`} data-testid="badge-recommendation">
                  {recommendation.text}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-recommendation-desc">
                {recommendation.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Calculator className="h-3 w-3" />
          <span data-testid="text-valuation-source">Оценка на основе данных авторынка РФ 2024-2025</span>
        </div>
      </CardContent>
    </Card>
  );
}
