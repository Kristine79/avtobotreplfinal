import type { Valuation, VehicleDetails, VehicleValuation } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  TrendingUp,
  Calendar,
  Gauge,
  Users,
  Settings,
  CheckCircle2,
  ArrowLeft,
  Download,
  Share2
} from "lucide-react";

interface ValuationResultProps {
  valuation: Valuation;
  onBack: () => void;
}

export function ValuationResult({ valuation, onBack }: ValuationResultProps) {
  const { vehicleDetails, valuation: result, contactInfo } = valuation;
  
  if (!result) {
    return null;
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      excellent: "Отличное",
      good: "Хорошее",
      fair: "Удовлетворительное",
      poor: "Плохое",
    };
    return labels[condition] || condition;
  };

  const getDriveLabel = (drive?: string) => {
    const labels: Record<string, string> = {
      fwd: "Передний",
      rwd: "Задний",
      awd: "Полный",
    };
    return drive ? labels[drive] || drive : "—";
  };

  const getTransmissionLabel = (transmission?: string) => {
    const labels: Record<string, string> = {
      automatic: "Автомат",
      manual: "Механика",
    };
    return transmission ? labels[transmission] || transmission : "—";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6" data-testid="valuation-result">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold" data-testid="text-result-title">Оценка готова!</h1>
        <p className="text-muted-foreground">
          Рыночная стоимость вашего {vehicleDetails.brand} {vehicleDetails.model}
        </p>
      </div>

      {/* Main Valuation Card */}
      <Card className="overflow-visible border-primary/20" data-testid="card-valuation-main">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Рыночная стоимость</p>
              <p className="text-4xl font-bold text-primary" data-testid="text-price-range">
                {formatPrice(result.estimatedValueMin)} — {formatPrice(result.estimatedValueMax)}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Средняя цена: <span className="font-medium" data-testid="text-average-price">{formatPrice(result.averageValue)}</span>
              </span>
            </div>
            {result.isPremiumBrand && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 no-default-hover-elevate no-default-active-elevate">
                Премиум бренд
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Summary */}
      <Card className="overflow-visible" data-testid="card-vehicle-details">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" />
            Данные автомобиля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Марка / Модель</p>
              <p className="font-medium">{vehicleDetails.brand} {vehicleDetails.model}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Год выпуска
              </p>
              <p className="font-medium">{vehicleDetails.year}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3 w-3" /> Пробег
              </p>
              <p className="font-medium">{vehicleDetails.mileage?.toLocaleString('ru-RU') || 0} км</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Settings className="h-3 w-3" /> Двигатель
              </p>
              <p className="font-medium">{vehicleDetails.engineVolume || "—"} л</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Привод</p>
              <p className="font-medium">{getDriveLabel(vehicleDetails.driveType)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">КПП</p>
              <p className="font-medium">{getTransmissionLabel(vehicleDetails.transmission)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Владельцев
              </p>
              <p className="font-medium">{vehicleDetails.owners || 1}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Состояние</p>
              <p className="font-medium">{getConditionLabel(vehicleDetails.condition)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="overflow-visible" data-testid="card-contact-info">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Контакт:</span>
            <span className="font-medium">{contactInfo.name}, {contactInfo.phone}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" data-testid="button-back-to-wizard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Новая оценка
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground" data-testid="text-disclaimer">
        Оценка основана на данных авторынка РФ 2025-2026. 
        Итоговая цена может отличаться в зависимости от региона и состояния рынка.
      </p>
    </div>
  );
}
