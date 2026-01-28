import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { VehicleDetails, ContactInfo, ConditionLevel, DriveType, TransmissionType, BodyType, FuelType, CarColor } from "@shared/schema";
import { 
  filterBrands, 
  filterModels, 
  BODY_TYPES, 
  FUEL_TYPES, 
  COLORS 
} from "@/data/car-data";
import { 
  Car, 
  Settings, 
  ClipboardCheck, 
  User,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Search
} from "lucide-react";

interface ValuationWizardProps {
  onComplete: (vehicleDetails: VehicleDetails, contactInfo: ContactInfo) => void;
  isSubmitting?: boolean;
}

const STEPS = [
  { id: 1, title: "Данные авто", icon: Car },
  { id: 2, title: "Характеристики", icon: Settings },
  { id: 3, title: "Состояние", icon: ClipboardCheck },
  { id: 4, title: "Контакты", icon: User },
];

const CONDITION_OPTIONS: { value: ConditionLevel; label: string; description: string }[] = [
  { value: "excellent", label: "Отличное", description: "Как новый, без царапин" },
  { value: "good", label: "Хорошее", description: "Небольшой износ, хорошо обслуживается" },
  { value: "fair", label: "Удовлетворительное", description: "Заметный износ, требует обслуживания" },
  { value: "poor", label: "Плохое", description: "Серьёзные повреждения или проблемы" },
];

const DRIVE_OPTIONS: { value: DriveType; label: string }[] = [
  { value: "fwd", label: "Передний" },
  { value: "rwd", label: "Задний" },
  { value: "awd", label: "Полный" },
];

const TRANSMISSION_OPTIONS: { value: TransmissionType; label: string }[] = [
  { value: "automatic", label: "Автомат" },
  { value: "manual", label: "Механика" },
];

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  disabled?: boolean;
  testId: string;
  icon?: React.ReactNode;
}

