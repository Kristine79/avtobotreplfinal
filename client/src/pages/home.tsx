import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Assessment, AssessmentResult, Valuation, VehicleDetails, ContactInfo } from "@shared/schema";
import { MultiImageUpload } from "@/components/image-upload";
import { AssessmentSummary } from "@/components/assessment-summary";
import { DecisionPanel } from "@/components/decision-panel";
import { DamageItemCard } from "@/components/damage-item";
import { AssessmentHistory } from "@/components/assessment-history";
import { VehicleValuationCard } from "@/components/vehicle-valuation";
import { ValuationWizard } from "@/components/valuation-wizard";
import { ValuationResult } from "@/components/valuation-result";
import { VinSearch } from "@/components/vin-search";
import { PaymentModal } from "@/components/payment-modal";
import { AnalyzingState } from "@/components/loading-skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Car, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  Upload,
  RefreshCw,
  Camera,
  Calculator,
  Settings,
  Search,
  Lock,
  Sparkles,
  Phone,
  Mail
} from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";

type AppMode = "damage" | "valuation" | "vin";

interface AdminSettings {
  vinSearchEnabled: boolean;
}

interface BrandingSettings {
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

const PHOTO_ANALYSIS_PRICE = 299; // Price in rubles

export default function Home() {
  const { toast } = useToast();
  
  const { data: adminSettings } = useQuery<AdminSettings>({
    queryKey: ["/api/admin/settings"],
  });

  const { data: branding } = useQuery<BrandingSettings>({
    queryKey: ["/api/admin/branding"],
  });

  const vinSearchEnabled = adminSettings?.vinSearchEnabled || false;
  const siteName = branding?.siteName || "AutoValue Pro";
  const siteTagline = branding?.siteTagline || "Мгновенная оценка автомобиля";
  const logoUrl = branding?.logoUrl || "";
  const contactPhone = branding?.contactPhone || "";
  const contactEmail = branding?.contactEmail || "";
  const telegramBot = branding?.telegramBot || "";
  const telegramChannel = branding?.telegramChannel || "";
  const whatsapp = branding?.whatsapp || "";
  
  const [mode, setMode] = useState<AppMode>("valuation");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [valuationResult, setValuationResult] = useState<Valuation | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const { data: assessments = [], isLoading: loadingAssessments } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  const analyzeMutation = useMutation({
    mutationFn: async (images: string[]) => {
      const response = await apiRequest("POST", "/api/assessments/analyze", { images });
      return response.json() as Promise<Assessment>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      setSelectedAssessment(data);
      toast({
        title: "Анализ завершён",
        description: "Оценка повреждений автомобиля успешно выполнена.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка анализа",
        description: error.message || "Не удалось проанализировать изображения. Попробуйте ещё раз.",
        variant: "destructive",
      });
    },
  });

  const valuationMutation = useMutation({
    mutationFn: async (data: { vehicleDetails: VehicleDetails; contactInfo: ContactInfo }) => {
      const response = await apiRequest("POST", "/api/valuations", data);
      return response.json() as Promise<Valuation>;
    },
    onSuccess: (data) => {
      setValuationResult(data);
      toast({
        title: "Оценка готова",
        description: "Рыночная стоимость автомобиля рассчитана.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка оценки",
        description: error.message || "Не удалось рассчитать стоимость. Попробуйте ещё раз.",
        variant: "destructive",
      });
    },
  });

  const handleImagesSelect = useCallback((newImages: Array<{file: File, preview: string}>) => {
    setImagePreviews(prev => [...prev, ...newImages.map(img => img.preview)]);
    setSelectedAssessment(null);
  }, []);

  const handleClearImages = useCallback(() => {
    setImagePreviews([]);
    setSelectedAssessment(null);
    setIsPaid(false);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAnalyze = useCallback(() => {
    if (imagePreviews.length > 0) {
      if (!isPaid) {
        setShowPaymentModal(true);
      } else {
        analyzeMutation.mutate(imagePreviews);
      }
    }
  }, [imagePreviews, analyzeMutation, isPaid]);

  const handlePaymentSuccess = useCallback(() => {
    setShowPaymentModal(false);
    setIsPaid(true);
    toast({
      title: "Оплата успешна",
      description: "Начинаем анализ изображений...",
    });
    // Start analysis after payment
    if (imagePreviews.length > 0) {
      analyzeMutation.mutate(imagePreviews);
    }
  }, [imagePreviews, analyzeMutation, toast]);

  const handleSelectAssessment = useCallback((assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setImagePreviews(assessment.imageUrls || [assessment.imageUrl]);
    setMode("damage");
    setIsPaid(true); // Already paid for past assessments
  }, []);

  const handleNewAssessment = useCallback(() => {
    setImagePreviews([]);
    setSelectedAssessment(null);
    setIsPaid(false);
  }, []);

  const handleValuationComplete = useCallback((vehicleDetails: VehicleDetails, contactInfo: ContactInfo) => {
    valuationMutation.mutate({ vehicleDetails, contactInfo });
  }, [valuationMutation]);

  const handleNewValuation = useCallback(() => {
    setValuationResult(null);
  }, []);

  const result = selectedAssessment?.result;
  const isAnalyzing = analyzeMutation.isPending;
  const isValuating = valuationMutation.isPending;
  const showResults = result && !isAnalyzing;

  return (
    <div className="min-h-screen bg-background">
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          price={PHOTO_ANALYSIS_PRICE}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground" data-testid="header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={siteName} 
                  className="h-10 w-auto rounded-md"
                  data-testid="img-site-logo"
                />
              ) : (
                <div className="p-2 rounded-md bg-white/10">
                  <Car className="h-6 w-6" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold" data-testid="text-app-title">{siteName}</h1>
                <p className="text-xs opacity-80" data-testid="text-app-subtitle">{siteTagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="button-admin"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              {mode === "damage" && (imagePreviews.length > 0 || selectedAssessment) && (
                <Button
                  variant="outline"
                  onClick={handleNewAssessment}
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="button-new-assessment"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Новая оценка
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" data-testid="main-content">
        {/* Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center p-1 bg-muted rounded-md gap-1" data-testid="mode-tabs">
            {vinSearchEnabled && (
              <Button
                variant={mode === "vin" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("vin")}
                className="gap-2"
                data-testid="tab-vin"
              >
                <Search className="h-4 w-4" />
                По госномеру/VIN
                <Badge variant="secondary" className="ml-1 text-[10px] px-1">Бесплатно</Badge>
              </Button>
            )}
            <Button
              variant={mode === "valuation" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("valuation")}
              className="gap-2"
              data-testid="tab-valuation"
            >
              <Calculator className="h-4 w-4" />
              По параметрам
              <Badge variant="secondary" className="ml-1 text-[10px] px-1">Бесплатно</Badge>
            </Button>
            <Button
              variant={mode === "damage" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("damage")}
              className="gap-2"
              data-testid="tab-damage"
            >
              <Camera className="h-4 w-4" />
              По фото
              <Badge variant="outline" className="ml-1 text-[10px] px-1 border-primary text-primary">
                {PHOTO_ANALYSIS_PRICE}₽
              </Badge>
            </Button>
          </div>
        </div>

        {/* VIN Search Mode */}
        {mode === "vin" && vinSearchEnabled && (
          <div className="py-4">
            {valuationResult ? (
              <ValuationResult 
                valuation={valuationResult} 
                onBack={handleNewValuation} 
              />
            ) : (
              <VinSearch 
                onComplete={handleValuationComplete}
                isSubmitting={isValuating}
              />
            )}
          </div>
        )}

        {/* Valuation Mode */}
        {mode === "valuation" && (
          <div className="py-4">
            {valuationResult ? (
              <ValuationResult 
                valuation={valuationResult} 
                onBack={handleNewValuation} 
              />
            ) : (
              <>
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-bold" data-testid="text-valuation-hero">
                    Поиск по параметрам
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Заполните данные об автомобиле и получите оценку рыночной стоимости 
                    на основе данных авторынка России 2024-2025
                  </p>
                </div>
                <ValuationWizard 
                  onComplete={handleValuationComplete}
                  isSubmitting={isValuating}
                />
              </>
            )}
          </div>
        )}

        {/* Damage Assessment Mode */}
        {mode === "damage" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {imagePreviews.length === 0 && !selectedAssessment && (
                <div className="space-y-6">
                  <div className="text-center space-y-4 py-8">
                    <div className="inline-flex items-center gap-2 justify-center">
                      <h2 className="text-3xl font-bold tracking-tight" data-testid="text-hero-title">
                        Поиск по фото
                      </h2>
                      <Badge className="bg-primary">
                        <Lock className="h-3 w-3 mr-1" />
                        {PHOTO_ANALYSIS_PRICE}₽
                      </Badge>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-description">
                      Загрузите до 10 фотографий автомобиля и наш ИИ автоматически определит повреждения, 
                      оценит стоимость ремонта и рыночную стоимость авто.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <Card className="flex flex-col items-center text-center p-4 overflow-visible" data-testid="card-feature-instant">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-sm" data-testid="text-feature-instant-title">Мгновенный анализ</h3>
                      <p className="text-xs text-muted-foreground mt-1" data-testid="text-feature-instant-desc">
                        Результат за секунды с помощью ИИ
                      </p>
                    </Card>
                    <Card className="flex flex-col items-center text-center p-4 overflow-visible" data-testid="card-feature-detection">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-sm" data-testid="text-feature-detection-title">Точное определение</h3>
                      <p className="text-xs text-muted-foreground mt-1" data-testid="text-feature-detection-desc">
                        Распознавание всех типов повреждений
                      </p>
                    </Card>
                    <Card className="flex flex-col items-center text-center p-4 overflow-visible" data-testid="card-feature-estimates">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-sm" data-testid="text-feature-estimates-title">Оценка стоимости</h3>
                      <p className="text-xs text-muted-foreground mt-1" data-testid="text-feature-estimates-desc">
                        Детальный расчёт ремонта в рублях
                      </p>
                    </Card>
                  </div>
                </div>
              )}

              <MultiImageUpload
                onImagesSelect={handleImagesSelect}
                previews={imagePreviews}
                onClear={handleClearImages}
                onRemoveImage={handleRemoveImage}
                disabled={isAnalyzing}
                maxImages={10}
              />

              {imagePreviews.length > 0 && !showResults && !isAnalyzing && !selectedAssessment && (
                <div className="flex flex-col items-center gap-3">
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    data-testid="button-analyze"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Анализировать повреждения
                    {!isPaid && (
                      <Badge variant="secondary" className="ml-2">
                        {PHOTO_ANALYSIS_PRICE}₽
                      </Badge>
                    )}
                  </Button>
                  {!isPaid && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Безопасная оплата после нажатия
                    </p>
                  )}
                </div>
              )}

              {isAnalyzing && <AnalyzingState />}

              {showResults && (
                <div className="space-y-6">
                  <AssessmentSummary result={result} imageCount={imagePreviews.length} />
                  
                  <DecisionPanel
                    decision={result.decision}
                    reason={result.decisionReason}
                    recommendations={result.repairRecommendations}
                  />

                  {result.vehicleValuation && (
                    <VehicleValuationCard
                      valuation={result.vehicleValuation}
                      repairCost={result.totalEstimatedCost}
                    />
                  )}

                  {result.damages.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2" data-testid="text-damages-header">
                        Обнаруженные повреждения
                        <span className="text-sm font-normal text-muted-foreground" data-testid="text-damages-count">
                          ({result.damages.length} найдено)
                        </span>
                      </h3>
                      <div className="grid gap-4">
                        {result.damages.map((damage, index) => (
                          <DamageItemCard key={index} damage={damage} index={index} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <AssessmentHistory
                  assessments={assessments}
                  onSelectAssessment={handleSelectAssessment}
                  selectedId={selectedAssessment?.id}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-16" data-testid="footer">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col gap-1">
              <p data-testid="text-footer-title">© 2026 {siteName}. Все права защищены.</p>
              <p data-testid="text-footer-powered">Работает на базе компьютерного зрения и ИИ</p>
            </div>
            {(contactPhone || contactEmail || telegramBot || telegramChannel || whatsapp) && (
              <div className="flex items-center gap-4 flex-wrap" data-testid="footer-contacts">
                {contactPhone && (
                  <a 
                    href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    data-testid="link-footer-phone"
                  >
                    <Phone className="h-4 w-4" />
                    {contactPhone}
                  </a>
                )}
                {contactEmail && (
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    data-testid="link-footer-email"
                  >
                    <Mail className="h-4 w-4" />
                    {contactEmail}
                  </a>
                )}
                {telegramBot && (
                  <a 
                    href={`https://t.me/${telegramBot.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    data-testid="link-footer-telegram-bot"
                  >
                    <SiTelegram className="h-4 w-4" />
                    Бот
                  </a>
                )}
                {telegramChannel && (
                  <a 
                    href={`https://t.me/${telegramChannel.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    data-testid="link-footer-telegram-channel"
                  >
                    <SiTelegram className="h-4 w-4" />
                    Канал
                  </a>
                )}
                {whatsapp && (
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    data-testid="link-footer-whatsapp"
                  >
                    <SiWhatsapp className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
