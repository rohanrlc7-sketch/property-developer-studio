export interface TranslationDictionary {
  appName: string;
  appSub: string;
  country: string;
  state: string;
  district: string;
  language: string;
  bengali: string;
  english: string;
  plotSizeTitle: string;
  widthLabel: string;
  depthLabel: string;
  bhkLabel: string;
  floorsLabel: string;
  facingLabel: string;
  presetsTitle: string;
  bylawTitle: string;
  frontSetback: string;
  rearSetback: string;
  sideSetback: string;
  builtUpArea: string;
  footprintArea: string;
  totalEstCost: string;
  baseRateLabel: string;
  phase1: string;
  phase1Desc: string;
  phase2: string;
  phase2Desc: string;
  phase3: string;
  phase3Desc: string;
  phase4: string;
  phase4Desc: string;
  phase5: string;
  phase5Desc: string;
  phase6: string;
  phase6Desc: string;
  blueprintHeading: string;
  blueprintSub: string;
  generate3DTitle: string;
  exteriorPrompt: string;
  interiorPrompt: string;
  copyPrompt: string;
  copied: string;
  costBreakdownHeading: string;
  greyStructure: string;
  finishingWorks: string;
  interiorTitle: string;
  colorPalette: string;
  lightingPlan: string;
  materialsTextures: string;
  flowTraffic: string;
  askExpertBtn: string;
  consultingAi: string;
  expertReportTitle: string;
  backToInputs: string;
  soilTypeLabel: string;
  geologicalAdvice: string;
  singleFloor: string;
  duplexFloor: string;
  vastuLabel: string;
  vastuStatusExcellent: string;
  vastuStatusGood: string;
  vastuStatusNeutral: string;
  roomDetailTitle: string;
  selectRoomPrompt: string;
  vastuZoneLabel: string;
  addRoomTitle: string;
  roomTypeLabel: string;
  roomWidthLabel: string;
  roomHeightLabel: string;
  roomZoneLabel: string;
  addRoomBtn: string;
  deleteRoomBtn: string;
  resetLayoutBtn: string;
  floorLabel: string;
  groundFloorLabel: string;
  firstFloorLabel: string;
  calcBreakdownTitle: string;
  calcFormulaLabel: string;
  positionXLabel: string;
  positionYLabel: string;
  downloadPngBtn: string;
}

