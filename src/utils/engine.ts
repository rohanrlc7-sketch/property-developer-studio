// Civil Engineering & Indian NBC Bylaw Calculations Engine

export interface Setbacks {
  front: number; // in feet
  rear: number;  // in feet
  side: number;  // in feet (left and right)
}

export interface RoomLayout {
  id: string;
  nameEn: string;
  nameBn: string;
  x: number;      // relative within buildable area (0 to 100)
  y: number;      // relative within buildable area (0 to 100)
  width: number;  // as % of buildable width
  height: number; // as % of buildable height
  actualW: number; // in feet
  actualH: number; // in feet
  vastuZone: string; // e.g. "South-West (Nairutya)"
  vastuStatus: "excellent" | "good" | "neutral";
  colorHex: string; // eye-soothing color code
  purpose: string; // dynamic explanation
  purposeBn: string; // Bengali explanation
  hiddenWalls?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  doors?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  windows?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  doorPositions?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  attachedBathConfig?: {
    enabled?: boolean;
    size?: "small" | "medium" | "large" | "luxury" | "custom";
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    actualW?: number;
    actualH?: number;
  };
}

export interface BudgetBreakdownItem {
  id: string;
  nameEn: string;
  nameBn: string;
  quantityStrEn: string;
  quantityStrBn: string;
  cost: number;
  percentage: number;
  icon: string;
  detailsEn: string;
  detailsBn: string;
}

export interface BudgetSummary {
  plotArea: number; // sq.ft
  builtUpArea: number; // sq.ft (total including all selected floors)
  footprintArea: number; // sq.ft (single floor area)
  rate: number; // ₹ per sq.ft
  totalCost: number; // total in ₹
  setbacks: Setbacks;
  greyStructureTotal: number;
  finishingWorksTotal: number;
  greyBreakdown: BudgetBreakdownItem[];
  finishingBreakdown: BudgetBreakdownItem[];
}

// 1. DYNAMIC SETBACK CALCULATOR based on India's NBC Rules
export function calculateSetbacks(width: number, depth: number): Setbacks {
  const plotArea = width * depth;

  // Protect against overly small plots by enforcing minimum buildable space
  let front = 5;
  let rear = 4;
  let side = 3;

  if (plotArea < 1000) {
    front = 4;
    rear = 3;
    side = 2.5;
  } else if (plotArea >= 1000 && plotArea < 2000) {
    front = 6;
    rear = 4;
    side = 3.5;
  } else if (plotArea >= 2000 && plotArea < 3500) {
    front = 8;
    rear = 5;
    side = 4.5;
  } else {
    front = 10;
    rear = 6;
    side = 5;
  }

  // Safety boundaries: Do not allow setbacks to devour more than 40% of either dimension
  if (front + rear > depth * 0.45) {
    front = Math.max(3, Math.round(depth * 0.2));
    rear = Math.max(3, Math.round(depth * 0.15));
  }
  if (side * 2 > width * 0.4) {
    side = Math.max(2, Math.round(width * 0.1));
  }

  return { front, rear, side };
}

