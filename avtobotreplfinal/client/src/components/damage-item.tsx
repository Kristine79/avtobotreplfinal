import type { DamageItem as DamageItemType } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info,
  Wrench,
  MapPin,
  Percent,
  RussianRuble
} from "lucide-react";

const severityConfig = {
  minor: {
    icon: Info,
    label: "Незначительное",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  moderate: {
    icon: AlertCircle,
    label: "Умеренное",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  severe: {
    icon: AlertTriangle,
    label: "Серьёзное",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

const damageTypeLabels: Record<string, string> = {
  dent: "Вмятина",
  scratch: "Царапина",
  crack: "Трещина",
  broken_light: "Разбитая фара",
  broken_mirror: "Разбитое зеркало",
  broken_window: "Разбитое стекло",
  paint_damage: "Повреждение ЛКП",
  rust: "Коррозия",
  bumper_damage: "Повреждение бампера",
  structural_damage: "Структурное повреждение",
};

interface DamageItemProps {
  damage: DamageItemType;
  index: number;
}

export function DamageItemCard({ damage, index }: DamageItemProps) {
  const severityInfo = severityConfig[damage.severity];
  const SeverityIcon = severityInfo.icon;

  return (
    <Card className="overflow-visible" data-testid={`card-damage-${index}`}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary/10">
              <Wrench className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm" data-testid={`text-damage-type-${index}`}>
                {damageTypeLabels[damage.type] || damage.type}
              </h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`text-damage-location-${index}`}>
                <MapPin className="h-3 w-3" />
                {damage.location}
              </div>
            </div>
          </div>
          <Badge className={`${severityInfo.className} no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-severity-${index}`}>
            <SeverityIcon className="h-3 w-3 mr-1" />
            {severityInfo.label}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-damage-description-${index}`}>
          {damage.description}
        </p>
        
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
          <div className="flex items-center gap-1 text-sm" data-testid={`text-damage-cost-${index}`}>
            <RussianRuble className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{damage.estimatedCost.toLocaleString('ru-RU')} ₽</span>
            <span className="text-muted-foreground text-xs">оценка</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`text-damage-confidence-${index}`}>
            <Percent className="h-3 w-3" />
            <span>уверенность {damage.confidence}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
