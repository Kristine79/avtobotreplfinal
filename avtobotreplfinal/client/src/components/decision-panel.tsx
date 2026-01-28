import type { DecisionOutcome } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Eye, 
  AlertTriangle,
  FileText,
  Lightbulb
} from "lucide-react";

const decisionConfig = {
  auto_approve: {
    icon: CheckCircle2,
    label: "Автоматически одобрено",
    description: "Заявка может быть обработана автоматически",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    iconClassName: "text-green-600 dark:text-green-400",
  },
  human_review: {
    icon: Eye,
    label: "Требуется проверка",
    description: "Заявка требует ручной проверки специалистом. См. контакты ниже",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    iconClassName: "text-yellow-600 dark:text-yellow-400",
  },
  escalate: {
    icon: AlertTriangle,
    label: "Требуется эскалация",
    description: "Заявка требует немедленного внимания нашим специалистом.",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    iconClassName: "text-red-600 dark:text-red-400",
  },
};

interface DecisionPanelProps {
  decision: DecisionOutcome;
  reason: string;
  recommendations: string[];
}

export function DecisionPanel({ decision, reason, recommendations }: DecisionPanelProps) {
  const config = decisionConfig[decision];
  const DecisionIcon = config.icon;

  return (
    <Card className="overflow-visible" data-testid="card-decision">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2" data-testid="text-decision-title">
            <DecisionIcon className={`h-5 w-5 ${config.iconClassName}`} />
            Решение
          </CardTitle>
          <Badge className={`${config.className} no-default-hover-elevate no-default-active-elevate text-sm`} data-testid="badge-decision">
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground" data-testid="text-decision-description">{config.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium" data-testid="text-rationale-header">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Обоснование решения
          </div>
          <p className="text-sm text-muted-foreground pl-6" data-testid="text-decision-reason">
            {reason}
          </p>
        </div>
        
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium" data-testid="text-recommendations-header">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              Рекомендации по ремонту
            </div>
            <ul className="space-y-1 pl-6" data-testid="list-recommendations">
              {recommendations.map((rec, index) => (
                <li 
                  key={index} 
                  className="text-sm text-muted-foreground flex items-start gap-2"
                  data-testid={`text-recommendation-${index}`}
                >
                  <span className="text-primary mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
