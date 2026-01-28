// Comprehensive Russian market car brands and models database
// Based on auto.ru market data 2024-2025

export interface CarModel {
  name: string;
  bodyTypes?: string[];
}

export interface CarBrand {
  name: string;
  models: CarModel[];
  isPremium?: boolean;
}

export const CAR_BRANDS: CarBrand[] = [
  // Russian brands
  {
    name: "LADA (ВАЗ)",
    models: [
      { name: "Vesta", bodyTypes: ["sedan", "wagon"] },
      { name: "Vesta Cross", bodyTypes: ["wagon"] },
      { name: "Granta", bodyTypes: ["sedan", "hatchback", "wagon"] },
      { name: "Niva", bodyTypes: ["suv"] },
      { name: "Niva Legend", bodyTypes: ["suv"] },
      { name: "Niva Travel", bodyTypes: ["suv"] },
      { name: "Largus", bodyTypes: ["wagon", "van"] },
      { name: "XRAY", bodyTypes: ["hatchback"] },
      { name: "Priora", bodyTypes: ["sedan", "hatchback", "wagon"] },
      { name: "Kalina", bodyTypes: ["sedan", "hatchback", "wagon"] },
    ],
  },
  {
    name: "UAZ",
    models: [
      { name: "Patriot", bodyTypes: ["suv"] },
      { name: "Hunter", bodyTypes: ["suv"] },
      { name: "Pickup", bodyTypes: ["pickup"] },
      { name: "Profi", bodyTypes: ["van"] },
    ],
  },
  {
    name: "GAZ",
    models: [
      { name: "Volga", bodyTypes: ["sedan"] },
      { name: "Gazelle", bodyTypes: ["van"] },
      { name: "Sobol", bodyTypes: ["van"] },
    ],
  },
  // Japanese brands
  {
    name: "Toyota",
    models: [
      { name: "Camry", bodyTypes: ["sedan"] },
      { name: "Corolla", bodyTypes: ["sedan", "hatchback", "wagon"] },
      { name: "RAV4", bodyTypes: ["suv"] },
      { name: "Land Cruiser 200", bodyTypes: ["suv"] },
      { name: "Land Cruiser 300", bodyTypes: ["suv"] },
      { name: "Land Cruiser Prado", bodyTypes: ["suv"] },
      { name: "Highlander", bodyTypes: ["suv"] },
      { name: "Fortuner", bodyTypes: ["suv"] },
      { name: "Hilux", bodyTypes: ["pickup"] },
      { name: "Alphard", bodyTypes: ["minivan"] },
      { name: "Crown", bodyTypes: ["sedan"] },
      { name: "Prius", bodyTypes: ["hatchback"] },
      { name: "Yaris", bodyTypes: ["hatchback"] },
      { name: "Supra", bodyTypes: ["coupe"] },
    ],
  },
  {
    name: "Lexus",
    isPremium: true,
    models: [
      { name: "RX", bodyTypes: ["suv"] },
      { name: "NX", bodyTypes: ["suv"] },
      { name: "LX", bodyTypes: ["suv"] },
      { name: "GX", bodyTypes: ["suv"] },
      { name: "ES", bodyTypes: ["sedan"] },
      { name: "IS", bodyTypes: ["sedan"] },
      { name: "LS", bodyTypes: ["sedan"] },
      { name: "UX", bodyTypes: ["suv"] },
      { name: "LC", bodyTypes: ["coupe"] },
    ],
  },
  {
    name: "Honda",
    models: [
      { name: "Accord", bodyTypes: ["sedan"] },
      { name: "Civic", bodyTypes: ["sedan", "hatchback"] },
      { name: "CR-V", bodyTypes: ["suv"] },
      { name: "HR-V", bodyTypes: ["suv"] },
      { name: "Pilot", bodyTypes: ["suv"] },
      { name: "Fit", bodyTypes: ["hatchback"] },
      { name: "Jazz", bodyTypes: ["hatchback"] },
      { name: "Freed", bodyTypes: ["minivan"] },
    ],
  },
  {
    name: "Nissan",
    models: [
      { name: "X-Trail", bodyTypes: ["suv"] },
      { name: "Qashqai", bodyTypes: ["suv"] },
      { name: "Murano", bodyTypes: ["suv"] },
      { name: "Pathfinder", bodyTypes: ["suv"] },
      { name: "Patrol", bodyTypes: ["suv"] },
      { name: "Juke", bodyTypes: ["suv"] },
      { name: "Kicks", bodyTypes: ["suv"] },
      { name: "Teana", bodyTypes: ["sedan"] },
      { name: "Almera", bodyTypes: ["sedan"] },
      { name: "Note", bodyTypes: ["hatchback"] },
      { name: "Leaf", bodyTypes: ["hatchback"] },
      { name: "GT-R", bodyTypes: ["coupe"] },
    ],
  },
  {
    name: "Mazda",
    models: [
      { name: "CX-5", bodyTypes: ["suv"] },
      { name: "CX-9", bodyTypes: ["suv"] },
      { name: "CX-30", bodyTypes: ["suv"] },
      { name: "CX-60", bodyTypes: ["suv"] },
      { name: "Mazda3", bodyTypes: ["sedan", "hatchback"] },
      { name: "Mazda6", bodyTypes: ["sedan", "wagon"] },
      { name: "MX-5", bodyTypes: ["convertible"] },
    ],
  },
  {
    name: "Mitsubishi",
    models: [
      { name: "Outlander", bodyTypes: ["suv"] },
      { name: "Pajero", bodyTypes: ["suv"] },
      { name: "Pajero Sport", bodyTypes: ["suv"] },
      { name: "Eclipse Cross", bodyTypes: ["suv"] },
      { name: "ASX", bodyTypes: ["suv"] },
      { name: "L200", bodyTypes: ["pickup"] },
      { name: "Lancer", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Subaru",
    models: [
      { name: "Forester", bodyTypes: ["suv"] },
      { name: "Outback", bodyTypes: ["wagon"] },
      { name: "XV", bodyTypes: ["suv"] },
      { name: "Crosstrek", bodyTypes: ["suv"] },
      { name: "Legacy", bodyTypes: ["sedan"] },
      { name: "Impreza", bodyTypes: ["sedan", "hatchback"] },
      { name: "WRX", bodyTypes: ["sedan"] },
      { name: "BRZ", bodyTypes: ["coupe"] },
    ],
  },
  {
    name: "Suzuki",
    models: [
      { name: "Vitara", bodyTypes: ["suv"] },
      { name: "SX4", bodyTypes: ["suv"] },
      { name: "Jimny", bodyTypes: ["suv"] },
      { name: "Swift", bodyTypes: ["hatchback"] },
      { name: "Grand Vitara", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Infiniti",
    isPremium: true,
    models: [
      { name: "QX80", bodyTypes: ["suv"] },
      { name: "QX60", bodyTypes: ["suv"] },
      { name: "QX50", bodyTypes: ["suv"] },
      { name: "QX55", bodyTypes: ["suv"] },
      { name: "Q50", bodyTypes: ["sedan"] },
      { name: "Q60", bodyTypes: ["coupe"] },
      { name: "FX", bodyTypes: ["suv"] },
    ],
  },
  // Korean brands
  {
    name: "Hyundai",
    models: [
      { name: "Solaris", bodyTypes: ["sedan", "hatchback"] },
      { name: "Creta", bodyTypes: ["suv"] },
      { name: "Tucson", bodyTypes: ["suv"] },
      { name: "Santa Fe", bodyTypes: ["suv"] },
      { name: "Palisade", bodyTypes: ["suv"] },
      { name: "Sonata", bodyTypes: ["sedan"] },
      { name: "Elantra", bodyTypes: ["sedan"] },
      { name: "i30", bodyTypes: ["hatchback"] },
      { name: "i40", bodyTypes: ["sedan", "wagon"] },
      { name: "Kona", bodyTypes: ["suv"] },
      { name: "Venue", bodyTypes: ["suv"] },
      { name: "Ioniq", bodyTypes: ["hatchback"] },
      { name: "Staria", bodyTypes: ["minivan"] },
    ],
  },
  {
    name: "Kia",
    models: [
      { name: "Rio", bodyTypes: ["sedan", "hatchback"] },
      { name: "Ceed", bodyTypes: ["hatchback", "wagon"] },
      { name: "Cerato", bodyTypes: ["sedan"] },
      { name: "K5", bodyTypes: ["sedan"] },
      { name: "K8", bodyTypes: ["sedan"] },
      { name: "K9", bodyTypes: ["sedan"] },
      { name: "Sportage", bodyTypes: ["suv"] },
      { name: "Sorento", bodyTypes: ["suv"] },
      { name: "Mohave", bodyTypes: ["suv"] },
      { name: "Telluride", bodyTypes: ["suv"] },
      { name: "Seltos", bodyTypes: ["suv"] },
      { name: "Soul", bodyTypes: ["hatchback"] },
      { name: "Carnival", bodyTypes: ["minivan"] },
      { name: "Stinger", bodyTypes: ["sedan"] },
      { name: "EV6", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Genesis",
    isPremium: true,
    models: [
      { name: "G70", bodyTypes: ["sedan"] },
      { name: "G80", bodyTypes: ["sedan"] },
      { name: "G90", bodyTypes: ["sedan"] },
      { name: "GV60", bodyTypes: ["suv"] },
      { name: "GV70", bodyTypes: ["suv"] },
      { name: "GV80", bodyTypes: ["suv"] },
    ],
  },
  // German brands
  {
    name: "BMW",
    isPremium: true,
    models: [
      { name: "1 Series", bodyTypes: ["hatchback"] },
      { name: "2 Series", bodyTypes: ["coupe", "sedan"] },
      { name: "3 Series", bodyTypes: ["sedan", "wagon"] },
      { name: "4 Series", bodyTypes: ["coupe", "convertible"] },
      { name: "5 Series", bodyTypes: ["sedan", "wagon"] },
      { name: "6 Series", bodyTypes: ["coupe", "convertible"] },
      { name: "7 Series", bodyTypes: ["sedan"] },
      { name: "8 Series", bodyTypes: ["coupe", "convertible"] },
      { name: "X1", bodyTypes: ["suv"] },
      { name: "X2", bodyTypes: ["suv"] },
      { name: "X3", bodyTypes: ["suv"] },
      { name: "X4", bodyTypes: ["suv"] },
      { name: "X5", bodyTypes: ["suv"] },
      { name: "X6", bodyTypes: ["suv"] },
      { name: "X7", bodyTypes: ["suv"] },
      { name: "XM", bodyTypes: ["suv"] },
      { name: "Z4", bodyTypes: ["convertible"] },
      { name: "iX", bodyTypes: ["suv"] },
      { name: "iX3", bodyTypes: ["suv"] },
      { name: "i4", bodyTypes: ["sedan"] },
      { name: "i7", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Mercedes-Benz",
    isPremium: true,
    models: [
      { name: "A-Class", bodyTypes: ["hatchback", "sedan"] },
      { name: "B-Class", bodyTypes: ["hatchback"] },
      { name: "C-Class", bodyTypes: ["sedan", "wagon", "coupe"] },
      { name: "E-Class", bodyTypes: ["sedan", "wagon", "coupe"] },
      { name: "S-Class", bodyTypes: ["sedan"] },
      { name: "CLA", bodyTypes: ["coupe", "wagon"] },
      { name: "CLS", bodyTypes: ["coupe"] },
      { name: "GLA", bodyTypes: ["suv"] },
      { name: "GLB", bodyTypes: ["suv"] },
      { name: "GLC", bodyTypes: ["suv"] },
      { name: "GLE", bodyTypes: ["suv"] },
      { name: "GLS", bodyTypes: ["suv"] },
      { name: "G-Class", bodyTypes: ["suv"] },
      { name: "EQA", bodyTypes: ["suv"] },
      { name: "EQB", bodyTypes: ["suv"] },
      { name: "EQC", bodyTypes: ["suv"] },
      { name: "EQE", bodyTypes: ["sedan", "suv"] },
      { name: "EQS", bodyTypes: ["sedan", "suv"] },
      { name: "V-Class", bodyTypes: ["minivan"] },
      { name: "Maybach", bodyTypes: ["sedan", "suv"] },
      { name: "AMG GT", bodyTypes: ["coupe"] },
    ],
  },
  {
    name: "Audi",
    isPremium: true,
    models: [
      { name: "A1", bodyTypes: ["hatchback"] },
      { name: "A3", bodyTypes: ["sedan", "hatchback"] },
      { name: "A4", bodyTypes: ["sedan", "wagon"] },
      { name: "A5", bodyTypes: ["coupe", "convertible"] },
      { name: "A6", bodyTypes: ["sedan", "wagon"] },
      { name: "A7", bodyTypes: ["sedan"] },
      { name: "A8", bodyTypes: ["sedan"] },
      { name: "Q2", bodyTypes: ["suv"] },
      { name: "Q3", bodyTypes: ["suv"] },
      { name: "Q4 e-tron", bodyTypes: ["suv"] },
      { name: "Q5", bodyTypes: ["suv"] },
      { name: "Q7", bodyTypes: ["suv"] },
      { name: "Q8", bodyTypes: ["suv"] },
      { name: "e-tron", bodyTypes: ["suv"] },
      { name: "e-tron GT", bodyTypes: ["sedan"] },
      { name: "TT", bodyTypes: ["coupe"] },
      { name: "R8", bodyTypes: ["coupe"] },
      { name: "RS3", bodyTypes: ["sedan"] },
      { name: "RS6", bodyTypes: ["wagon"] },
      { name: "RS7", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Volkswagen",
    models: [
      { name: "Polo", bodyTypes: ["sedan", "hatchback"] },
      { name: "Golf", bodyTypes: ["hatchback", "wagon"] },
      { name: "Jetta", bodyTypes: ["sedan"] },
      { name: "Passat", bodyTypes: ["sedan", "wagon"] },
      { name: "Arteon", bodyTypes: ["sedan"] },
      { name: "Tiguan", bodyTypes: ["suv"] },
      { name: "Touareg", bodyTypes: ["suv"] },
      { name: "Taos", bodyTypes: ["suv"] },
      { name: "Teramont", bodyTypes: ["suv"] },
      { name: "ID.4", bodyTypes: ["suv"] },
      { name: "ID.6", bodyTypes: ["suv"] },
      { name: "Multivan", bodyTypes: ["minivan"] },
      { name: "Caravelle", bodyTypes: ["minivan"] },
      { name: "Transporter", bodyTypes: ["van"] },
    ],
  },
  {
    name: "Porsche",
    isPremium: true,
    models: [
      { name: "911", bodyTypes: ["coupe", "convertible"] },
      { name: "718 Boxster", bodyTypes: ["convertible"] },
      { name: "718 Cayman", bodyTypes: ["coupe"] },
      { name: "Panamera", bodyTypes: ["sedan"] },
      { name: "Cayenne", bodyTypes: ["suv"] },
      { name: "Macan", bodyTypes: ["suv"] },
      { name: "Taycan", bodyTypes: ["sedan"] },
    ],
  },
  // French brands
  {
    name: "Renault",
    models: [
      { name: "Logan", bodyTypes: ["sedan"] },
      { name: "Sandero", bodyTypes: ["hatchback"] },
      { name: "Duster", bodyTypes: ["suv"] },
      { name: "Kaptur", bodyTypes: ["suv"] },
      { name: "Arkana", bodyTypes: ["suv"] },
      { name: "Koleos", bodyTypes: ["suv"] },
      { name: "Megane", bodyTypes: ["hatchback", "sedan"] },
      { name: "Fluence", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Peugeot",
    models: [
      { name: "208", bodyTypes: ["hatchback"] },
      { name: "308", bodyTypes: ["hatchback", "wagon"] },
      { name: "408", bodyTypes: ["sedan"] },
      { name: "508", bodyTypes: ["sedan", "wagon"] },
      { name: "2008", bodyTypes: ["suv"] },
      { name: "3008", bodyTypes: ["suv"] },
      { name: "5008", bodyTypes: ["suv"] },
      { name: "Traveller", bodyTypes: ["minivan"] },
    ],
  },
  {
    name: "Citroën",
    models: [
      { name: "C3", bodyTypes: ["hatchback"] },
      { name: "C4", bodyTypes: ["hatchback"] },
      { name: "C5 X", bodyTypes: ["wagon"] },
      { name: "C3 Aircross", bodyTypes: ["suv"] },
      { name: "C5 Aircross", bodyTypes: ["suv"] },
      { name: "SpaceTourer", bodyTypes: ["minivan"] },
    ],
  },
  // American brands
  {
    name: "Ford",
    models: [
      { name: "Focus", bodyTypes: ["hatchback", "sedan", "wagon"] },
      { name: "Mondeo", bodyTypes: ["sedan", "wagon"] },
      { name: "Fiesta", bodyTypes: ["hatchback"] },
      { name: "Kuga", bodyTypes: ["suv"] },
      { name: "Explorer", bodyTypes: ["suv"] },
      { name: "Escape", bodyTypes: ["suv"] },
      { name: "Edge", bodyTypes: ["suv"] },
      { name: "Bronco", bodyTypes: ["suv"] },
      { name: "F-150", bodyTypes: ["pickup"] },
      { name: "Ranger", bodyTypes: ["pickup"] },
      { name: "Mustang", bodyTypes: ["coupe", "convertible"] },
      { name: "Mustang Mach-E", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Chevrolet",
    models: [
      { name: "Cruze", bodyTypes: ["sedan", "hatchback"] },
      { name: "Malibu", bodyTypes: ["sedan"] },
      { name: "Camaro", bodyTypes: ["coupe"] },
      { name: "Corvette", bodyTypes: ["coupe"] },
      { name: "Traverse", bodyTypes: ["suv"] },
      { name: "Tahoe", bodyTypes: ["suv"] },
      { name: "Suburban", bodyTypes: ["suv"] },
      { name: "Trailblazer", bodyTypes: ["suv"] },
      { name: "Equinox", bodyTypes: ["suv"] },
      { name: "Bolt", bodyTypes: ["hatchback"] },
      { name: "Silverado", bodyTypes: ["pickup"] },
    ],
  },
  {
    name: "Cadillac",
    isPremium: true,
    models: [
      { name: "CT4", bodyTypes: ["sedan"] },
      { name: "CT5", bodyTypes: ["sedan"] },
      { name: "CT6", bodyTypes: ["sedan"] },
      { name: "XT4", bodyTypes: ["suv"] },
      { name: "XT5", bodyTypes: ["suv"] },
      { name: "XT6", bodyTypes: ["suv"] },
      { name: "Escalade", bodyTypes: ["suv"] },
      { name: "Lyriq", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Jeep",
    models: [
      { name: "Wrangler", bodyTypes: ["suv"] },
      { name: "Grand Cherokee", bodyTypes: ["suv"] },
      { name: "Cherokee", bodyTypes: ["suv"] },
      { name: "Compass", bodyTypes: ["suv"] },
      { name: "Renegade", bodyTypes: ["suv"] },
      { name: "Gladiator", bodyTypes: ["pickup"] },
    ],
  },
  {
    name: "Dodge",
    models: [
      { name: "Challenger", bodyTypes: ["coupe"] },
      { name: "Charger", bodyTypes: ["sedan"] },
      { name: "Durango", bodyTypes: ["suv"] },
      { name: "RAM 1500", bodyTypes: ["pickup"] },
    ],
  },
  // British brands
  {
    name: "Land Rover",
    isPremium: true,
    models: [
      { name: "Range Rover", bodyTypes: ["suv"] },
      { name: "Range Rover Sport", bodyTypes: ["suv"] },
      { name: "Range Rover Velar", bodyTypes: ["suv"] },
      { name: "Range Rover Evoque", bodyTypes: ["suv"] },
      { name: "Defender", bodyTypes: ["suv"] },
      { name: "Discovery", bodyTypes: ["suv"] },
      { name: "Discovery Sport", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Jaguar",
    isPremium: true,
    models: [
      { name: "XE", bodyTypes: ["sedan"] },
      { name: "XF", bodyTypes: ["sedan", "wagon"] },
      { name: "XJ", bodyTypes: ["sedan"] },
      { name: "F-Type", bodyTypes: ["coupe", "convertible"] },
      { name: "E-Pace", bodyTypes: ["suv"] },
      { name: "F-Pace", bodyTypes: ["suv"] },
      { name: "I-Pace", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Mini",
    models: [
      { name: "Cooper", bodyTypes: ["hatchback"] },
      { name: "Countryman", bodyTypes: ["suv"] },
      { name: "Clubman", bodyTypes: ["wagon"] },
      { name: "Convertible", bodyTypes: ["convertible"] },
    ],
  },
  // Italian brands
  {
    name: "Alfa Romeo",
    isPremium: true,
    models: [
      { name: "Giulia", bodyTypes: ["sedan"] },
      { name: "Stelvio", bodyTypes: ["suv"] },
      { name: "Tonale", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Fiat",
    models: [
      { name: "500", bodyTypes: ["hatchback"] },
      { name: "Panda", bodyTypes: ["hatchback"] },
      { name: "Tipo", bodyTypes: ["sedan", "hatchback"] },
      { name: "Ducato", bodyTypes: ["van"] },
    ],
  },
  // Swedish brands
  {
    name: "Volvo",
    isPremium: true,
    models: [
      { name: "S60", bodyTypes: ["sedan"] },
      { name: "S90", bodyTypes: ["sedan"] },
      { name: "V60", bodyTypes: ["wagon"] },
      { name: "V90", bodyTypes: ["wagon"] },
      { name: "XC40", bodyTypes: ["suv"] },
      { name: "XC60", bodyTypes: ["suv"] },
      { name: "XC90", bodyTypes: ["suv"] },
      { name: "C40", bodyTypes: ["suv"] },
      { name: "EX30", bodyTypes: ["suv"] },
      { name: "EX90", bodyTypes: ["suv"] },
    ],
  },
  // Chinese brands
  {
    name: "Chery",
    models: [
      { name: "Tiggo 4", bodyTypes: ["suv"] },
      { name: "Tiggo 7 Pro", bodyTypes: ["suv"] },
      { name: "Tiggo 8 Pro", bodyTypes: ["suv"] },
      { name: "Tiggo 8 Pro Max", bodyTypes: ["suv"] },
      { name: "Arrizo 8", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Haval",
    models: [
      { name: "Jolion", bodyTypes: ["suv"] },
      { name: "F7", bodyTypes: ["suv"] },
      { name: "F7x", bodyTypes: ["suv"] },
      { name: "H9", bodyTypes: ["suv"] },
      { name: "Dargo", bodyTypes: ["suv"] },
      { name: "M6", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Geely",
    models: [
      { name: "Coolray", bodyTypes: ["suv"] },
      { name: "Atlas", bodyTypes: ["suv"] },
      { name: "Atlas Pro", bodyTypes: ["suv"] },
      { name: "Tugella", bodyTypes: ["suv"] },
      { name: "Monjaro", bodyTypes: ["suv"] },
      { name: "Emgrand", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Changan",
    models: [
      { name: "CS35 Plus", bodyTypes: ["suv"] },
      { name: "CS55 Plus", bodyTypes: ["suv"] },
      { name: "CS75 Plus", bodyTypes: ["suv"] },
      { name: "CS95", bodyTypes: ["suv"] },
      { name: "Uni-K", bodyTypes: ["suv"] },
      { name: "Uni-V", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Omoda",
    models: [
      { name: "C5", bodyTypes: ["suv"] },
      { name: "S5", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Exeed",
    models: [
      { name: "TXL", bodyTypes: ["suv"] },
      { name: "VX", bodyTypes: ["suv"] },
      { name: "LX", bodyTypes: ["suv"] },
      { name: "RX", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "Tank",
    models: [
      { name: "300", bodyTypes: ["suv"] },
      { name: "500", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "BAIC",
    models: [
      { name: "X55", bodyTypes: ["suv"] },
      { name: "U5 Plus", bodyTypes: ["sedan"] },
      { name: "BJ40", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "FAW",
    models: [
      { name: "Bestune T77", bodyTypes: ["suv"] },
      { name: "Bestune T99", bodyTypes: ["suv"] },
      { name: "Bestune B70", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Dongfeng",
    models: [
      { name: "580", bodyTypes: ["suv"] },
      { name: "T5 EVO", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "JAC",
    models: [
      { name: "JS4", bodyTypes: ["suv"] },
      { name: "JS6", bodyTypes: ["suv"] },
      { name: "J7", bodyTypes: ["sedan"] },
    ],
  },
  {
    name: "Voyah",
    isPremium: true,
    models: [
      { name: "Free", bodyTypes: ["suv"] },
      { name: "Dream", bodyTypes: ["minivan"] },
    ],
  },
  {
    name: "Zeekr",
    isPremium: true,
    models: [
      { name: "001", bodyTypes: ["wagon"] },
      { name: "X", bodyTypes: ["suv"] },
      { name: "009", bodyTypes: ["minivan"] },
    ],
  },
  {
    name: "Li Auto",
    isPremium: true,
    models: [
      { name: "L7", bodyTypes: ["suv"] },
      { name: "L8", bodyTypes: ["suv"] },
      { name: "L9", bodyTypes: ["suv"] },
    ],
  },
  {
    name: "BYD",
    models: [
      { name: "Song Plus", bodyTypes: ["suv"] },
      { name: "Tang", bodyTypes: ["suv"] },
      { name: "Han", bodyTypes: ["sedan"] },
      { name: "Seal", bodyTypes: ["sedan"] },
      { name: "Dolphin", bodyTypes: ["hatchback"] },
      { name: "Atto 3", bodyTypes: ["suv"] },
    ],
  },
  // Tesla
  {
    name: "Tesla",
    isPremium: true,
    models: [
      { name: "Model 3", bodyTypes: ["sedan"] },
      { name: "Model S", bodyTypes: ["sedan"] },
      { name: "Model X", bodyTypes: ["suv"] },
      { name: "Model Y", bodyTypes: ["suv"] },
      { name: "Cybertruck", bodyTypes: ["pickup"] },
    ],
  },
];

// Body type options
export const BODY_TYPES = [
  { value: "sedan", label: "Седан" },
  { value: "hatchback", label: "Хэтчбек" },
  { value: "wagon", label: "Универсал" },
  { value: "suv", label: "Внедорожник/Кроссовер" },
  { value: "coupe", label: "Купе" },
  { value: "convertible", label: "Кабриолет" },
  { value: "minivan", label: "Минивэн" },
  { value: "pickup", label: "Пикап" },
  { value: "van", label: "Фургон" },
];

// Fuel type options
export const FUEL_TYPES = [
  { value: "petrol", label: "Бензин" },
  { value: "diesel", label: "Дизель" },
  { value: "hybrid", label: "Гибрид" },
  { value: "electric", label: "Электро" },
  { value: "gas", label: "Газ (LPG)" },
];

// Color options
export const COLORS = [
  { value: "black", label: "Чёрный" },
  { value: "white", label: "Белый" },
  { value: "silver", label: "Серебристый" },
  { value: "gray", label: "Серый" },
  { value: "red", label: "Красный" },
  { value: "blue", label: "Синий" },
  { value: "brown", label: "Коричневый" },
  { value: "beige", label: "Бежевый" },
  { value: "green", label: "Зелёный" },
  { value: "orange", label: "Оранжевый" },
  { value: "yellow", label: "Жёлтый" },
  { value: "purple", label: "Фиолетовый" },
  { value: "gold", label: "Золотой" },
];

// Helper function to get all brand names
export function getAllBrandNames(): string[] {
  return CAR_BRANDS.map(b => b.name);
}

// Helper function to get models for a brand
export function getModelsForBrand(brandName: string): string[] {
  const brand = CAR_BRANDS.find(
    b => b.name.toLowerCase() === brandName.toLowerCase()
  );
  return brand ? brand.models.map(m => m.name) : [];
}

// Helper function to check if brand is premium
export function isPremiumBrand(brandName: string): boolean {
  const brand = CAR_BRANDS.find(
    b => b.name.toLowerCase() === brandName.toLowerCase()
  );
  return brand?.isPremium || false;
}

// Filter brands by search query
export function filterBrands(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllBrandNames().slice(0, 10);
  return getAllBrandNames().filter(name => 
    name.toLowerCase().includes(q)
  ).slice(0, 10);
}

// Filter models by brand and search query
export function filterModels(brandName: string, query: string): string[] {
  const models = getModelsForBrand(brandName);
  const q = query.toLowerCase().trim();
  if (!q) return models.slice(0, 10);
  return models.filter(name => 
    name.toLowerCase().includes(q)
  ).slice(0, 10);
}
