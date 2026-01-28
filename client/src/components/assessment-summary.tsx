import type { AssessmentResult, SeverityLevel } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RussianRuble, 
  AlertTriangle,
  Wrench,
  Car,
  Palette,
  Images
} from "lucide-react";

const severityConfig = {
  minor: {
    label: "Незначительные повреждения",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  moderate: {
    label: "Умеренные повреждения",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  severe: {
    label: "Серьёзные повреждения",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

interface AssessmentSummaryProps {
  result: AssessmentResult;
  imageCount?: number;
}

export function AssessmentSummary({ result, imageCount }: AssessmentSummaryProps) {
  const severityInfo = severityConfig[result.overallSeverity];

  return (
    <Card className="overflow-visible" data-testid="card-assessment-summary">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg" data-testid="text-summary-title">Результаты оценки</CardTitle>
          <Badge className={`${severityInfo.className} no-default-hover-elevate no-default-active-elevate`} data-testid="badge-overall-severity">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {severityInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="label-total-estimate">
              <RussianRuble className="h-4 w-4" />
              Общая стоимость
            </div>
            <p className="text-2xl font-bold text-primary" data-testid="text-total-cost">
              {result.totalEstimatedCost.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="label-damages-found">
              <Wrench className="h-4 w-4" />
              Обнаружено повреждений
            </div>
            <p className="text-2xl font-bold" data-testid="text-damage-count">
              {result.damages.length}
            </p>
          </div>
          
          {imageCount && imageCount > 1 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="label-images">
                <Images className="h-4 w-4" />
                Проанализировано фото
              </div>
              <p className="text-2xl font-bold" data-testid="text-image-count">
                {imageCount}
              </p>
            </div>
          )}
          
          {result.vehicleInfo?.make && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="label-vehicle">
                <Car className="h-4 w-4" />
                Автомобиль
              </div>
              <p className="text-sm font-medium" data-testid="text-vehicle-info">
                {result.vehicleInfo.year && `${result.vehicleInfo.year} `}
                {result.vehicleInfo.make}
                {result.vehicleInfo.model && ` ${result.vehicleInfo.model}`}
              </p>
            </div>
          )}
          
          {result.vehicleInfo?.color && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="label-color">
                <Palette className="h-4 w-4" />
                Цвет
              </div>
              <p className="text-sm font-medium capitalize" data-testid="text-vehicle-color">
                {result.vehicleInfo.color}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
