import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Valuation } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Car, 
  Save,
  ArrowLeft,
  Gauge,
  ShieldCheck,
  Bot,
  Search,
  Palette,
  Image,
  Phone,
  Mail,
  MessageCircle,
  Upload,
  X
} from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";

interface PricingSettings {
  basePrice: number;
  premiumBrandMultiplier: number;
  depreciationRate: number;
  mileagePenalty: number;
  captchaEnabled: boolean;
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

const COLOR_PRESETS = [
  { name: "Синий", primary: "220 90% 56%", accent: "142 76% 36%" },
  { name: "Красный", primary: "0 84% 60%", accent: "220 90% 56%" },
  { name: "Зелёный", primary: "142 76% 36%", accent: "220 90% 56%" },
  { name: "Фиолетовый", primary: "270 70% 60%", accent: "142 76% 36%" },
  { name: "Оранжевый", primary: "25 95% 53%", accent: "220 90% 56%" },
  { name: "Бирюзовый", primary: "174 72% 40%", accent: "270 70% 60%" },
];

export default function Admin() {
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const { data: settings, isLoading: loadingSettings } = useQuery<PricingSettings>({
    queryKey: ["/api/admin/settings"],
  });

  const { data: branding } = useQuery<BrandingSettings>({
    queryKey: ["/api/admin/branding"],
  });

  const { data: valuations = [] } = useQuery<Valuation[]>({
    queryKey: ["/api/valuations"],
  });

  const [basePrice, setBasePrice] = useState<number | undefined>();
  const [premiumMultiplier, setPremiumMultiplier] = useState<number | undefined>();
  const [depreciationRate, setDepreciationRate] = useState<number | undefined>();
  const [mileagePenalty, setMileagePenalty] = useState<number | undefined>();
  const [captchaEnabled, setCaptchaEnabled] = useState<boolean>(false);
  const [vinSearchEnabled, setVinSearchEnabled] = useState<boolean>(false);

  const [siteName, setSiteName] = useState("");
  const [siteTagline, setSiteTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [telegramBot, setTelegramBot] = useState("");
  const [telegramChannel, setTelegramChannel] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [primaryColor, setPrimaryColor] = useState("220 90% 56%");
  const [accentColor, setAccentColor] = useState("142 76% 36%");
  const [brandingInitialized, setBrandingInitialized] = useState(false);

  // Initialize form when settings load
  if (settings && basePrice === undefined) {
    setBasePrice(settings.basePrice);
    setPremiumMultiplier(settings.premiumBrandMultiplier);
    setDepreciationRate(settings.depreciationRate);
    setMileagePenalty(settings.mileagePenalty);
    setCaptchaEnabled(settings.captchaEnabled || false);
    setVinSearchEnabled(settings.vinSearchEnabled || false);
  }

  useEffect(() => {
    if (branding && !brandingInitialized) {
      setSiteName(branding.siteName);
      setSiteTagline(branding.siteTagline);
      setLogoUrl(branding.logoUrl);
      setContactPhone(branding.contactPhone);
      setContactEmail(branding.contactEmail);
      setTelegramBot(branding.telegramBot);
      setTelegramChannel(branding.telegramChannel);
      setWhatsapp(branding.whatsapp);
      setPrimaryColor(branding.primaryColor);
      setAccentColor(branding.accentColor);
      setBrandingInitialized(true);
    }
  }, [branding, brandingInitialized]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<PricingSettings>) => {
      const response = await apiRequest("PATCH", "/api/admin/settings", data);
      return response.json() as Promise<PricingSettings>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Настройки сохранены",
        description: "Параметры оценки успешно обновлены.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить настройки.",
        variant: "destructive",
      });
    },
  });

  const handleSave = (field: keyof PricingSettings, value: number) => {
    updateMutation.mutate({ [field]: value });
  };

  const brandingMutation = useMutation({
    mutationFn: async (data: Partial<BrandingSettings>) => {
      const response = await apiRequest("PATCH", "/api/admin/branding", data);
      return response.json() as Promise<BrandingSettings>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/branding"] });
      toast({
        title: "Брендинг сохранён",
        description: "Настройки сайта успешно обновлены.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить настройки.",
        variant: "destructive",
      });
    },
  });

  const logoMutation = useMutation({
    mutationFn: async (image: string) => {
      const response = await apiRequest("POST", "/api/admin/logo", { image });
      return response.json() as Promise<{ logoUrl: string }>;
    },
    onSuccess: (data) => {
      setLogoUrl(data.logoUrl);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/branding"] });
      toast({
        title: "Логотип загружен",
        description: "Логотип успешно обновлён.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось загрузить логотип.",
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ошибка",
        description: "Выберите изображение",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      logoMutation.mutate(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
    brandingMutation.mutate({ logoUrl: "" });
  };

  const handleSaveBranding = () => {
    brandingMutation.mutate({
      siteName,
      siteTagline,
      contactPhone,
      contactEmail,
      telegramBot,
      telegramChannel,
      whatsapp,
      primaryColor,
      accentColor,
    });
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setPrimaryColor(preset.primary);
    setAccentColor(preset.accent);
    brandingMutation.mutate({
      primaryColor: preset.primary,
      accentColor: preset.accent,
    });
  };

  // Calculate stats
  const totalRequests = valuations.length;
  const avgMileage = valuations.length > 0
    ? Math.round(valuations.reduce((sum, v) => sum + (v.vehicleDetails?.mileage || 0), 0) / valuations.length)
    : 0;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  const getDriveLabel = (drive?: string) => {
    const labels: Record<string, string> = { fwd: "Передний", rwd: "Задний", awd: "Полный" };
    return drive ? labels[drive] || drive.toUpperCase() : "—";
  };

  const getConditionLabel = (condition?: string) => {
    const labels: Record<string, string> = {
      excellent: "Отличное", good: "Хорошее", fair: "Среднее", poor: "Плохое"
    };
    return condition ? labels[condition] || condition : "—";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card" data-testid="admin-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-destructive" data-testid="text-admin-title">Панель администратора</h1>
              <p className="text-sm text-muted-foreground">Управление заявками и настройками оценки</p>
            </div>
            <Link href="/">
              <Button variant="outline" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" data-testid="admin-main">
        {/* Settings and Stats Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Pricing Parameters */}
          <Card className="overflow-visible" data-testid="card-pricing-settings">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-destructive" />
                Параметры оценки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Базовая цена (руб)
                  <span className="block text-[10px] opacity-60">base_price</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={basePrice || ""}
                    onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                    data-testid="input-base-price"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => basePrice && handleSave("basePrice", basePrice)}
                    data-testid="button-save-base-price"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Множитель премиум брендов
                  <span className="block text-[10px] opacity-60">premium_brand_multiplier</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={premiumMultiplier || ""}
                    onChange={(e) => setPremiumMultiplier(parseFloat(e.target.value) || 0)}
                    data-testid="input-premium-multiplier"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => premiumMultiplier && handleSave("premiumBrandMultiplier", premiumMultiplier)}
                    data-testid="button-save-premium-multiplier"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Годовой коэффициент (0.95 = -5%)
                  <span className="block text-[10px] opacity-60">depreciation_rate</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={depreciationRate || ""}
                    onChange={(e) => setDepreciationRate(parseFloat(e.target.value) || 0)}
                    data-testid="input-depreciation-rate"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => depreciationRate && handleSave("depreciationRate", depreciationRate)}
                    data-testid="button-save-depreciation-rate"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Штраф за пробег (руб/км)
                  <span className="block text-[10px] opacity-60">mileage_penalty</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={mileagePenalty || ""}
                    onChange={(e) => setMileagePenalty(parseInt(e.target.value) || 0)}
                    data-testid="input-mileage-penalty"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => mileagePenalty && handleSave("mileagePenalty", mileagePenalty)}
                    data-testid="button-save-mileage-penalty"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Requests Stat */}
          <Card className="overflow-visible" data-testid="card-total-requests">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Car className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Всего заявок</p>
                  <p className="text-3xl font-bold" data-testid="text-total-requests">{totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avg Mileage Stat */}
          <Card className="overflow-visible" data-testid="card-avg-mileage">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Gauge className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Средний пробег</p>
                  <p className="text-3xl font-bold" data-testid="text-avg-mileage">
                    {formatPrice(avgMileage)} км
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="overflow-visible mb-8" data-testid="card-security-settings">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-destructive" />
              Настройки безопасности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Защита от ботов (Captcha)</p>
                  <p className="text-sm text-muted-foreground">
                    Включить капчу для защиты форм от автоматических запросов
                  </p>
                </div>
              </div>
              <Switch
                checked={captchaEnabled}
                onCheckedChange={(checked) => {
                  setCaptchaEnabled(checked);
                  updateMutation.mutate({ captchaEnabled: checked });
                }}
                data-testid="switch-captcha"
              />
            </div>
            {captchaEnabled && (
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-700 dark:text-green-400">
                Капча включена. Пользователи будут видеть проверку перед отправкой форм.
              </div>
            )}

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 mt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Поиск по госномеру/VIN</p>
                  <p className="text-sm text-muted-foreground">
                    Включить функцию поиска автомобиля по госномеру или VIN-коду (требуется API)
                  </p>
                </div>
              </div>
              <Switch
                checked={vinSearchEnabled}
                onCheckedChange={(checked) => {
                  setVinSearchEnabled(checked);
                  updateMutation.mutate({ vinSearchEnabled: checked });
                }}
                data-testid="switch-vin-search"
              />
            </div>
            {vinSearchEnabled && (
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-700 dark:text-blue-400">
                Поиск по госномеру/VIN включён. Для работы требуется подключение к API (Номерограм, АвтоПроверка).
              </div>
            )}
          </CardContent>
        </Card>

        {/* Branding Settings */}
        <Card className="overflow-visible mb-8" data-testid="card-branding-settings">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-destructive" />
              Настройки брендинга
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Image className="h-4 w-4" />
                Логотип сайта
              </Label>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <div className="relative">
                    <img 
                      src={logoUrl} 
                      alt="Логотип" 
                      className="h-16 w-auto rounded-md border"
                      data-testid="img-logo-preview"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                      onClick={handleRemoveLogo}
                      data-testid="button-remove-logo"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-16 w-32 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                    Нет логотипа
                  </div>
                )}
                <div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    data-testid="input-logo-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoMutation.isPending}
                    data-testid="button-upload-logo"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {logoMutation.isPending ? "Загрузка..." : "Загрузить"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Site Name and Tagline */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Название сайта</Label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="AutoValue Pro"
                  data-testid="input-site-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Слоган</Label>
                <Input
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  placeholder="Мгновенная оценка автомобиля"
                  data-testid="input-site-tagline"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Контактная информация</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Телефон
                  </Label>
                  <Input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    data-testid="input-contact-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="info@autovalue.ru"
                    data-testid="input-contact-email"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Мессенджеры и соцсети</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <SiTelegram className="h-3 w-3" /> Telegram бот
                  </Label>
                  <Input
                    value={telegramBot}
                    onChange={(e) => setTelegramBot(e.target.value)}
                    placeholder="@autovalue_bot"
                    data-testid="input-telegram-bot"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <MessageCircle className="h-3 w-3" /> Telegram канал
                  </Label>
                  <Input
                    value={telegramChannel}
                    onChange={(e) => setTelegramChannel(e.target.value)}
                    placeholder="@autovalue_channel"
                    data-testid="input-telegram-channel"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <SiWhatsapp className="h-3 w-3" /> WhatsApp
                  </Label>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    data-testid="input-whatsapp"
                  />
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Цветовая схема
              </Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyColorPreset(preset)}
                    className="flex items-center gap-2"
                    data-testid={`button-color-${preset.name.toLowerCase()}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: `hsl(${preset.primary})` }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: `hsl(${preset.accent})` }}
                    />
                    {preset.name}
                  </Button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Основной цвет (HSL)</Label>
                  <div className="flex gap-2 items-center">
                    <div 
                      className="w-8 h-8 rounded-md border"
                      style={{ backgroundColor: `hsl(${primaryColor})` }}
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="220 90% 56%"
                      data-testid="input-primary-color"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Акцентный цвет (HSL)</Label>
                  <div className="flex gap-2 items-center">
                    <div 
                      className="w-8 h-8 rounded-md border"
                      style={{ backgroundColor: `hsl(${accentColor})` }}
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="142 76% 36%"
                      data-testid="input-accent-color"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSaveBranding}
                disabled={brandingMutation.isPending}
                data-testid="button-save-branding"
              >
                <Save className="h-4 w-4 mr-2" />
                {brandingMutation.isPending ? "Сохранение..." : "Сохранить брендинг"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Incoming Requests Table */}
        <Card className="overflow-visible" data-testid="card-requests-table">
          <CardHeader>
            <CardTitle className="text-lg">Входящие заявки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-requests">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-2 font-medium">Дата</th>
                    <th className="text-left py-3 px-2 font-medium">Автомобиль</th>
                    <th className="text-left py-3 px-2 font-medium">Характеристики</th>
                    <th className="text-left py-3 px-2 font-medium">Контакт</th>
                    <th className="text-right py-3 px-2 font-medium">Оценка (руб)</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((v) => (
                    <tr key={v.id} className="border-b border-border/50 hover-elevate" data-testid={`row-request-${v.id}`}>
                      <td className="py-3 px-2 text-muted-foreground">
                        {formatDate(v.createdAt)}
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <span className="font-medium">{v.vehicleDetails?.brand} {v.vehicleDetails?.model}</span>
                          <span className="block text-xs text-muted-foreground">
                            {v.vehicleDetails?.year} • {getConditionLabel(v.vehicleDetails?.condition)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <span>{v.vehicleDetails?.engineVolume || 0}L • {getDriveLabel(v.vehicleDetails?.driveType)}</span>
                          <span className="block text-xs text-muted-foreground">
                            {formatPrice(v.vehicleDetails?.mileage || 0)} км
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <span>{v.contactInfo?.name}</span>
                          <span className="block text-xs text-destructive">
                            {v.contactInfo?.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {v.valuation ? formatPrice(v.valuation.averageValue) : "—"}
                      </td>
                    </tr>
                  ))}
                  {valuations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        Нет заявок
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