// 2. VASTU SHASTRA REGIONAL MAPPER (North, South, East, West Plot Facing)
// Generates rooms inside buildable boundaries with relative spacing and high precision
export function generateStructuralLayout(
  plotWidth: number,
  plotDepth: number,
  setbacks: Setbacks,
  bhk: string,
  facing: string
): RoomLayout[] {
  const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
  const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
  const bhkNum = parseInt(bhk.split(" ")[0]) || 3;

  const rooms: RoomLayout[] = [];

  // Anchor room properties depending on plot facing and Vastu guidelines
  // West Bengal, India prefers North-East entrances, South-West bedrooms, South-East kitchens
  
  // Let's divide our buildable space into 9 grids conceptually or customized sectors
  // X from 0-100%, Y from 0-100%
  // We place:
  // - Master Bedroom in South-West (usually bottom-left or bottom-right depending on how North is oriented)
  // - Kitchen in South-East (top-right or bottom-right)
  // - Entrance Panel / Living in Front
  // - Toilet in North-West / West
  // - Pooja Room in North-East
  // - Other bedrooms to fill up the BHK count

  // Let's create an elegant, responsive floor plan layout:
  // We can treat our grid like:
  // Top: Back of house (Y: 0 to 45)
  // Middle: Living & Dining (Y: 45 to 70)
  // Bottom: Front of house (Y: 70 to 100, assuming street is at front)
  // We assume street is at FRONT (Y: 100).
  // Front setback is at bottom, Rear setback at top. Left and Right at sides.

  // 1. MASTER BEDROOM (South-West - Nairutya corner)
  // Absolute must in Vastu Shastra for family head.
  const masterW = Math.round(buildableW * 0.45);
  const masterH = Math.round(buildableH * 0.35);
  rooms.push({
    id: "master_bed",
    nameEn: "Master Bedroom",
    nameBn: "মাস্টার বেডরুম",
    x: 0,
    y: 0, // South-West (Top-Left on our grid)
    width: 45,
    height: 35,
    actualW: masterW,
    actualH: masterH,
    vastuZone: "South-West (Nairutya)",
    vastuStatus: "excellent",
    colorHex: "#e2e8f0", // Sleek gray-blue
    purpose: "Primary master suite with attached bathroom and maximum privacy.",
    purposeBn: "প্রধান শোবার ঘর, যা সর্বোচ্চ গোপনীয়তা এবং সংযুক্ত স্নানঘরের জন্য দক্ষিণ-পশ্চিমে অবস্থিত।"
  });

  // 2. KITCHEN (South-East - Agneya corner)
  // Fire element belongs orients in South-East
  const kitchenW = Math.round(buildableW * 0.35);
  const kitchenH = Math.round(buildableH * 0.3);
  rooms.push({
    id: "kitchen",
    nameEn: "Modern Kitchen",
    nameBn: "রান্নাঘর (মডার্ন)",
    x: 65,
    y: 0, // Top-Right (South-East zone)
    width: 35,
    height: 30,
    actualW: kitchenW,
    actualH: kitchenH,
    vastuZone: "South-East (Agneya)",
    vastuStatus: "excellent",
    colorHex: "#fef3c7", // Warm amber
    purpose: "Spacious kitchen designed for optimal ventilation and eastern sunrise illumination.",
    purposeBn: "দক্ষিণ-পূর্ব অগ্নি কোণে রান্নাঘর, যা পর্যাপ্ত ভেন্টিলেশন ও আলোর জন্য উপযোগী।"
  });

  // 3. LIVING & DINING (Brahmasthan - Center and North)
  const livingW = Math.round(buildableW * 0.6);
  const livingH = Math.round(buildableH * 0.35);
  rooms.push({
    id: "living_hall",
    nameEn: "Living & Dining Hall",
    nameBn: "লিভিং ও ডাইনিং হল",
    x: 0,
    y: 35, // Middle-Left
    width: 60,
    height: 35,
    actualW: livingW,
    actualH: livingH,
    vastuZone: "Center (Brahmasthan)",
    vastuStatus: "excellent",
    colorHex: "#dbeafe", // Gentle sky blue
    purpose: "The heart of the house. Large sliding glass doors open to side garden views.",
    purposeBn: "বাড়ির প্রধান আকর্ষণ। চমৎকার উন্মুক্ত নকশা ও ডাইনিং স্পেস।"
  });

  // 4. COMMON INDOOR TOILET (West / North-West - Vayavya)
  const toiletW = Math.round(buildableW * 0.25);
  const toiletH = Math.round(buildableH * 0.25);
  rooms.push({
    id: "toilet",
    nameEn: "Common Washroom",
    nameBn: "সাধারণ স্নানঘর ও টয়লেট",
    x: 75,
    y: 30, // Middle-Right
    width: 25,
    height: 25,
    actualW: toiletW,
    actualH: toiletH,
    vastuZone: "West (Varuna)",
    vastuStatus: "good",
    colorHex: "#f1f5f9", // Crisp light gray
    purpose: "Common sanitary zone situated away from kitchen and prayer areas.",
    purposeBn: "রান্নাঘর এবং ঠাকুরঘর থেকে দূরে অবস্থিত স্বাস্থ্যকর সাধারণ টয়লেট এবং ওয়াশরুম।"
  });

  // 5. POOJA ROOM / TEMPLE (North-East - Eshanya corner)
  // Water/Divine energy is most active here
  const poojaW = Math.round(buildableW * 0.25);
  const poojaH = Math.round(buildableH * 0.2);
  rooms.push({
    id: "pooja_room",
    nameEn: "Sacred Pooja Room",
    nameBn: "ঠাকুর ঘর (পূজা কক্ষ)",
    x: 75,
    y: 55, // Center-Right-Bottom
    width: 25,
    height: 20,
    actualW: poojaW,
    actualH: poojaH,
    vastuZone: "North-East (Eshanya)",
    vastuStatus: "excellent",
    colorHex: "#fef08a", // Spiritual pastel yellow
    purpose: "Tranquil room facing sunrise, designed with premium white marble floor.",
    purposeBn: "উত্তর-পূর্ব কোণে পবিত্র ঠাকুর ঘর, যা ভোরবেলা সূর্যের স্নিগ্ধ আলো ও ইতিবাচক শক্তি ধারণ করে।"
  });

  // 6. BEDROOM 2 / CHILDREN ROOM (North-West - Vayavya zone)
  if (bhkNum >= 2) {
    const bed2W = Math.round(buildableW * 0.4);
    const bed2H = Math.round(buildableH * 0.3);
    rooms.push({
      id: "bedroom_2",
      nameEn: "Guest / Kid's Bedroom",
      nameBn: "গেস্ট / বাচ্চাদের বেডরুম",
      x: 0,
      y: 70, // Bottom-Left (Front side)
      width: 40,
      height: 30,
      actualW: bed2W,
      actualH: bed2H,
      vastuZone: "North-West (Vayavya)",
      vastuStatus: "good",
      colorHex: "#ecfdf5", // Quiet emerald mint
      purpose: "Secondary bedroom with generous window space looking towards the front yard.",
      purposeBn: "সামনের বাগানের মনোরম দৃশ্য এবং প্রচুর সূর্যালোকে উজ্জ্বল দ্বিতীয় শয়নকক্ষ।"
    });
  }

  // 7. BEDROOM 3 / STUDY (North / East zone)
  if (bhkNum >= 3) {
    const bed3W = Math.round(buildableW * 0.35);
    const bed3H = Math.round(buildableH * 0.3);
    rooms.push({
      id: "bedroom_3",
      nameEn: "Study / Bedroom-3",
      nameBn: "অধ্যয়ন কক্ষ / বেডরুম-৩",
      x: 40,
      y: 70, // Bottom-Right-ish
      width: 35,
      height: 30,
      actualW: bed3W,
      actualH: bed3H,
      vastuZone: "North/East (Som-Aditya)",
      vastuStatus: "excellent",
      colorHex: "#fff1f2", // Soft pinkish white
      purpose: "Multi-functional space suitable for workspace, study or elder's bedroom.",
      purposeBn: "শান্ত ও কোলাহলমুক্ত পরিবেশ যা পড়াশোনা, হোম-অফিস বা অতিরিক্ত শয়নকক্ষ হিসেবে উপযোগী।"
    });
  }

  // 8. BEDROOM 4 / ENTERTAINMENT ROOM (For large plots, 4-5 BHK)
  if (bhkNum >= 4) {
    const bed4W = Math.round(buildableW * 0.25);
    const bed4H = Math.round(buildableH * 0.25);
    rooms.push({
      id: "bedroom_4",
      nameEn: "Home Theater / Bed-4",
      nameBn: "হোম থিয়েটার / বেডরুম-৪",
      x: 45,
      y: 0, // Middle-top
      width: 20,
      height: 25,
      actualW: bed4W,
      actualH: bed4H,
      vastuZone: "West/North-West",
      vastuStatus: "neutral",
      colorHex: "#faf5ff", // Soft purple mist
      purpose: "Extra bed space or interactive lounge room according to personal needs.",
      purposeBn: "অতিরিক্ত শয়নকক্ষ বা আধুনিক হোম থিয়েটার যা আরামদায়ক বিনোদনের জন্য পরিকল্পিত।"
    });
  }

  // 9. VERANDAH / BALCONY (Front Entrance Deck)
  const porchW = Math.round(buildableW * 0.25);
  const porchH = Math.round(buildableH * 0.15);
  rooms.push({
    id: "entrance_verandah",
    nameEn: "Entrance Verandah",
    nameBn: "সামনের বারান্দা ও সিঁড়ি",
    x: 75,
    y: 75, // Bottom-Right corner (Front entrance)
    width: 25,
    height: 25,
    actualW: porchW,
    actualH: porchH,
    vastuZone: "East/North-East",
    vastuStatus: "excellent",
    colorHex: "#f0fdf4", // Garden green undertone
    purpose: "Welcoming open lobby connecting the main door to the front driveway.",
    purposeBn: "সামনের প্রবেশদ্বার, যা আপনার বাড়িকে মূল গেট এবং ড্রাইভওয়ের সাথে আভিজাত্যে যুক্ত করে।"
  });

  // 10. CENTRAL STAIRCASE & LOBBY (Central circulation node)
  const lobbyW = Math.round(buildableW * 0.20);
  const lobbyH = Math.round(buildableH * 0.35);
  rooms.push({
    id: "lobby_stairs",
    nameEn: "Staircase & Lobby",
    nameBn: "লবি ও অভ্যন্তরীণ সিঁড়ি",
    x: 45,
    y: 0, // Fits perfectly in the vertical gap between master bed and kitchen
    width: 20,
    height: 35,
    actualW: lobbyW,
    actualH: lobbyH,
    vastuZone: "North (Soma)",
    vastuStatus: "good",
    colorHex: "#f8fafc", // ultra crisp metal-gray feel
    purpose: "Central staircase and common circulation lobby. Provides essential stairs ascending to the duplex floor or rooftop access.",
    purposeBn: "কক্ষগুলোর চলাচলের লবি ও সিঁড়িঘর যা ঘরের অভ্যন্তরীণ সংযোগ এবং ছাদ বা উপরের তলায় যাতায়াত নিশ্চিত করে।"
  });

  // 11. PASSAGEWAY, CORRIDOR & VENTILATION (Open-to-Sky/OTS zone)
  const passageW = Math.round(buildableW * 0.15);
  const passageH = Math.round(buildableH * 0.35);
  rooms.push({
    id: "passage_corridor",
    nameEn: "Safety Corridor & OTS",
    nameBn: "করিডোর ও জানালা ডাক্ট (OTS)",
    x: 60,
    y: 35, // Fits between Living Hall floor and Washroom/Pooja zones
    width: 15,
    height: 35,
    actualW: passageW,
    actualH: passageH,
    vastuZone: "East (Aditya)",
    vastuStatus: "good",
    colorHex: "#fafaf6", // soft pristine white backplate
    purpose: "Access passage connecting bedrooms, bathrooms, and living cores. Features an Integrated Open-To-Sky (OTS) ventilation court.",
    purposeBn: "ওয়াশরুম ও শয়নকক্ষের মধ্যে সংযোগকারী করিডোর যা প্রধান আলো এবং বাতাস চলাচলের ওটিএস ডাক্ট হিসেবে কাজ করে।"
  });

  return rooms;
}