function Autocomplete({ value, onChange, suggestions, placeholder, disabled, testId, icon }: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFiltered(suggestions.slice(0, 10));
  }, [suggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setFiltered(suggestions.filter(s => 
      s.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 10));
    setIsOpen(true);
  };

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={icon ? "pl-10" : ""}
          data-testid={testId}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filtered.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground text-sm transition-colors"
              data-testid={`suggestion-${testId}-${index}`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ValuationWizard({ onComplete, isSubmitting }: ValuationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [bodyType, setBodyType] = useState<BodyType | undefined>();
  const [engineVolume, setEngineVolume] = useState<number | undefined>(2.0);
  const [enginePower, setEnginePower] = useState<number | undefined>();
  const [driveType, setDriveType] = useState<DriveType>("fwd");
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const [mileage, setMileage] = useState<number | undefined>(0);
  const [transmission, setTransmission] = useState<TransmissionType>("automatic");
  const [color, setColor] = useState<CarColor | undefined>();
  const [owners, setOwners] = useState(1);
  const [condition, setCondition] = useState<ConditionLevel>("good");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Autocomplete suggestions
  const brandSuggestions = filterBrands(brand);
  const modelSuggestions = filterModels(brand, model);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!brand.trim()) newErrors.brand = "Пожалуйста, выберите марку";
      if (!model.trim()) newErrors.model = "Пожалуйста, выберите модель";
      if (!year || year < 1990 || year > new Date().getFullYear() + 1) {
        newErrors.year = "Укажите корректный год";
      }
    }
    
    if (step === 4) {
      if (!name.trim()) newErrors.name = "Пожалуйста, введите имя";
      if (!phone.trim() || phone.length < 5) newErrors.phone = "Пожалуйста, введите номер телефона";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const vehicleDetails: VehicleDetails = {
      brand,
      model,
      year,
      bodyType,
      engineVolume,
      enginePower,
      driveType,
      fuelType,
      mileage,
      transmission,
      color,
      owners,
      condition,
    };
    
    const contactInfo: ContactInfo = {
      name,
      phone,
    };
    
    onComplete(vehicleDetails, contactInfo);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  return (
    <div className="w-full max-w-lg mx-auto" data-testid="valuation-wizard">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 relative">
          {/* Progress line */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-muted rounded-full -z-10" />
          <div 
            className="absolute top-5 left-1/2 h-1 bg-primary rounded-full transition-all duration-300 -z-10"
            style={{ 
              width: `${((currentStep - 1) / 3) * 75}%`,
              transform: 'translateX(-50%)'
            }}
          />
          
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`step-indicator-${step.id}`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="overflow-visible" data-testid="card-wizard-step">
        <CardContent className="p-6">
          {/* Step 1: Car Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold" data-testid="text-step-title">Данные автомобиля</h2>
                <p className="text-sm text-muted-foreground mt-1">Выберите марку и модель</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">МАРКА / БРЕНД</Label>
                  <Autocomplete
                    value={brand}
                    onChange={(val) => {
                      setBrand(val);
                      setModel(""); // Reset model when brand changes
                    }}
                    suggestions={brandSuggestions}
                    placeholder="Начните вводить марку..."
                    testId="input-brand"
                    icon={<Car className="h-4 w-4" />}
                  />
                  {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">МОДЕЛЬ</Label>
                  <Autocomplete
                    value={model}
                    onChange={setModel}
                    suggestions={modelSuggestions}
                    placeholder="Начните вводить модель..."
                    disabled={!brand}
                    testId="input-model"
                  />
                  {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">ГОД ВЫПУСКА</Label>
                    <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                      <SelectTrigger data-testid="select-year">
                        <SelectValue placeholder="Год" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyType">ТИП КУЗОВА</Label>
                    <Select value={bodyType || ""} onValueChange={(v) => setBodyType(v as BodyType)}>
                      <SelectTrigger data-testid="select-body-type">
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        {BODY_TYPES.map((bt) => (
                          <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Technical Specs */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold" data-testid="text-step-title">Технические характеристики</h2>
                <p className="text-sm text-muted-foreground mt-1">Укажите основные параметры</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineVolume">ОБЪЁМ (Л)</Label>
                    <Input
                      id="engineVolume"
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="8"
                      placeholder="2.0"
                      value={engineVolume || ""}
                      onChange={(e) => setEngineVolume(parseFloat(e.target.value) || undefined)}
                      data-testid="input-engine"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enginePower">МОЩНОСТЬ (Л.С.)</Label>
                    <Input
                      id="enginePower"
                      type="number"
                      min="50"
                      max="1500"
                      placeholder="150"
                      value={enginePower || ""}
                      onChange={(e) => setEnginePower(parseInt(e.target.value) || undefined)}
                      data-testid="input-power"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driveType">ПРИВОД</Label>
                    <Select value={driveType} onValueChange={(v) => setDriveType(v as DriveType)}>
                      <SelectTrigger data-testid="select-drive">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DRIVE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType">ТОПЛИВО</Label>
                    <Select value={fuelType} onValueChange={(v) => setFuelType(v as FuelType)}>
                      <SelectTrigger data-testid="select-fuel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FUEL_TYPES.map((ft) => (
                          <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">ПРОБЕГ (КМ)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={mileage || ""}
                    onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
                    data-testid="input-mileage"
                  />
                </div>

                <div className="space-y-2">
                  <Label>ТРАНСМИССИЯ</Label>
                  <div className="flex gap-3">
                    {TRANSMISSION_OPTIONS.map((opt) => (
                      <Button
                        key={opt.value}
                        type="button"
                        variant={transmission === opt.value ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTransmission(opt.value)}
                        data-testid={`button-transmission-${opt.value}`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Condition */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold" data-testid="text-step-title">Состояние и цвет</h2>
                <p className="text-sm text-muted-foreground mt-1">Укажите состояние и дополнительные данные</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owners">ВЛАДЕЛЬЦЕВ</Label>
                    <Input
                      id="owners"
                      type="number"
                      min="1"
                      max="10"
                      value={owners}
                      onChange={(e) => setOwners(parseInt(e.target.value) || 1)}
                      data-testid="input-owners"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">ЦВЕТ</Label>
                    <Select value={color || ""} onValueChange={(v) => setColor(v as CarColor)}>
                      <SelectTrigger data-testid="select-color">
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>СОСТОЯНИЕ</Label>
                  <div className="space-y-2">
                    {CONDITION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCondition(opt.value)}
                        className={`w-full p-4 rounded-md border text-left transition-all flex items-center justify-between hover-elevate ${
                          condition === opt.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        data-testid={`button-condition-${opt.value}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            condition === opt.value ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            {condition === opt.value ? <Check className="h-4 w-4" /> : null}
                          </div>
                          <div>
                            <p className="font-medium">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.description}</p>
                          </div>
                        </div>
                        {condition === opt.value && <Check className="h-5 w-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Info */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold" data-testid="text-step-title">Контактная информация</h2>
                <p className="text-sm text-muted-foreground mt-1">Как нам с вами связаться?</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ВАШЕ ИМЯ</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      data-testid="input-name"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">НОМЕР ТЕЛЕФОНА</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-phone"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
                data-testid="button-back"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Назад
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1"
              data-testid="button-next"
            >
              {currentStep === 4 ? (
                <>
                  Получить оценку
                  <Sparkles className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Далее
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6" data-testid="text-wizard-footer">
        © 2026 AutoEstimator Pro. Все права защищены.
      </p>
    </div>
  );
}
