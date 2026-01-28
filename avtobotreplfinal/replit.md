# AutoValue Pro

## Overview
Combined application that merges Car Damage Assessment AI with AutoValue Pro valuation wizard. Provides two main features:
1. **Standalone Valuation** - Multi-step wizard for instant car market value estimation
2. **Damage Assessment** - AI-powered vehicle damage detection and repair cost estimation

## Features

### Valuation Wizard (AutoValue Pro)
- **4-Step Process**: Car Details → Technical Specs → Condition → Contact Info
- **Brand/Model Autocomplete**: 50+ brands with models from Russian market database
- **Body Type**: Sedan, Hatchback, Wagon, SUV, Coupe, Convertible, Minivan, Pickup, Van
- **Technical Specs**: Engine volume, engine power (HP), drive type, fuel type, mileage, transmission
- **Fuel Types**: Petrol, Diesel, Hybrid, Electric, Gas (LPG)
- **Color Selection**: 13 colors available
- **Condition Rating**: Excellent, Good, Fair, Poor
- **Market Valuation**: Based on Russian auto market data 2024-2025

### Damage Assessment (Car Damage AI)
- **Multi-Image Upload**: Upload up to 10 photos simultaneously
- **AI Detection**: 10+ damage types (dents, scratches, cracks, etc.)
- **Cost Estimation**: Repair costs in Russian Rubles (₽)
- **Decision Engine**: Auto-approve, Human Review, or Escalate
- **Assessment History**: View previous assessments

### Admin Panel (/admin)
- **Pricing Parameters**: Configurable settings for valuation algorithm
  - Base Price (Базовая цена)
  - Premium Brand Multiplier
  - Depreciation Rate
  - Mileage Penalty
- **Security Settings**: Captcha toggle, VIN search toggle
- **Branding Settings**: Customizable site branding
  - Site name and tagline
  - Logo upload (supports image files)
  - Contact info (phone, email)
  - Social links (Telegram bot, Telegram channel, WhatsApp)
  - Color scheme picker with 6 presets (or custom HSL values)
- **Statistics**: Total requests, Average mileage
- **Incoming Requests Table**: View all valuations with date, vehicle specs, contact info, estimated price

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI, TanStack Query
- **Backend**: Express.js, TypeScript
- **AI**: OpenAI Vision API (via Replit AI Integrations)
- **Storage**: In-memory storage (MemStorage)

## Project Structure
```
├── client/src/
│   ├── components/
│   │   ├── valuation-wizard.tsx     # 4-step valuation wizard
│   │   ├── valuation-result.tsx     # Valuation result display
│   │   ├── vehicle-valuation.tsx    # Valuation card (for damage mode)
│   │   ├── assessment-history.tsx   # History sidebar
│   │   ├── assessment-summary.tsx   # Damage summary card
│   │   ├── damage-item.tsx          # Individual damage card
│   │   ├── decision-panel.tsx       # Decision recommendation panel
│   │   ├── image-upload.tsx         # Multi-image upload
│   │   ├── loading-skeleton.tsx     # Loading states
│   │   └── theme-toggle.tsx         # Dark/light mode toggle
│   ├── pages/
│   │   ├── home.tsx                 # Main page with mode switcher
│   │   └── admin.tsx                # Admin panel for settings & requests
│   └── App.tsx                      # App entry point
├── server/
│   ├── routes.ts                    # API endpoints
│   ├── storage.ts                   # In-memory storage
│   ├── openai.ts                    # OpenAI Vision integration
│   └── carValuation.ts              # Car valuation logic
└── shared/
    └── schema.ts                    # TypeScript types and schemas
```

## API Endpoints

### Valuations
- `GET /api/valuations` - Get all valuations
- `POST /api/valuations` - Create standalone valuation

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get single assessment
- `POST /api/assessments/analyze` - Analyze images and create assessment
- `POST /api/assessments/:id/override` - Human override for decision