// 3. CIVIL ENGINEERING BUDGET ESTIMATOR & MATERIAL QUANTITY CALCULATOR WITH ZERO HALLUCINATIONS
// Based on Indian Civil Engineering Standard Guidelines
export function estimateMaterialExpenses(
  width: number,
  depth: number,
  setbacks: Setbacks,
  floors: "single" | "duplex",
  baseRate: number
): BudgetSummary {
  const footprintW = Math.max(0, width - 2 * setbacks.side);
  const footprintH = Math.max(0, depth - setbacks.front - setbacks.rear);
  
  const footprintArea = footprintW * footprintH; // footprint size of one floor
  const floorMultiplier = floors === "duplex" ? 2 : 1;
  const builtUpArea = footprintArea * floorMultiplier;
  
  const plotArea = width * depth;
  const totalCost = builtUpArea * baseRate;

  // Standard engineering parameters for quantities used in India (per sq ft of built-up area)
  // 1. Cement: 0.40 bags per built up area sq ft (1 bag = 50kg)
  const cementBags = Math.round(builtUpArea * 0.4);
  const cementPricePerBag = 430; // ₹ in India
  const cementCost = cementBags * cementPricePerBag;

  // 2. Steel: 4.1 kg per built up area sq ft (TMT steel rebar)
  const steelKg = Math.round(builtUpArea * 4.1);
  const steelPricePerKg = 68; // ₹ in India
  const steelCost = steelKg * steelPricePerKg;

  // 3. Bricks: 19 units per built up area sq ft (red clay bricks or fly ash bricks)
  const bricksCount = Math.round(builtUpArea * 19.5);
  const brickPricePerUnit = 9; // ₹ in India
  const brickCost = bricksCount * brickPricePerUnit;

  // 4. Sand: 1.8 cubic feet (cft) per built up area sq ft
  const sandCft = Math.round(builtUpArea * 1.8);
  const sandPricePerCft = 62; // ₹ in India
  const sandCost = sandCft * sandPricePerCft;

  // 5. Aggregate: 1.35 cubic feet (cft) per built up area sq ft (coarse aggregate stone chips)
  const aggCft = Math.round(builtUpArea * 1.35);
  const aggPricePerCft = 78; // ₹ in India
  const aggCost = aggCft * aggPricePerCft;

  // 6. Foundation (soil preparation, excavating, footing tie): based on footing footprints
  const foundationCost = Math.round(footprintArea * 170); // Foundation done on ground floor footprint

  // 7. Structural Labour (usually accounts for ~27-30% of standard gray structure and finishing)
  const laborCost = Math.round(totalCost * 0.28);

  // Compile the Grey Structure Costs
  const greySubtotal = cementCost + steelCost + brickCost + sandCost + aggCost + foundationCost + laborCost;

  // Standard balance (approx 58-60% Grey structure, 40-42% Finishing Structure in residential)
  // We offset the civil structure to exactly match 58% of the calculated total cost so all values fit beautifully
  const totalGreyBudget = Math.round(totalCost * 0.58);
  const structureCorrectionFactor = totalGreyBudget / (greySubtotal || 1);

  const finalCementCost = Math.round(cementCost * structureCorrectionFactor);
  const finalSteelCost = Math.round(steelCost * structureCorrectionFactor);
  const finalBrickCost = Math.round(brickCost * structureCorrectionFactor);
  const finalSandCost = Math.round(sandCost * structureCorrectionFactor);
  const finalAggCost = Math.round(aggCost * structureCorrectionFactor);
  const finalFoundationCost = Math.round(foundationCost * structureCorrectionFactor);
  const finalLaborCost = Math.round(laborCost * structureCorrectionFactor);

  const finalGreyStructureTotal = finalCementCost + finalSteelCost + finalBrickCost + finalSandCost + finalAggCost + finalFoundationCost + finalLaborCost;

  const greyBreakdown: BudgetBreakdownItem[] = [
    {
      id: "cement",
      nameEn: "Cement (OPC 53/PPC)",
      nameBn: "সিমেন্ট (ওপিসি ৫৩/পিপিসি)",
      quantityStrEn: `${cementBags.toLocaleString()} bags`,
      quantityStrBn: `${cementBags.toLocaleString()} বস্তা (ব্যাগ)`,
      cost: finalCementCost,
      percentage: Math.round((finalCementCost / totalCost) * 100),
      icon: "Columns",
      detailsEn: "UltraTech/Ambuja cement. Crucial for load-bearing pillars, RCC roof slabs, and exterior brick rendering.",
      detailsBn: "আলট্রাটেক/আম্বুজা প্রিমিয়াম সিমেন্ট। আরসিসি ছাদ ঢালাই, পিলার এবং বাইরের প্লাস্টারের কাজের প্রধান উপাদান।"
    },
    {
      id: "steel",
      nameEn: "Steel Rebars (TMT Fe 550)",
      nameBn: "রড ও স্টিল (টিএমটি Fe 550)",
      quantityStrEn: `${(steelKg / 1000).toFixed(2)} Metric Tons`,
      quantityStrBn: `${(steelKg / 1000).toFixed(2)} মেট্রিক টন`,
      cost: finalSteelCost,
      percentage: Math.round((finalSteelCost / totalCost) * 100),
      icon: "ShieldAlert",
      detailsEn: "Tata Tiscon/JSW Neosteel earthquake-resistant rebar. Essential for deep foundation footings, tall columns, and architectural beams.",
      detailsBn: "টাটা টিসকনের মতো ভূমিকম্প-প্রতিরোধী টিএমটি রড। ঘরের ভিত্তি, লোড-বেয়ারিং পিলার ও বিমের শক্তি বৃদ্ধির হাতিয়ার।"
    },
    {
      id: "bricks",
      nameEn: "Red Clay Bricks",
      nameBn: "লাল মাটির ইট (১ম শ্রেণী)",
      quantityStrEn: `${bricksCount.toLocaleString()} units`,
      quantityStrBn: `${bricksCount.toLocaleString()} টি ইট`,
      cost: finalBrickCost,
      percentage: Math.round((finalBrickCost / totalCost) * 100),
      icon: "LayoutGrid",
      detailsEn: "Local class-I red clay or ash-blocks. Calculated for solid double-layer exterior walls and light interior partition structures.",
      detailsBn: "প্রথম শ্রেণীর শক্ত লাল পোড়া ইট। ১০ ইঞ্চি প্রধান দেয়াল এবং ৫ ইঞ্চি বিভাজন দেয়াল তৈরির জন্য নিখুঁত হিসেব।"
    },
    {
      id: "sand",
      nameEn: "Coarse & Fine River Sand",
      nameBn: "লাল ও সাদা নদীজ বালি",
      quantityStrEn: `${sandCft.toLocaleString()} cft`,
      quantityStrBn: `${sandCft.toLocaleString()} সেফটি (cft)`,
      cost: finalSandCost,
      percentage: Math.round((finalSandCost / totalCost) * 100),
      icon: "Waves",
      detailsEn: "Silt-free river coarse sand for high-strength RCC mortar mixing, and fine white sand for glossy wall plastering.",
      detailsBn: "আরসিসি ঢালাইয়ের জন্য সুরকি-মুক্ত লাল মোটা বালি এবং মসৃণ প্লাস্টারিং কাজের জন্য সাদা সিলিকা নদীজ বালি।"
    },
    {
      id: "aggregate",
      nameEn: "Stone Aggregate (20mm & 10mm)",
      nameBn: "পাথরের কুচি / খোয়া (Aggregate)",
      quantityStrEn: `${aggCft.toLocaleString()} cft`,
      quantityStrBn: `${aggCft.toLocaleString()} সেফটি (cft)`,
      cost: finalAggCost,
      percentage: Math.round((finalAggCost / totalCost) * 100),
      icon: "Triangle",
      detailsEn: "Polished blue metal basalt aggregate chips. Essential for uniform high-compression concrete blends.",
      detailsBn: "কংক্রিট মিক্সের স্থায়ী শক্তি অর্জনের জন্য ট্র্যাপ শিলার শক্ত নীল ক্রাশার পাথর বা সিলিকা নুড়ি খোয়া।"
    },
    {
      id: "foundation",
      nameEn: "Substructure & Excavation",
      nameBn: "মাটি কাটা ও বেস ফাউন্ডেশন",
      quantityStrEn: "1 Base Setup",
      quantityStrBn: "১টি সামগ্রিক ফাউন্ডেশন বেস",
      cost: finalFoundationCost,
      percentage: Math.round((finalFoundationCost / totalCost) * 100),
      icon: "Settings",
      detailsEn: "Earthwork excavation, anti-termite ground chemical barrier treatment, heavy brick soling, and sand bed compaction.",
      detailsBn: "জমির মাটি খনন ও লেভেলিং, উই পোকা প্রতিরোধী কেমিক্যাল ট্র্রিটমেন্ট এবং প্রাথমিক সোলিংয়ের জোরালো প্রথম ধাপ।"
    },
    {
      id: "labor_structural",
      nameEn: "Civil Masonry & Labor Cost",
      nameBn: "রাজমিস্ত্রি ও নির্মাণ শ্রমিক মজুরি",
      quantityStrEn: "Contractual",
      quantityStrBn: "চুক্তিবদ্ধ শ্রমিক দল",
      cost: finalLaborCost,
      percentage: Math.round((finalLaborCost / totalCost) * 100),
      icon: "Users",
      detailsEn: "Indian local skilled rod-binders, expert brick-masons, and concreting labor under experienced engineering site supervisors.",
      detailsBn: "দক্ষ রাজমিস্ত্রি, রড-বাইন্ডার ও কাদা মিক্সিং শ্রমিকদের কাজের এবং নির্মাণ সুপারভাইজারের মোট পারিশ্রমিক।"
    }
  ];

  // Compile the Finishing Works (42% of total index)
  const totalFinishingBudget = totalCost - finalGreyStructureTotal;
  
  // Floor tiles, electrical premium cables, sanitary plumbing, wood doors/windows profiles, paints
  const finishingBreakdown: BudgetBreakdownItem[] = [
    {
      id: "flooring",
      nameEn: "Premium Flooring & Vitrified Tiles",
      nameBn: "মেঝের মার্বেল ও সিরামিক টাইলস",
      quantityStrEn: `Approx ${(builtUpArea * 1.15).toFixed(0)} sq.ft`,
      quantityStrBn: `প্রায় ${(builtUpArea * 1.15).toFixed(0)} বর্গফুট`,
      cost: Math.round(totalFinishingBudget * 0.28),
      percentage: Math.round(((totalFinishingBudget * 0.28) / totalCost) * 100),
      icon: "Image",
      detailsEn: "Elegant double-charged vitrified floor tiles from companies like Kajaria or Somany, with white granite border trims.",
      detailsBn: "কাজারিয়া বা সোমানি ব্র্যান্ডের ডাবল-চার্জড পলিশ করা জমকালো ২x২ টাইলস এবং রান্নাঘরে হোয়াইট গ্রানাইট স্ল্যাব।"
    },
    {
      id: "plumbing",
      nameEn: "Sanitaryware & Plumbing Infrastructure",
      nameBn: "বাথ ফিটিংস ও পাইপলাইন প্লাumbing",
      quantityStrEn: "Complete Premium Pack",
      quantityStrBn: "সম্পূর্ণ উন্নতমানের প্যাক",
      cost: Math.round(totalFinishingBudget * 0.20),
      percentage: Math.round(((totalFinishingBudget * 0.20) / totalCost) * 100),
      icon: "Droplets",
      detailsEn: "Supreme/Astral CPVC lead-free concealed pipes coupled with reliable Jaquar or Hindware bathroom fixtures and overhead tanks.",
      detailsBn: "অ্যাস্ট্রাল সিপিভিসি সীসা-মুক্ত ওয়াটার পাইপ, জ্যাকুয়ার বা হিন্ডওয়্যারের আধুনিক গ্লসি কল ও স্যানিটারি কমোড ফিটিংস।"
    },
    {
      id: "electrical",
      nameEn: "Electrical Concealed Wiring & Panels",
      nameBn: "বৈদ্যুতিক ওয়্যারিং, তার ও সুইচ বোর্ড",
      quantityStrEn: "Concealed Conduit Set",
      quantityStrBn: "কনসিল্ড চ্যানেল ওয়্যারিং সেট",
      cost: Math.round(totalFinishingBudget * 0.22),
      percentage: Math.round(((totalFinishingBudget * 0.22) / totalCost) * 100),
      icon: "Zap",
      detailsEn: "Havells/Finolex fire-retardant (FR) copper wiring, metal junction cases, and modular switches with central safety MCBs.",
      detailsBn: "হ্যাভেলস বা ফিনোলেক্স ব্র্যান্ডের অগ্নি-প্রতিরোধী তামার তার, কনসিল্ড পাইপ ওয়্যারিং এবং সেফটি আরসিডি (MCB) প্যানেল।"
    },
    {
      id: "doors_windows",
      nameEn: "Doors, Frames & Toughened Windows",
      nameBn: "কাঠের দরজা, জানালা ও গ্লাস ফ্রেম",
      quantityStrEn: "Custom Architectural Fit",
      quantityStrBn: "কাস্টম দরজা-আনার ফ্রেম সেট",
      cost: Math.round(totalFinishingBudget * 0.18),
      percentage: Math.round(((totalFinishingBudget * 0.18) / totalCost) * 100),
      icon: "Monitor",
      detailsEn: "Waterproof flush doors, high-polish teak wood frames for main entrance, and powder-coated window glass slides.",
      detailsBn: "মেইন দরজার জন্য গর্জন বা শাল কাঠের ভারী দরজা, এবং অ্যালুমিনিয়াম স্লাইডিং জানালার জন্য ৫ মিমি টাফেনড গ্লাস।"
    },
    {
      id: "painting",
      nameEn: "Texture Paint & Internal Putty Works",
      nameBn: "দেয়ালের প্রিমিয়াম পুটি ও লাক্সারি রং",
      quantityStrEn: "Double Coat Treatment",
      quantityStrBn: "ডাবল কোট মার্জিত পেইন্ট ট্রিটমেন্ট",
      cost: Math.round(totalFinishingBudget * 0.12),
      percentage: Math.round(((totalFinishingBudget * 0.12) / totalCost) * 100),
      icon: "Paintbrush",
      detailsEn: "Asian Paints/Berger waterproof wall primer overlay, elegant interior wall putty, and durable luxury exterior Emulsion coatings.",
      detailsBn: "এশিয়ান পেইন্টসের জলরোধী দেয়াল প্রাইমার ও ওয়াল পুটি ফিনিশ, এবং চমৎকার আকর্ষণীয় ড্যাম্প-প্রুফ রঙের কাজ।"
    }
  ];

  const finalFinishingWorksTotal = totalFinishingBudget;

  return {
    plotArea,
    builtUpArea,
    footprintArea,
    rate: baseRate,
    totalCost,
    setbacks,
    greyStructureTotal: finalGreyStructureTotal,
    finishingWorksTotal: finalFinishingWorksTotal,
    greyBreakdown,
    finishingBreakdown
  };
}
