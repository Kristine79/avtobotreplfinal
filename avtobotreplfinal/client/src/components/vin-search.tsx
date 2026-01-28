import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { VehicleDetails, ContactInfo, ConditionLevel } from "@shared/schema";
import { 
  Search, 
  Car,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface VinSearchProps {
  onComplete: (vehicleDetails: VehicleDetails, contactInfo: ContactInfo) => void;
  isSubmitting?: boolean;
}

// Simulated VIN/license plate database (in real app, this would be an API call)
const MOCK_VIN_DATA: Record<string, Partial<VehicleDetails>> = {
  "А123АА77": { brand: "Toyota", model: "Camry", year: 2020, bodyType: "sedan", engineVolume: 2.5, enginePower: 181, driveType: "fwd", fuelType: "petrol", transmission: "automatic", color: "white" },
  "В456ВВ99": { brand: "BMW", model: "X5", year: 2021, bodyType: "suv", engineVolume: 3.0, enginePower: 340, driveType: "awd", fuelType: "diesel", transmission: "automatic", color: "black" },
  "С789СС150": { brand: "Mercedes-Benz", model: "E-Class", year: 2019, bodyType: "sedan", engineVolume: 2.0, enginePower: 197, driveType: "rwd", fuelType: "petrol", transmission: "automatic", color: "silver" },
  "Х931МЕ197": { brand: "Suzuki", model: "Jimny", year: 2002, bodyType: "suv", engineVolume: 1.3, enginePower: 82, driveType: "awd", fuelType: "petrol", transmission: "manual", color: "silver" },
  "X931ME197": { brand: "Suzuki", model: "Jimny", year: 2002, bodyType: "suv", engineVolume: 1.3, enginePower: 82, driveType: "awd", fuelType: "petrol", transmission: "manual", color: "silver" },
};

// All Russian cities
const CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
  "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград", "Краснодар",
  "Саратов", "Тюмень", "Тольятти", "Ижевск", "Барнаул", "Ульяновск",
  "Иркутск", "Хабаровск", "Ярославль", "Владивосток", "Махачкала",
  "Томск", "Оренбург", "Кемерово", "Новокузнецк", "Рязань", "Астрахань",
  "Набережные Челны", "Пенза", "Липецк", "Киров", "Чебоксары", "Тула",
  "Калининград", "Балашиха", "Курск", "Улан-Удэ", "Ставрополь", "Сочи",
  "Тверь", "Магнитогорск", "Иваново", "Брянск", "Белгород", "Сургут",
  "Владимир", "Нижний Тагил", "Архангельск", "Чита", "Калуга", "Смоленск",
  "Волжский", "Курган", "Череповец", "Орёл", "Саранск", "Вологда",
  "Якутск", "Владикавказ", "Подольск", "Мурманск", "Грозный", "Тамбов",
  "Стерлитамак", "Петрозаводск", "Кострома", "Нижневартовск", "Йошкар-Ола",
  "Новороссийск", "Комсомольск-на-Амуре", "Таганрог", "Сыктывкар", "Братск",
  "Нальчик", "Дзержинск", "Шахты", "Нижнекамск", "Орск", "Ангарск",
  "Благовещенск", "Старый Оскол", "Великий Новгород", "Королёв", "Мытищи",
  "Псков", "Бийск", "Люберцы", "Южно-Сахалинск", "Армавир", "Рыбинск",
  "Прокопьевск", "Норильск", "Балаково", "Абакан", "Петропавловск-Камчатский"
];