### Admin
- `GET /api/admin/settings` - Get pricing configuration
- `PATCH /api/admin/settings` - Update pricing parameters
- `GET /api/admin/branding` - Get site branding settings
- `PATCH /api/admin/branding` - Update branding settings
- `POST /api/admin/logo` - Upload site logo (base64 image)

## Decision Logic (Russian Rubles)
- **Auto-Approve**: Minor damage under 180,000₽ with clear documentation
- **Human Review**: Moderate damage 180,000₽-630,000₽ or unclear damage
- **Escalate**: Severe damage over 630,000₽ or structural/safety issues

## Running the Application
The app runs on port 5000. Use `npm run dev` to start the development server.

## Testing
All interactive and display elements have `data-testid` attributes for e2e testing.

## Pricing Model
- **VIN/License Plate Search**: FREE
- **Parameter Search**: FREE  
- **Photo Analysis (AI)**: 299₽ (paid, requires payment before analysis)

## Payment Integration
**Status**: UI mockup with multiple Russian payment options implemented.  
**Payment Methods Available**:
- СБП (QR-код) - Быстрые платежи через банковские приложения
- Карты - Visa, Mastercard, МИР
- Криптовалюта - USDT (TRC-20, ERC-20, BEP-20), BTC, ETH, TON

**Note**: Payment forms are currently simulations. To enable real payments:
1. For СБП: Integrate with bank API or payment aggregator (ЮKassa, Робокасса, CloudPayments)
2. For crypto: Set up actual wallet addresses and payment verification
3. Add payment verification on backend before allowing analysis

## Security Settings
- **Captcha Toggle**: Admin can enable/disable captcha protection via admin panel
- Captcha setting stored in backend settings API

## Telegram Bot
**File**: `server/telegram-bot.ts`

The application includes a Telegram bot with full app functionality:

**Commands**:
- `/start` - Welcome message and main menu
- `/valuation` - Start car valuation wizard (free)
- `/photo` - Start AI photo analysis (paid 299₽)
- `/cancel` - Cancel current operation
- `/help` - Help and usage info

**Features - Valuation**:
- 5-step wizard: Brand → Model → Year → Mileage → Condition
- Inline keyboard for brand/condition selection
- Instant price calculation using same algorithm as web app
- Russian interface
- Session management per user

**Features - Photo Analysis**:
- Upload up to 10 photos
- Payment flow before analysis (299₽)
- Multiple payment options: Card, СБП, USDT
- AI-powered damage detection
- Repair cost estimation
- Recommendations

**Setup**:
1. Create bot via @BotFather in Telegram
2. Get bot token
3. Add `TELEGRAM_BOT_TOKEN` to Secrets
4. Restart application

**Status**: Requires `TELEGRAM_BOT_TOKEN` secret to be set

## Recent Updates (Jan 2026)
- **VIN/License Plate Search**: New free search mode by госномер or VIN
- **Payment Flow**: Added payment modal for photo analysis (299₽)
- **Three Search Modes**: VIN search, Parameter search (free), Photo analysis (paid)
- **Admin Panel**: New /admin page with configurable pricing parameters
- **Incoming Requests Table**: View all valuation requests with details
- **Dynamic Pricing Settings**: Base price, premium multiplier, depreciation rate, mileage penalty
- **AutoValue Pro Integration**: Added 4-step valuation wizard
- **Mode Switcher**: Toggle between Valuation and Damage Assessment modes
- **Standalone Valuation API**: New endpoint for valuation requests
- **Telegram Bot**: Added Telegram bot for car valuations via /valuation command
- **VIN Search Toggle**: Admin can enable/disable VIN search feature
- **Russian Interface**: Complete UI translation
- **Multi-image Upload**: Support for 5-10 images per assessment
- **Vehicle Details Schema**: Engine, drive type, transmission, owners
- **Branding Customization**: Admin can customize site name, logo, colors, and contact info
- **Footer Contacts**: Dynamic footer with phone, email, and social media links from branding settings
