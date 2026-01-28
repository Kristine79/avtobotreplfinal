import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AssessmentLoadingSkeleton() {
  return (
    <div className="space-y-6" data-testid="loading-assessment">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyzingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="analyzing-state">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative p-6 rounded-full bg-primary/10">
          <svg
            className="h-12 w-12 text-primary animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <h3 className="mt-6 text-lg font-medium">Анализ повреждений</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        ИИ анализирует ваши фотографии для определения повреждений, оценки стоимости ремонта и выработки рекомендаций.
      </p>
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span>Обычно это занимает 10-30 секунд</span>
      </div>
    </div>
  );
}