export function VinSearch({ onComplete, isSubmitting }: VinSearchProps) {
  const [vinOrPlate, setVinOrPlate] = useState("");
  const [mileage, setMileage] = useState<number | undefined>();
  const [city, setCity] = useState("Москва");
  const [foundVehicle, setFoundVehicle] = useState<Partial<VehicleDetails> | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [condition, setCondition] = useState<ConditionLevel>("good");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSearch = async () => {
    if (!vinOrPlate.trim()) {
      setErrors({ vin: "Введите госномер или VIN" });
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setFoundVehicle(null);
    setErrors({});

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const upperPlate = vinOrPlate.toUpperCase().replace(/\s/g, "");
    const found = MOCK_VIN_DATA[upperPlate];

    if (found) {
      setFoundVehicle(found);
      setShowContactForm(false);
    } else {
      // Generate random vehicle data for demo
      const randomBrands = ["LADA (ВАЗ)", "Hyundai", "Kia", "Volkswagen", "Skoda"];
      const randomModels = ["Vesta", "Solaris", "Rio", "Polo", "Octavia"];
      const randomYears = [2018, 2019, 2020, 2021, 2022];
      
      setFoundVehicle({
        brand: randomBrands[Math.floor(Math.random() * randomBrands.length)],
        model: randomModels[Math.floor(Math.random() * randomModels.length)],
        year: randomYears[Math.floor(Math.random() * randomYears.length)],
        bodyType: "sedan",
        engineVolume: 1.6,
        enginePower: 123,
        driveType: "fwd",
        fuelType: "petrol",
        transmission: "automatic",
        color: "gray",
      });
    }

    setIsSearching(false);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = "Введите имя";
    if (!phone.trim() || phone.length < 5) newErrors.phone = "Введите телефон";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (foundVehicle) {
      const vehicleDetails: VehicleDetails = {
        brand: foundVehicle.brand || "",
        model: foundVehicle.model || "",
        year: foundVehicle.year || new Date().getFullYear(),
        bodyType: foundVehicle.bodyType,
        engineVolume: foundVehicle.engineVolume,
        enginePower: foundVehicle.enginePower,
        driveType: foundVehicle.driveType,
        fuelType: foundVehicle.fuelType,
        mileage: mileage,
        transmission: foundVehicle.transmission,
        color: foundVehicle.color,
        condition,
      };
      
      onComplete(vehicleDetails, { name, phone });
    }
  };

  const getBodyTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      sedan: "Седан", hatchback: "Хэтчбек", wagon: "Универсал",
      suv: "Внедорожник", coupe: "Купе", minivan: "Минивэн"
    };
    return type ? labels[type] || type : "—";
  };

  const getFuelLabel = (type?: string) => {
    const labels: Record<string, string> = {
      petrol: "Бензин", diesel: "Дизель", hybrid: "Гибрид",
      electric: "Электро", gas: "Газ"
    };
    return type ? labels[type] || type : "—";
  };

  const getTransmissionLabel = (type?: string) => {
    const labels: Record<string, string> = {
      automatic: "Автомат", manual: "Механика"
    };
    return type ? labels[type] || type : "—";
  };

  return (
    <div className="w-full max-w-2xl mx-auto" data-testid="vin-search">
      <Card className="overflow-visible">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">оценка</span>
              <Badge variant="secondary" className="text-primary">₽</Badge>
            </div>
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-vin-title">
              Узнайте справедливую цену автомобиля
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Чтобы не заполнять параметры вручную, введите госномер или VIN
            </p>
          </div>

          {/* Search Form */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1 space-y-2">
              <Label htmlFor="vinOrPlate" className="sr-only">Госномер или VIN</Label>
              <div className="relative">
                <Input
                  id="vinOrPlate"
                  placeholder="Госномер или VIN"
                  value={vinOrPlate}
                  onChange={(e) => setVinOrPlate(e.target.value)}
                  className="pr-10"
                  data-testid="input-vin"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.vin && <p className="text-sm text-destructive">{errors.vin}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage" className="sr-only">Пробег</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Пробег, км"
                value={mileage || ""}
                onChange={(e) => setMileage(parseInt(e.target.value) || undefined)}
                data-testid="input-mileage-vin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-xs text-muted-foreground">Город продажи</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger data-testid="select-city">
                  <SelectValue placeholder="Город продажи" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 sm:flex-none"
              data-testid="button-search-vin"
            >
              {isSearching ? "Поиск..." : "Оценить бесплатно"}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => {/* Switch to manual mode handled by parent */}}
              data-testid="button-manual-params"
            >
              Заполнить все параметры вручную
            </Button>
          </div>

          {/* Found Vehicle Info */}
          {foundVehicle && !showContactForm && (
            <div className="border rounded-lg p-4 bg-muted/30 space-y-4" data-testid="found-vehicle">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Автомобиль найден</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Марка / Модель</p>
                  <p className="font-medium">{foundVehicle.brand} {foundVehicle.model}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Год выпуска</p>
                  <p className="font-medium">{foundVehicle.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Кузов</p>
                  <p className="font-medium">{getBodyTypeLabel(foundVehicle.bodyType)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Двигатель</p>
                  <p className="font-medium">{foundVehicle.engineVolume}L / {foundVehicle.enginePower} л.с.</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Топливо</p>
                  <p className="font-medium">{getFuelLabel(foundVehicle.fuelType)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">КПП</p>
                  <p className="font-medium">{getTransmissionLabel(foundVehicle.transmission)}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label>Состояние автомобиля</Label>
                <div className="flex flex-wrap gap-2">
                  {(["excellent", "good", "fair", "poor"] as ConditionLevel[]).map((c) => {
                    const labels: Record<ConditionLevel, string> = {
                      excellent: "Отличное", good: "Хорошее", fair: "Среднее", poor: "Плохое"
                    };
                    return (
                      <Button
                        key={c}
                        size="sm"
                        variant={condition === c ? "default" : "outline"}
                        onClick={() => setCondition(c)}
                        data-testid={`button-condition-${c}`}
                      >
                        {labels[c]}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={() => setShowContactForm(true)}
                data-testid="button-continue-contact"
              >
                Продолжить
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Contact Form */}
          {foundVehicle && showContactForm && (
            <div className="border rounded-lg p-4 bg-muted/30 space-y-4" data-testid="contact-form-vin">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span className="font-medium">{foundVehicle.brand} {foundVehicle.model} ({foundVehicle.year})</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input
                    id="name"
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-name-vin"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-phone-vin"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                  data-testid="button-back-vin"
                >
                  Назад
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  data-testid="button-get-valuation"
                >
                  Получить оценку бесплатно
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
