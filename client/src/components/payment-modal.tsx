import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Lock, 
  Check,
  Camera,
  Shield,
  Zap,
  X,
  Smartphone,
  QrCode,
  Wallet,
  Copy
} from "lucide-react";
import { SiBitcoin } from "react-icons/si";

interface PaymentModalProps {
  price: number;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

type PaymentMethod = "card" | "sbp" | "crypto";

export function PaymentModal({ price, onPaymentSuccess, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("sbp");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async () => {
    if (paymentMethod === "card") {
      const newErrors: Record<string, string> = {};
      
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Введите номер карты";
      }
      if (!expiry || expiry.length < 5) {
        newErrors.expiry = "Введите срок";
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = "Введите CVV";
      }
      if (!name.trim()) {
        newErrors.name = "Введите имя";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onPaymentSuccess();
  };

  const cryptoAddress = "TRC20: TJKxxxxxxxxxxxxxxxxxxx";
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" data-testid="payment-modal">
      <Card className="w-full max-w-md overflow-visible relative max-h-[90vh] overflow-y-auto">
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 z-10"
          data-testid="button-close-payment"
        >
          <X className="h-5 w-5" />
        </Button>

        <CardHeader className="text-center pb-2">
          <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-2">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Оплата анализа по фото</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Получите детальный ИИ-анализ повреждений
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-md bg-muted/50">
              <Zap className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span>Мгновенный результат</span>
            </div>
            <div className="p-2 rounded-md bg-muted/50">
              <Shield className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span>Точная оценка</span>
            </div>
            <div className="p-2 rounded-md bg-muted/50">
              <Check className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span>Рекомендации</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-center py-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">К оплате</p>
            <p className="text-3xl font-bold text-primary" data-testid="text-payment-price">
              {price.toLocaleString("ru-RU")} ₽
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Способ оплаты</Label>
            <div className="grid grid-cols-3 gap-2">
              <div 
                onClick={() => setPaymentMethod("sbp")}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-md border cursor-pointer transition-colors ${paymentMethod === "sbp" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover-elevate"}`}
                data-testid="button-payment-sbp"
              >
                <QrCode className="h-5 w-5" />
                <span className="text-xs">СБП / QR</span>
              </div>
              <div 
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-md border cursor-pointer transition-colors ${paymentMethod === "card" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover-elevate"}`}
                data-testid="button-payment-card"
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Карта</span>
              </div>
              <div 
                onClick={() => setPaymentMethod("crypto")}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-md border cursor-pointer transition-colors ${paymentMethod === "crypto" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover-elevate"}`}
                data-testid="button-payment-crypto"
              >
                <SiBitcoin className="h-5 w-5" />
                <span className="text-xs">Крипта</span>
              </div>
            </div>
          </div>

          {/* SBP / QR Payment */}
          {paymentMethod === "sbp" && (
            <div className="space-y-4" data-testid="payment-sbp-form">
              <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-muted/30 border">
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-40 h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Отсканируйте QR-код</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Откройте приложение банка и отсканируйте код
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Сбербанк, Тинькофф, ВТБ, Альфа и др.</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={isProcessing}
                data-testid="button-pay-sbp"
              >
                {isProcessing ? "Проверка оплаты..." : "Я оплатил"}
              </Button>
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === "card" && (
            <div className="space-y-4" data-testid="payment-card-form">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Номер карты</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="pl-10"
                    data-testid="input-card-number"
                  />
                </div>
                {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Срок</Label>
                  <Input
                    id="expiry"
                    placeholder="ММ/ГГ"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    data-testid="input-expiry"
                  />
                  {errors.expiry && <p className="text-sm text-destructive">{errors.expiry}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="***"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    data-testid="input-cvv"
                  />
                  {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Имя на карте</Label>
                <Input
                  id="cardName"
                  placeholder="IVAN IVANOV"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  data-testid="input-card-name"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={isProcessing}
                data-testid="button-pay"
              >
                {isProcessing ? "Обработка..." : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Оплатить {price.toLocaleString("ru-RU")} ₽
                  </>
                )}
              </Button>

              {/* Card Payment Methods */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <Badge variant="outline" className="text-xs">Visa</Badge>
                <Badge variant="outline" className="text-xs">Mastercard</Badge>
                <Badge variant="outline" className="text-xs">Мир</Badge>
              </div>
            </div>
          )}

          {/* Crypto Payment */}
          {paymentMethod === "crypto" && (
            <div className="space-y-4" data-testid="payment-crypto-form">
              <div className="p-4 rounded-lg bg-muted/30 border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">USDT (TRC-20)</span>
                  <Badge variant="secondary">≈ {Math.round(price / 90)} USDT</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    value={cryptoAddress}
                    readOnly
                    className="text-xs font-mono"
                    data-testid="input-crypto-address"
                  />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => copyToClipboard(cryptoAddress)}
                    data-testid="button-copy-address"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="bg-white p-3 rounded-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded flex items-center justify-center">
                    <QrCode className="h-20 w-20 text-orange-500" />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2">
                    <Wallet className="h-3 w-3" />
                    Поддерживаемые сети: TRC-20, ERC-20, BEP-20
                  </p>
                  <p className="flex items-center gap-2">
                    <SiBitcoin className="h-3 w-3" />
                    Также принимаем: BTC, ETH, TON
                  </p>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={isProcessing}
                data-testid="button-pay-crypto"
              >
                {isProcessing ? "Проверка оплаты..." : "Я оплатил"}
              </Button>
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Безопасная оплата. Данные защищены</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