export const TRANSLATIONS: Record<"bn" | "en", TranslationDictionary> = {
  bn: {
    appName: "ইন্ডিয়ান প্রোপার্টি ডেভেলপার ও কস্ট এস্টিমেটর",
    appSub: "আই-চালিত উন্নত দ্বিমাত্রিক ব্লুপ্রিন্ট, সিভিল ইঞ্জিনিয়ারিং খরচ গণনা, ৩ডি জেনারেটর প্রম্পট এবং ইন্টেরিয়র ম্যাপ",
    country: "দেশ",
    state: "রাজ্য",
    district: "জেলা",
    language: "ভাষা",
    bengali: "বাংলা",
    english: "English",
    plotSizeTitle: "১. জমির পরিমাপ ও বিবরণ নির্ধারণ",
    widthLabel: "জমির প্রস্থ (Width - ফুট)",
    depthLabel: "জমির দৈর্ঘ্য / গভীরতা (Depth - ফুট)",
    bhkLabel: "বিএইচকে কনফিগারেশন (BHK)",
    floorsLabel: "তলার সংখ্যা (Stories)",
    facingLabel: "জমির অভিমুখ (Facing Plot)",
    presetsTitle: "স্ট্যান্ডার্ড ভারতীয় প্লট সাইজ",
    bylawTitle: "স্থানীয় পৌরসভা ও জাতীয় কোড (NBC) সেটব্যাক নিয়মাবলী",
    frontSetback: "সামনের খালি জায়গা (Setback)",
    rearSetback: "পিছনের খালি জায়গা (Setback)",
    sideSetback: "পার্শ্ববর্তী খালি জায়গা (Setback)",
    builtUpArea: "মোট বিল্ট-আপ এরিয়া (Built-up Area)",
    footprintArea: "ভূমির পরিমাপ (Footprint)",
    totalEstCost: "আনুমানিক মোট নির্মাণ বাজেট",
    baseRateLabel: "স্থানীয় নির্মাণ রেট (টাকা/বর্গফুট)",
    phase1: "ধাপ ১: প্লট কনফিগারেশন",
    phase1Desc: "জমির পরিমাপ ও অবস্থান নির্ধারণ",
    phase2: "ধাপ ২: গৃহ-নকশা ম্যাপ",
    phase2Desc: "স্থাপত্য নকশা ও বাস্তু লেআউট",
    phase3: "ধাপ ৩: ৩ডি ভিজ্যুয়ালাইজেশন",
    phase3Desc: "ফটো-রিয়ালিস্টিক রেন্ডার প্রম্পট",
    phase4: "ধাপ ৪: মেটেরিয়াল ও খরচ",
    phase4Desc: "সিমেন্ট, রড, ইট ও বালির হিসেব",
    phase5: "ধাপ ৫: ইন্টেরিয়র ও সাজসজ্জা",
    phase5Desc: "রঙের প্যালেট, ফার্নিচার ও লাইটিং",
    phase6: "ধাপ ৬: রঙের খরচ (Paint Expense)",
    phase6Desc: "রং করার ক্ষেত্রফল এবং আনুমানিক খরচ হিসাব",
    blueprintHeading: "ইন্টারেক্টিভ টু-ডি গৃহ-নকশা ম্যাপ",
    blueprintSub: "ভারতের ন্যাশনাল বিল্ডিং কোড (NBC) সেটব্যাক অনুসরণ করে। যেকোনো ঘরের ওপর ক্লিক করে ইন্টেরিয়র সাজসজ্জা ও বাস্তু ডিরেকশন দেখুন।",
    generate3DTitle: "হাইপার-রিয়েলিস্টিক এআই ৩ডি জেনারেটর প্রম্পট (Imagen 3 এর জন্য তৈরি)",
    exteriorPrompt: "বাহ্যিক এলিভেশন ৩ডি প্রম্পট (Exterior 3D Elevation Prompt)",
    interiorPrompt: "অভ্যন্তরীণ পরিবেশ ৩ডি প্রম্পট (Interior Aura & Mood Mood-Board)",
    copyPrompt: "কপি করুন",
    copied: "✓ কপি হয়েছে!",
    costBreakdownHeading: "সিভিল ইঞ্জিনিয়ারিং মেটেরিয়াল ও শ্রম হিসেব",
    greyStructure: "গ্রে স্ট্রাকচার খরচ (ভিত্তি ও পলেস্তারা)",
    finishingWorks: "ফিনিশিংয়ের কাজ (টাইলস, স্যানিটারী ও কালার)",
    interiorTitle: "প্রিন্সিপাল ইন্টেরিয়র ও সাজসজ্জা নির্দেশিকা",
    colorPalette: "রামধনু রঙের প্যালেট ডিজাইন (Hex Codes)",
    lightingPlan: "আলোকসজ্জা ও লাইটিং বিন্যাস রোডম্যাপ",
    materialsTextures: "উপকরণ, টেক্সচার ও ম্যাটেরিয়ালস",
    flowTraffic: "জায়গার ব্যবহার এবং ট্রাফিক ফ্লো",
    askExpertBtn: "এআই সিভিল ইঞ্জিনিয়ার কনসালটেশন নিন",
    consultingAi: "এআই সিভিল ইঞ্জিনিয়ার আপনার রিপোর্ট তৈরি করছেন...",
    expertReportTitle: "এআই সিভিল ইঞ্জিনিয়ার ও বাস্তু বিশেষজ্ঞের বিশেষ রিপোর্ট",
    backToInputs: "ইনপুট পরিবর্তন করুন",
    soilTypeLabel: "মাটির ভূতাত্ত্বিক প্রকৃতি",
    geologicalAdvice: "ফাউন্ডেশন ও সিভিল ইঞ্জিনিয়ারিং পরামর্শ",
    singleFloor: "এক তলা ভবন (Single Floor)",
    duplexFloor: "দোতলা ডুপ্লেক্স (Duplex)",
    vastuLabel: "বাস্তু স্থিতি",
    vastuStatusExcellent: "অত্যন্ত শুভ ও নিখুঁত",
    vastuStatusGood: "উত্তম ও ইতিবাচক",
    vastuStatusNeutral: "সাধারন ও সংস্কারযোগ্য",
    roomDetailTitle: "নির্বাচিত ঘরের বিবরণ ও ডেকোরেশন গাইড",
    selectRoomPrompt: "বামদিকের ম্যাপ থেকে যেকোনো রুম বা অংশে ক্লিক করে তা নির্বাচন করুন এবং তার বিশেষ বাস্তু পরামর্শ ও ইন্টেরিয়র ফিনিশিংয়ের ধারণা দেখুন।",
    vastuZoneLabel: "বাস্তু কোণ",
    addRoomTitle: "কাস্টম নতুন রুম যোগ করুন (Add Space)",
    roomTypeLabel: "রুমের ধরণ (Room Type)",
    roomWidthLabel: "প্রস্থ (Width - ফুট)",
    roomHeightLabel: "দৈর্ঘ্য (Height - ফুট)",
    roomZoneLabel: "কোণ বা অবস্থান (Vastu Zone)",
    addRoomBtn: "রুম যোগ করুন (+)",
    deleteRoomBtn: "রুম মুছে ফেলুন",
    resetLayoutBtn: "লেআউট রিসেট করুন",
    floorLabel: "তলার নির্বাচন (Floor)",
    groundFloorLabel: "নিচ তলা (Ground Floor)",
    firstFloorLabel: "দোতলা (First Floor)",
    calcBreakdownTitle: "গণনার হিসাব বিশ্লেষণ ও সূত্র",
    calcFormulaLabel: "হিসাবের সূত্র (Civil Engineering Formula)",
    positionXLabel: "ডান-বাম অবস্থান (Shift X)",
    positionYLabel: "উপর-নিচ অবস্থান (Shift Y)",
    downloadPngBtn: "ব্লুপ্রিন্ট ডাউনলোড করুন (PNG)"
  },
  en: {
    appName: "Indian Property Developer & Cost Estimator",
    appSub: "AI-Powered Interactive 2D Blueprints, Precise Materials Estimator, 3D Render Prompts & Interior Map",
    country: "Country",
    state: "State",
    district: "District",
    language: "Language",
    bengali: "বাংলা",
    english: "English",
    plotSizeTitle: "1. Land Dimensions & Core Configuration",
    widthLabel: "Plot Width (Frontage - feet)",
    depthLabel: "Plot Depth (Length - feet)",
    bhkLabel: "BHK Configuration",
    floorsLabel: "Building Type",
    facingLabel: "Plot Facing Direction",
    presetsTitle: "Standard Indian Plot Presets",
    bylawTitle: "Local Municipal & NBC Setback Rules",
    frontSetback: "Front Setback",
    rearSetback: "Rear Setback",
    sideSetback: "Side Setback (Left/Right)",
    builtUpArea: "Total Built-up Area",
    footprintArea: "Ground Footprint",
    totalEstCost: "Estimated Construction Budget",
    baseRateLabel: "Regional Construction Base Rate (₹/sq.ft)",
    phase1: "Phase 1: Plot Configuration",
    phase1Desc: "Sizing & Core Configuration",
    phase2: "Phase 2: Layout Blueprint",
    phase2Desc: "Architectural 2D Map & Vastu",
    phase3: "Phase 3: 3D Visualization",
    phase3Desc: "Photorealistic Render Prompts",
    phase4: "Phase 4: Materials & Expenses",
    phase4Desc: "Cement, Steel, Bricks & Sand",
    phase5: "Phase 5: Interior & Decor",
    phase5Desc: "Color Palette, Lights & Texture Map",
    phase6: "Phase 6: Paint Expense",
    phase6Desc: "Wall & Ceiling Paint Calculator & Estimates",
    blueprintHeading: "Interactive 2D Floor Plan Canvas",
    blueprintSub: "Sourced from Indian NBC setback rules. Click on any room component to inspect custom interior guidelines & Vastu reports.",
    generate3DTitle: "Hyper-Descriptive AI 3D Image Generator Prompts (Optimized for Imagen 3)",
    exteriorPrompt: "Exterior 3D Elevation Prompt",
    interiorPrompt: "Interior Mood-Board Prompt",
    copyPrompt: "Copy Prompt",
    copied: "✓ Copied!",
    costBreakdownHeading: "Civil Engineering Material & Labor Breakdown",
    greyStructure: "Grey Structure Budget (Foundation, Walls, Slab)",
    finishingWorks: "Finishing Works Budget (Tiles, Fitting, Paints)",
    interiorTitle: "Senior Interior Decorator Execution Strategy",
    colorPalette: "Rainbow Color Palette Theory (with Hex Codes)",
    lightingPlan: "Space Lighting Plan & Luminance Positioning",
    materialsTextures: "Texture, Fabric, and Architectural Substrates",
    flowTraffic: "Furniture Layout & Kinetic Traffic Optimization",
    askExpertBtn: "Obtain AI Civil Engineer Consultation",
    consultingAi: "AI Civil Engineer is generating your safety report...",
    expertReportTitle: "AI Structural Engineer & Vastu Consultant Report",
    backToInputs: "Adjust Inputs",
    soilTypeLabel: "Geological Soil Class",
    geologicalAdvice: "Foundation & Sub-Structure Guidelines",
    singleFloor: "Single Floor (G+0)",
    duplexFloor: "Duplex Villa (G+1)",
    vastuLabel: "Vastu Status",
    vastuStatusExcellent: "Excellent Alignment",
    vastuStatusGood: "Good Alignment",
    vastuStatusNeutral: "Neutral Alignment",
    roomDetailTitle: "Selected Space Blueprint & Design Guidelines",
    selectRoomPrompt: "Click on any room within the 2D layout canvas to view bespoke material details, Vastu alignment advice, and paint specifications.",
    vastuZoneLabel: "Vastu Direction",
    addRoomTitle: "Add Custom Room / Space",
    roomTypeLabel: "Room Type",
    roomWidthLabel: "Width (feet)",
    roomHeightLabel: "Height (feet)",
    roomZoneLabel: "Anchor Zone (Vastu)",
    addRoomBtn: "Add Room to Layout (+)",
    deleteRoomBtn: "Delete Selected Room",
    resetLayoutBtn: "Reset to Standard Template",
    floorLabel: "Floor Allocation",
    groundFloorLabel: "Ground Floor",
    firstFloorLabel: "First Floor",
    calcBreakdownTitle: "Calculation Formulas & Breakdown",
    calcFormulaLabel: "Civil Equation & Constants",
    positionXLabel: "Horizontal Adjust (Shift X)",
    positionYLabel: "Vertical Adjust (Shift Y)",
    downloadPngBtn: "Download Blueprint (PNG)"
  }
};
