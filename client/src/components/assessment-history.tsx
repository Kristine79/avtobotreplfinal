import type { Assessment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface AssessmentHistoryProps {
  assessments: Assessment[];
  onSelectAssessment: (assessment: Assessment) => void;
  selectedId?: number;
}

const statusConfig = {
  pending: {
    label: "В обработке",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  completed: {
    label: "Завершено",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  error: {
    label: "Ошибка",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

const decisionIcons = {
  auto_approve: CheckCircle2,
  human_review: Eye,
  escalate: AlertTriangle,
};

export function AssessmentHistory({ assessments, onSelectAssessment, selectedId }: AssessmentHistoryProps) {
  if (assessments.length === 0) {
    return (
      <Card className="overflow-visible" data-testid="card-history">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2" data-testid="text-history-title">
            <Clock className="h-5 w-5 text-muted-foreground" />
            История оценок
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="empty-state-history">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground" data-testid="text-empty-message">
              Пока нет оценок. Загрузите фото для начала.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible" data-testid="card-history">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2" data-testid="text-history-title">
          <Clock className="h-5 w-5 text-muted-foreground" />
          История оценок
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {assessments.map((assessment) => {
              const status = statusConfig[assessment.status as keyof typeof statusConfig] || statusConfig.pending;
              const decision = assessment.result?.decision;
              const DecisionIcon = decision ? decisionIcons[decision] : null;
              const isSelected = assessment.id === selectedId;

              return (
                <button
                  key={assessment.id}
                  onClick={() => onSelectAssessment(assessment)}
                  className={`w-full text-left p-4 hover-elevate active-elevate-2 transition-colors ${
                    isSelected ? "bg-primary/5" : ""
                  }`}
                  data-testid={`button-assessment-${assessment.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-muted overflow-hidden">
                      <img
                        src={assessment.imageUrl}
                        alt="Миниатюра"
                        className="w-full h-full object-cover"
                        data-testid={`img-assessment-thumb-${assessment.id}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge className={`${status.className} text-xs no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-status-${assessment.id}`}>
                          {status.label}
                        </Badge>
                        {DecisionIcon && (
                          <DecisionIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm font-medium truncate" data-testid={`text-assessment-summary-${assessment.id}`}>
                        {assessment.result 
                          ? `Найдено повреждений: ${assessment.result.damages.length}`
                          : "Обработка..."}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`text-assessment-time-${assessment.id}`}>
                        {formatDistanceToNow(new Date(assessment.createdAt), { addSuffix: true, locale: ru })}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
