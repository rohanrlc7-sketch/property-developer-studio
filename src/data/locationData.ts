export interface DistrictInfo {
  name: string;
  soilType: {
    en: string;
    bn: string;
  };
  foundationAdvice: {
    en: string;
    bn: string;
  };
  defaultRate: number; // base rate in INR per sq.ft
}

export interface StateInfo {
  nameEn: string;
  nameBn: string;
  districts: DistrictInfo[];
}

export const INDIAN_STATES: StateInfo[] = [
  {
    nameEn: "Andhra Pradesh",
    nameBn: "অন্ধ্রপ্রদেশ",
    districts: [
      {
        name: "Visakhapatnam",
        soilType: {
          en: "Red Sandy Clay & Coastal Silt",
          bn: "লাল বালুকাময় এঁটেল ও উপকূলীয় পলি"
        },
        foundationAdvice: {
          en: "Heavy pile foundation on beach-side zones. Isolated deep footings in city gravel zones.",
          bn: "সৈকত এলাকার জন্য গভীর পাইল ফাউন্ডেশন এবং সাধারণ শহরের লাল মাটির জন্য গভীর আইসোলেটেড ফুটিং প্রয়োজন।"
        },
        defaultRate: 1750
      },
      {
        name: "Vijayawada",
        soilType: {
          en: "Black Cotton Soil & River Alluvium",
          bn: "কালো তুলা মাটি ও নদী অববাহিকার পলি"
        },
        foundationAdvice: {
          en: "Under-reamed piles recommended to mitigate seasonal high swelling in black soil belts.",
          bn: "কালো তুলার মাটির সংকোচন ও প্রসারণের ঝামেলা মেটাতে আন্ডার-রিমড পাইল করার পরামর্শ দেওয়া হচ্ছে।"
        },
        defaultRate: 1650
      },
      {
        name: "Guntur",
        soilType: {
          en: "Deep Black Cotton Soil & Mixed Clay",
          bn: "গভীর কালো সুতি মাটি এবং মিশ্র কাদা"
        },
        foundationAdvice: {
          en: "Raft or under-reamed pile foundation is mandatory to combat heavy soil swelling.",
          bn: "মাটির অতিরিক্ত প্রসারণ প্রতিরোধে রাফ্ট বা আন্ডার-রিমড পাইল ফাউন্ডেশন করা বাধ্যতামূলক।"
        },
        defaultRate: 1650
      },
      {
        name: "Nellore",
        soilType: {
          en: "Sandy Loam & Alluvial Coastal Clay Surrounding Pennar River",
          bn: "বেলে দোআঁশ ও পেনার নদীর তীরবর্তী পলিময় কাদা"
        },
        foundationAdvice: {
          en: "Continuous strip footing or combined RCC strip depending on groundwater tables.",
          bn: "ভূগর্ভস্থ জলের স্তরের ওপর ভিত্তি করে স্ট্রিপ ফুটিং বা কম্বাইন্ড আরসিসি স্ট্রিপ ফাউন্ডেশন।"
        },
        defaultRate: 1600
      },
      {
        name: "Kurnool",
        soilType: {
          en: "Red Sandy Loam & Stony Quartzite Gravel",
          bn: "লাল বেলে দোআঁশ ও পাথুরে কোয়ার্টজাইট নুড়ি"
        },
        foundationAdvice: {
          en: "Stable high-bearing soil. Safe economical shallow isolated pad footings are sufficient.",
          bn: "অত্যন্ত মজবুত স্থিতিশীল মাটি। সাধারণ সাশ্রয়ী অগভীর বিচ্ছিন্ন কলাম ফুটিং চমৎকার কাজ দেবে।"
        },
        defaultRate: 1550
      },
      {
        name: "Tirupati",
        soilType: {
          en: "Hard Red Sandy Gravel & Weathered Rock",
          bn: "লাল শক্ত পাথুরে বেলে নুড়ি ও ক্ষয়প্রাপ্ত শিলা"
        },
        foundationAdvice: {
          en: "Strong bedrock and hard soil. Standard isolated column pads with tie-beams (~5ft depth only).",
          bn: "পাথুরে মজবুত অত্যন্ত স্থিতিশীল মাটি। টাই-বিম সহ সাধারণ আইসোলেটেড কলাম ফুটিং (৫ ফুট গভীর)।"
        },
        defaultRate: 1700
      }
    ]
  },
  {
    nameEn: "Arunachal Pradesh",
    nameBn: "অরুণাচল প্রদেশ",
    districts: [
      {
        name: "Itanagar",
        soilType: {
          en: "Hill Valley Sandy Gravel & Rock",
          bn: "পার্বত্য উপত্যকার বালুকাময় নুড়ি ও পাথর মাটি"
        },
        foundationAdvice: {
          en: "Step-type terracing layout anchored to bedrock; high anti-seismic retrofitting is mandatory.",
          bn: "পাথুরে স্তরে নোঙর করা খাঁজকাটা ধাপের ভিত্তি; শক্তিশালী ভূমিকম্প সুরক্ষামূলক আরসিসি বিম আবশ্যক।"
        },
        defaultRate: 2100
      },
      {
        name: "Tawang",
        soilType: {
          en: "Fissured Hard Rocks & Mountain Soil",
          bn: "ফাটলযুক্ত শক্ত শিলা ও পার্বত্য মৃত্তিকা"
        },
        foundationAdvice: {
          en: "High-strength direct bedrock contact footings and thermal insulative plinths.",
          bn: "উচ্চ শক্তির ডাইরেক্ট শক্ত শিলা বেস এবং তুষার ও চরম ঠান্ডা থেকে সুরক্ষামূলক থার্মাল প্লিন্থ।"
        },
        defaultRate: 2300
      }
    ]
  },
  {
    nameEn: "Assam",
    nameBn: "আসাম",
    districts: [
      {
        name: "Guwahati",
        soilType: {
          en: "Brahmaputra Alluvial Silt & Sandy Clay",
          bn: "ব্রহ্মপুত্রের পলিমাটি এবং বালুকাময় কাদা মাটি"
        },
        foundationAdvice: {
          en: "Raft foundation with damp-proofing is recommended. Multi-story buildings require deep pile systems due to high seismic risk (Zone V).",
          bn: "স্যাঁতসেঁতে আর্দ্রতা ঠেকাতে প্লাস্টিক ফিল্ম ড্যাম্প-প্রুফিং সহ রাফ্ট বা ডবল রিইনফোর্সড ফুটিং এবং ভূমিকম্প প্রতিরোধী ফ্রেম আবশ্যক (জোন ৫)।"
        },
        defaultRate: 1700
      },
      {
        name: "Dibrugarh",
        soilType: {
          en: "Very Soft Sandy Silt & Water-Logged Loam",
          bn: "অত্যন্ত নরম জলমগ্ন বেলে পলি ও দোআঁশ কাদা মাটি"
        },
        foundationAdvice: {
          en: "Compaction piles or deep continuous RCC strip rafts with plinth raised by minimum 3ft above flood level.",
          bn: "বন্যা এড়াতে সর্বনিম্ন ৩ ফুট উঁচু প্লিন্থ সহ গভীর চওড়া আরসিসি স্ট্রিপ বা বালি-ভরাট কম্প্যাকশন পাইলস করা বাঞ্ছনীয়।"
        },
        defaultRate: 1800
      },
      {
        name: "Silchar",
        soilType: {
          en: "Soft Wetland Clay & Silt",
          bn: "নরম জলাভূমি বা বিলের কাদা ও পলিমাটি"
        },
        foundationAdvice: {
          en: "Deep piles or raft foundations. Raised plinth to protect against Cachar valley flooding.",
          bn: "গভীর পাইল বা রাফ্ট ফাউন্ডেশন। বরাক উপত্যকার তীব্র বন্যা এড়াতে প্লিন্থ ৩-৪ ফুট উঁচু রাখা প্রয়োজন।"
        },
        defaultRate: 1750
      },
      {
        name: "Jorhat",
        soilType: {
          en: "Loose Sandy Loam & Acidic Silt",
          bn: "আলগা বেলে দোআঁশ ও আম্লিক পলি মাটি"
        },
        foundationAdvice: {
          en: "Continuous strip footing or combined rafts with anti-corrosive concrete additives against soil acidity.",
          bn: "ক্রমাগত স্ট্রিপ ফুটিং বা কম্বাইন্ড রাফট। অম্লতা মোকাবেলায় কংক্রিটে অ্যান্টি-অ্যাসিড এডিটিভস নিন।"
        },
        defaultRate: 1700
      }
    ]
  },
  {
    nameEn: "Bihar",
    nameBn: "বিহার",
    districts: [
      {
        name: "Patna",
        soilType: {
          en: "Gangetic Deep Silty Clay",
          bn: "গাঙ্গেয় গভীর পলি কাদা মাটি"
        },
        foundationAdvice: {
          en: "Standard continuous strip footing or strap footings. High seismic safety detailing required.",
          bn: "স্ট্যান্ডার্ড স্ট্র্যাপ ফুটিং বা চওড়া স্ট্রিপ ফুটিং। ভূমিকম্প সুরক্ষিত লিংকেজ রড ব্যবহারের পরামর্শ দেওয়া হচ্ছে।"
        },
        defaultRate: 1550
      },
      {
        name: "Gaya",
        soilType: {
          en: "Gravelly Sandy Loam & Rocky Outcrops",
          bn: "নুড়িযুক্ত বেলে দোআঁশ মাটি এবং শিলা খাঁজ"
        },
        foundationAdvice: {
          en: "Excellent dry load bearing. Economical isolated column footings at 5ft depth are standard.",
          bn: "মজবুত শুকনো মাটি। মাটির ৫ ফুট গভীরে সাধারণ এবং সাশ্রয়ী কোণবিশিষ্ট কলাম ফুটিং চমৎকার কাজ করবে।"
        },
        defaultRate: 1500
      },
      {
        name: "Muzaffarpur",
        soilType: {
          en: "Sandy Alluvium & Deep Silt Complex",
          bn: "বেলে পলি ও গভীর কর্দমাক্ত পলির সুষম আস্তরণ"
        },
        foundationAdvice: {
          en: "Combined strap footings or continuous strip foundation to avoid unequal moisture sinking.",
          bn: "অসমানভাবে মাটি বসে যাওয়া এড়াতে কম্বাইন্ড স্ট্র্যাপ বা ক্রমাগত চওড়া আরসিসি স্ট্রিপ ফাউন্ডেশন।"
        },
        defaultRate: 1500
      },
      {
        name: "Bhagalpur",
        soilType: {
          en: "Alluvial Clay Loam & Clay",
          bn: "পলিময় দোআঁশ কাদা ও চটচটে এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Standard isolated columns with rigid ground-level strap beams to counter minor shifting.",
          bn: "সামান্য স্থানচ্যুতি বা বসে যাওয়া সামলাতে শক্ত টাই-বিম সহ প্রথাগত কলাম ফুটিং।"
        },
        defaultRate: 1500
      },
      {
        name: "Darbhanga",
        soilType: {
          en: "Soft Wet Clayey Silt (Flood prone)",
          bn: "নরম ভিজা কর্দমাক্ত পলি মাটি (বন্যা প্রবণ এলাকা)"
        },
        foundationAdvice: {
          en: "Raft foundation or deep pile layout with plinth raised at least 3.5ft for flood safety.",
          bn: "বন্যা ও স্যাঁতসেঁতে জলা ঠেকাতে উঁচু রাফট প্লাস কমপক্ষে ৩.৫ ফুট উঁচুতে প্লিন্থ মেঝে নির্মাণ বাঞ্ছনীয়।"
        },
        defaultRate: 1550
      },
      {
        name: "Purnia",
        soilType: {
          en: "Loose Fine Sandy Silt",
          bn: "আলগা সূক্ষ্ম বেলে ও বালুকাময় পলি মাটি"
        },
        foundationAdvice: {
          en: "Thick RCC strip foundations or double-layered isolated footing meshes with sand compactions.",
          bn: "বালি কুচি দিয়ে কম্প্যাকশন এবং ডাবল জালি সমন্বিত চওড়া স্ট্রিপ বা আইসোলেটেড ফুটিং।"
        },
        defaultRate: 1500
      }
    ]
  },
  {
    nameEn: "Gujarat",
    nameBn: "গুজরাট",
    districts: [
      {
        name: "Ahmedabad",
        soilType: {
          en: "Sandy Clay Alluvium (Sabar Soil)",
          bn: "বেলে কাদা পলিমাটি (সবর সয়েল)"
        },
        foundationAdvice: {
          en: "Medium isolated columns or combined footings. High seismic Zone III parameters must be followed.",
          bn: "মাঝারি চওড়া কলাম বা কম্বাইন্ড ফুটিং। জোন ৩ মানের ভূমিকম্প নিরোধক রড ব্যান্ডিং জরুরি।"
        },
        defaultRate: 1800
      },
      {
        name: "Surat",
        soilType: {
          en: "Deep Silt & Soft Coastal Mud",
          bn: "গভীর পলি এবং উপকূলীয় নরম কাদা"
        },
        foundationAdvice: {
          en: "Pile foundations down to hard soil layers to prevent coastal shifting. Anti-corrosive concrete recommended.",
          bn: "সাগর তীরের মাটির স্থানচ্যুতি রোধে গভীর পাইল ফাউন্ডেশন। সমুদ্রের লোনা হাওয়া থেকে বাঁচতে রড কোটিং ব্যবহার করুন।"
        },
        defaultRate: 1900
      },
      {
        name: "Vadodara",
        soilType: {
          en: "Black Cotton Soil & Alluvial Clay Loam",
          bn: "কালো তুলা মাটি এবং পলিময় দোআঁশ কাদা মাটি"
        },
        foundationAdvice: {
          en: "Raft foundation or sub-surface tie-beams recommended to counter clay expansion.",
          bn: "কাদার প্রসারণ ও সংকোচন ঠেকাতে রাফ্ট ফাউন্ডেশন বা গভীর মাটির নিচের টাই-বিম ব্যবহারের পরামর্শ দেওয়া হল।"
        },
        defaultRate: 1750
      },
      {
        name: "Rajkot",
        soilType: {
          en: "Rocky Red Soil & Weathered Basalt Rock",
          bn: "পাথুরে লাল মাটি এবং ক্ষয়প্রাপ্ত ব্যাসল্ট শিলা"
        },
        foundationAdvice: {
          en: "Standard direct footings on rock. Highly stable with excellent load bearing capacity.",
          bn: "পাথরের ওপর সরাসরি সাধারণ ফুটিং। উচ্চ লোড বহন ক্ষমতাসম্পন্ন এবং অত্যন্ত মজবুত ভিত্তি।"
        },
        defaultRate: 1700
      },
      {
        name: "Gandhinagar",
        soilType: {
          en: "Indo-Gangetic Deep Dry Alluvial Silt",
          bn: "সিন্ধু-গাঙ্গেয় গভীর শুকনো পলিময় মাটি"
        },
        foundationAdvice: {
          en: "Isolated RCC pad foundations at ~6ft depth. Ground leveling is easy with very steady plain.",
          bn: "৬ ফুটের অগভীর প্রথাগত আইসোলেটেড ফুটিং চমৎকার কাজ দেবে। কম খরচে ও সহজে গ্রেড প্লিন্থ করা যাবে।"
        },
        defaultRate: 1800
      }
    ]
  },
  {
    nameEn: "Haryana",
    nameBn: "হরিয়ানা",
    districts: [
      {
        name: "Gurugram",
        soilType: {
          en: "Semiarid Sandy Silt & Quartzite Gravel",
          bn: "অর্ধ-শুষ্ক বেলে পলি ও কোয়ার্টজাইট নুড়ি"
        },
        foundationAdvice: {
          en: "Standard RC columns on raft or wide pad footings. Deep systems near shifting sand horizons.",
          bn: "রাফট বা চওড়া প্যাড ফুটিংয়ের উপর স্ট্যান্ডার্ড আরসি কলাম। বালি গলে যাওয়া ঠেকাতে যথাযথ কম্প্যাকশন।"
        },
        defaultRate: 2000
      },
      {
        name: "Faridabad",
        soilType: {
          en: "Indo-Gangetic Sandy Alluvial Silt",
          bn: "সিন্ধু-গাঙ্গেয় বেলে পলিমাটি"
        },
        foundationAdvice: {
          en: "Thick plinth beams to support masonry loads and prevent settlement caused by local groundwater depletion.",
          bn: "ভূগর্ভস্থ সুড়ঙ্গের ঝুঁকি এড়াতে এবং মাটির লোড নিতে শক্ত প্লিন্থ বিম সহ আইসোলেটেড ফুটিং।"
        },
        defaultRate: 1850
      },
      {
        name: "Panipat",
        soilType: {
          en: "Deep Sandy Clay & Silt Plains",
          bn: "গভীর বেলে কাদা এবং পলিময় উর্বর সমভূমি"
        },
        foundationAdvice: {
          en: "Stable loam. Normal isolated trapezoidal pad footings are highly cost-efficient and safe.",
          bn: "উন্নত স্থিতিশীল মাটি। প্রথাগত কোণ বিশিষ্ট ট্র্যাপেজয়ডাল আইসোলেটেড ফুটিং অত্যন্ত নিরাপদ ও কম খরচে হবে।"
        },
        defaultRate: 1750
      },
      {
        name: "Ambala",
        soilType: {
          en: "Piedmont Clayey Silt & Gravelly Outwash",
          bn: "পাহাড়ি অঞ্চলের ঢালু কাদা মাটি ও নুড়ি পাথর"
        },
        foundationAdvice: {
          en: "Strong gravelly base. Standard strip footing with well-reinforced brick plinths.",
          bn: "মজবুত নুড়ি পাথরের ভূমি। টাই-বিম সহ স্ট্যান্ডার্ড আরসিসি ট্র্যাপেজয়ডাল কলাম যথেষ্ট উপযুক্ত।"
        },
        defaultRate: 1800
      }
    ]
  },
  {
    nameEn: "Himachal Pradesh",
    nameBn: "হিমাচল প্রদেশ",
    districts: [
      {
        name: "Shimla",
        soilType: {
          en: "Fissured Shale Bedrock & Sandy Silt Luck",
          bn: "ফাটলযুক্ত শেল পাথর শিলা এবং পাহাড়ি বেলে পলিমাটি"
        },
        foundationAdvice: {
          en: "Tiered step-raft foundation strictly anchored to the sloping solid bedrock. Retaining structures are critical.",
          bn: "পাহাড়ি ধস আটকাতে ঢালু পাথরের সাথে স্টিল অ্যাংকর করা থাপ-ধাপ ফাউন্ডেশন এবং মজবুত রিটেইনিং দেয়াল অনস্বীকার্য।"
        },
        defaultRate: 2200
      },
      {
        name: "Dharamshala",
        soilType: {
          en: "Loose Gravely Mountain Silt",
          bn: "পাহাড়ি আলগা নুড়ি কাদা মাটি"
        },
        foundationAdvice: {
          en: "Heavy anti-seismic RCC frame structure on pile base. Soil lock retaining walls with sub-soil drainage bypass.",
          bn: "ধস ও তীব্র ভূমিকম্প ঝুঁকি এড়াতে পাইল ভিত্তিক ভারী ফ্রেম স্ট্রাকচার এবং পানি নিষ্কাশন নালী সহ মাটি আঁকড়ে রাখার দেয়াল।"
        },
        defaultRate: 2150
      }
    ]
  },
  {
    nameEn: "Jharkhand",
    nameBn: "ঝাড়খণ্ড",
    districts: [
      {
        name: "Ranchi",
        soilType: {
          en: "Hard Granitic Red Gravelly Soil",
          bn: "কঠিন গ্র্যানাইট যুক্ত লাল নুড়ি পাথর মাটি"
        },
        foundationAdvice: {
          en: "Extremely stable bedrock. Shorter, cost-effective isolated column footings (~5ft depth only) are ideal.",
          bn: "অত্যন্ত মজবুত ভিত্তি। অল্প গভীরতার (মাত্র ৫ ফুট গভীর) অত্যন্ত সাশ্রয়ী আইসোলেটেড কলাম ফুটিং চমৎকার কাজ দেবে।"
        },
        defaultRate: 1600
      },
      {
        name: "Jamshedpur",
        soilType: {
          en: "Mixed Rocky Red Ironlaterite",
          bn: "পাথুরে লাল লোহা-ল্যাটেরাইট মিশ্র মৃত্তিকা"
        },
        foundationAdvice: {
          en: "High structural load bearing capacity. Simple standard isolated footings.",
          bn: "অত্যন্ত মজবুত লোড বহন ক্ষমতা. সাধারণ সাশ্রয়ী একক কলাম ফুটিং ও মজবুত গ্রেড ও প্লিন্থ বিম।"
        },
        defaultRate: 1650
      },
      {
        name: "Dhanbad",
        soilType: {
          en: "Rocky Carbonaceous Shale & Gravelly Sandstone",
          bn: "পাথুরে শিলা, পাথুরে কয়লা মিশ্রিত নুড়ি ও লাল মাটি"
        },
        foundationAdvice: {
          en: "Extremely hard rock structure. No deep piling required. Simple 4.5ft depth shallow isolated footings are sufficient.",
          bn: "অত্যন্ত শক্ত কালো পাথুরে ও ল্যাটেরাইট শিলা। মাত্র ৪.৫ ফুট গভীর আলগা কোণ কলাম ফুটিং যথেষ্ট।"
        },
        defaultRate: 1600
      },
      {
        name: "Bokaro",
        soilType: {
          en: "Red Gravelly Soil Mixed with Micaceous Sand",
          bn: "অভ্রযুক্ত বালুকা এবং লাল শক্ত নুড়ি মাটি"
        },
        foundationAdvice: {
          en: "Solid firm earth base. Normal standard RCC columns are robust and very economical.",
          bn: "যথেষ্ট মজবুত সমউচ্চ সমভূমি। সাধারণ আরসিসি কলাম ও বিমের সাহায্যে কম খরচে বাড়ি করা যায়।"
        },
        defaultRate: 1550
      }
    ]
  },
  {
    nameEn: "Karnataka",
    nameBn: "কর্ণাটক",
    districts: [
      {
        name: "Bangalore Urban",
        soilType: {
          en: "Sandy Clay Laterite Granular Soil",
          bn: "বালুকাময় এঁটেল ল্যাটেরাইট কণার মাটি"
        },
        foundationAdvice: {
          en: "Excellent load bearing. Simple shallow RCC isolated trapezoidal column footings (~5.5 ft depth).",
          bn: "চমৎকার বহন ক্ষমতা সম্পন্ন মাটি। সাধারণ অগভীর আরসিসি আইসোলেটেড ট্র্যাপেজয়ডাল ফুটিং (প্রায় ৫.৫ ফুট গভীরতা) যথেষ্ট।"
        },
        defaultRate: 2000
      },
      {
        name: "Mysore",
        soilType: {
          en: "Red Gravelly Clay",
          bn: "লাল নুড়িময় এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Isolated shallow pad foundations are standard and economical. Excellent water drainage.",
          bn: "আইসোলেটেড অগভীর প্যাড ফাউন্ডেশন সবচেয়ে সাশ্রয়ী এবং আদর্শ। পানি নিষ্কাশন ব্যবস্থা চমৎকার।"
        },
        defaultRate: 1800
      },
      {
        name: "Hubli-Dharwad",
        soilType: {
          en: "Deep Sticky Black Cotton Soil",
          bn: "গভীর আঠালো কালো তুলা মাটি"
        },
        foundationAdvice: {
          en: "Slabs-on-grade or wide concrete raft foundation is highly recommended to offset shrinkage and swelling cycles.",
          bn: "কালো মাটির দেবে বা ফুলে ওঠা আটকাতে চওড়া আরসিসি কম্বাইন্ড ফুটিং বা কংক্রিট ডাবল রাফট আবশ্যক।"
        },
        defaultRate: 1750
      },
      {
        name: "Mangalore",
        soilType: {
          en: "Coastal Red Lateritic Gravel & Saline Sand",
          bn: "উপকূলীয় লাল ল্যাটেরাইট নুড়ি ও লোনাময় বালি"
        },
        foundationAdvice: {
          en: "Deep piling or continuous strip foundations with premium marine defense waterproof concrete additives.",
          bn: "উপকূলীয় লবণাক্ত আর্দ্রতা থেকে রড বাঁচাতে ওয়াটারপ্রুফিং কোটিং সহ গভীর কলাম বা ক্রমাগত স্ট্রিপ।"
        },
        defaultRate: 1900
      }
    ]
  },
  {
    nameEn: "Kerala",
    nameBn: "কেরালা",
    districts: [
      {
        name: "Thiruvananthapuram",
        soilType: {
          en: "Laterite Red Gravel & Coastal Sand",
          bn: "ল্যাটেরাইট লাল নুড়ি ও উপকূলীয় বেলে মাটি"
        },
        foundationAdvice: {
          en: "Isolated pad foundations in high laterite zones. Damp-proofing is required for coastal humidity protection.",
          bn: "উঁচু ল্যাটেরাইট অঞ্চলের জন্য আইসোলেটেড ফুটিং এবং আর্দ্রতা ও স্যাঁতসেঁতে উপকূলীয় হাওয়া থেকে বাঁচতে ড্যাম্প-প্রুফিং।"
        },
        defaultRate: 1950
      },
      {
        name: "Kochi",
        soilType: {
          en: "Under-Consolidated Soft Clay & Organic Silt",
          bn: "নরম থিতানো নদী কাদা ও উচ্চ জৈব পলি মাটি"
        },
        foundationAdvice: {
          en: "Sparsely stable. Pile foundation down to hard gravel layer (typically 20m depth) to prevent high settlement.",
          bn: "অত্যন্ত আলগা নদীমুখ। দেবে যাওয়া রোধে মাটির বেশ গভীরে (প্রায় ২০ মিটার) আরসিসি পাইল বা রাফ্ট ঢালাই বাধ্যতামূলক।"
        },
        defaultRate: 2100
      }
    ]
  },
  {
    nameEn: "Madhya Pradesh",
    nameBn: "মধ্যপ্রদেশ",
    districts: [
      {
        name: "Bhopal",
        soilType: {
          en: "Black Cotton Soil Layer with Underlying Basalt",
          bn: "কালো তুলা মাটির স্তর এবং নিচে ব্যাসল্ট শিলা"
        },
        foundationAdvice: {
          en: "Slab-on-grade raft or under-reamed multi-bulb piles to offset high clay expansion and contraction cycles.",
          bn: "আঠালো কালো মাটির সংকোচন-প্রসারণ ঠেকাতে চওড়া কংক্রিট রাফ্ট বা নুড়ির আন্ডার-রিমড মাল্টি-বাল্ব পাইল।"
        },
        defaultRate: 1600
      },
      {
        name: "Indore",
        soilType: {
          en: "Highly Expansive Deep Clay",
          bn: "অত্যন্ত প্রসারণশীল গভীর কালো এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Continuous strip or combined footing with plinth beams. Strictly avoid shallow localized footings.",
          bn: "ক্রমাগত স্ট্রিপ বা কম্বাইন্ড ফুটিং সহ শক্ত প্লিন্থ বিম। অগভীর একক কলাম বা বিচ্ছিন্ন ফুটিং এড়িয়ে চলুন।"
        },
        defaultRate: 1700
      }
    ]
  },
  {
    nameEn: "Maharashtra",
    nameBn: "মহারাষ্ট্র",
    districts: [
      {
        name: "Mumbai",
        soilType: {
          en: "Coastal Silt & Basalt Bedrock",
          bn: "উপকূলীয় পলি এবং ব্যাসল্ট শিলা"
        },
        foundationAdvice: {
          en: "Heavy pile foundation on hard basalt layer. Mandatory sulfate-resistant cement due to high humidity and salt.",
          bn: "কঠিন ব্যাসল্ট স্তরের ওপর মজবুত পাইল ফাউন্ডেশন। উপকূলীয় লবণাক্ততা থেকে বাঁচতে সালফেট-প্রতিরোধী সিমেন্ট ব্যবহার করা আবশ্যক।"
        },
        defaultRate: 2400
      },
      {
        name: "Pune",
        soilType: {
          en: "Black Cotton Soil & Hard Rock",
          bn: "কালো তুলা মাটি এবং শক্ত শিলা স্তর"
        },
        foundationAdvice: {
          en: "Under-reamed piles required in expanding black cotton soil areas to bypass heavy seasonal swelling/shrinkage.",
          bn: "কালো তুলা মাটির সংকোচন ও প্রসারণের ঝামেলা মেটাতে আন্ডার-রিমড পাইল বা ডিপ ফাউন্ডেশন অত্যন্ত জরুরি।"
        },
        defaultRate: 1950
      },
      {
        name: "Nagpur",
        soilType: {
          en: "Clayey Red Sandstone Mixture",
          bn: "লাল বেলেপাথর মিশ্রিত এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Isolated column footings with tie beams to resist medium expansiveness.",
          bn: "মাঝারি প্রসারণ প্রতিরোধ করতে টাই বিম সহ বিচ্ছিন্ন কলাম ফুটিং উপযুক্ত।"
        },
        defaultRate: 1700
      }
    ]
  },
  {
    nameEn: "Manipur",
    nameBn: "মণিপুর",
    districts: [
      {
        name: "Imphal",
        soilType: {
          en: "Soft Lacustrine Alluvial Silt & Expansive Clay",
          bn: "নরম হ্রদজাত পলি ও উর্বর আঠালো এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Floating raft foundations with structural brick tie bands. High anti-earthquake protection (Zone V).",
          bn: "নরম হ্রদ এলাকার জন্য ভাসমান রাফ্ট বা ফ্রেম বিম। ভূমিকম্পপ্রবণ অঞ্চলের জন্য সর্বোচ্চ ভূমিকম্প প্রতিরোধী রড বুনন।"
        },
        defaultRate: 1900
      },
      {
        name: "Ukhrul",
        soilType: {
          en: "Hilly Rocky Mountain Soil",
          bn: "পাহাড়ি পাথুরে পার্বত্য মৃত্তিকা"
        },
        foundationAdvice: {
          en: "Anchored step column on firm sandstone. Strong drainage to prevent slope landslide slips.",
          bn: "শক্ত বেলেপাথরে নোঙর করা খাঁজকাটা ধাপের কলাম। পাহাড়ের ধস আটকাতে আর্দ্রতা নিষ্কাশন আউটলেট।"
        },
        defaultRate: 2050
      }
    ]
  },
  {
    nameEn: "Meghalaya",
    nameBn: "মেঘালয়",
    districts: [
      {
        name: "Shillong",
        soilType: {
          en: "Highly Weathered Sandy Quartzite Shales",
          bn: "ক্ষয়প্রাপ্ত বেলে কোয়ার্টজাইট ও নরম শেল পাথর"
        },
        foundationAdvice: {
          en: "Step layout pile or deep pier foundation to solid bedrock. Grade A anti-slippery slope retaining structures.",
          bn: "ধাপ কলাম বা শক্ত পাথুরে বেডরক পর্যন্ত গভীর পিয়ার ফাউন্ডেশন। ভূমিধস এড়াতে শক্তিশালী রিটেইনিং গ্রেড দেয়াল।"
        },
        defaultRate: 2150
      },
      {
        name: "Tura",
        soilType: {
          en: "Sandy Clay mixed with Red Silt",
          bn: "লাল পলির সাথে মিশ্রিত বেলে এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Combined footing or step pad foundations with plinth protection due to heavy tropical rainfall.",
          bn: "ভারী বৃষ্টির হাত থেকে বাঁচাতে প্লিন্থ প্রটেকশন ড্রেন সহ কম্বাইন্ড ফুটিং বা খাঁজকাটা আইসোলেটেড প্যাড।"
        },
        defaultRate: 1950
      }
    ]
  },
  {
    nameEn: "Mizoram",
    nameBn: "মিজোরাম",
    districts: [
      {
        name: "Aizawl",
        soilType: {
          en: "Fissured Shale Bedrock & Soil Slip Silt",
          bn: "ফাটলযুক্ত শেল শিলা এবং ধসযোগ্য পাহাড়ি নরম পলি"
        },
        foundationAdvice: {
          en: "Raft foundations directly anchored to hard rock on split floor layouts. Compulsory micro-pile slope locks.",
          bn: "ঢালু পাহাড়ে ধস আটকাতে মাইক্রো-পাইল এবং শক্ত শিলার সাথে সরাসরি স্টিল রড নোঙর করা রাফ্ট ফুটিং।"
        },
        defaultRate: 2200
      },
      {
        name: "Lunglei",
        soilType: {
          en: "Loose Sandy Loam on Slope Bedrocks",
          bn: "ঢালু পাহাড়ে আলগা বেলে দোআঁশ মাটি"
        },
        foundationAdvice: {
          en: "Shorn step-raft foundations on bedrocks with comprehensive catch-pits to bypass mountain stream runoff.",
          bn: "পাহাড় ঘেঁষে ধাপ ফুটিং এবং ঢালু পাহাড়ি পানির স্রোত বাইপাস করতে চওড়া ড্রেনেজ ক্যাচ-পিট স্থাপন।"
        },
        defaultRate: 2100
      }
    ]
  },
  {
    nameEn: "Nagaland",
    nameBn: "নাগাল্যান্ড",
    districts: [
      {
        name: "Kohima",
        soilType: {
          en: "Highly Swelling Clayey Shales",
          bn: "প্রসারণশীল এঁটেল শেল পাথর ও পাহাড়ি মাটি"
        },
        foundationAdvice: {
          en: "Continuous strip or beam grillage with deep rock anchorage to bypass landslide-prone organic topsoil.",
          bn: "ভূমিধস ছড়ানো টপসয়েল এড়াতে ক্রমাগত স্ট্রিপ বা বিম গ্রিলেজ এবং পাথরে নোঙর করা শিকড় পাইল।"
        },
        defaultRate: 2150
      },
      {
        name: "Dimapur",
        soilType: {
          en: "Soft Dhansiri Alluvial Plains",
          bn: "ধনসিঁড়ি অববাহিকার নরম সমতল পলিমাটি"
        },
        foundationAdvice: {
          en: "Reinforced cement concrete raft or friction piles with plinths raised safely beyond high moisture zones.",
          bn: "স্যাঁতসেঁতে জলমগ্ন সমতলের হাত থেকে বাঁচতে আরসিসি রাফট বা ঘর্ষণ পাইল এবং প্লিন্থ মেঝের উচ্চতা বৃদ্ধি।"
        },
        defaultRate: 1800
      }
    ]
  },
  {
    nameEn: "Odisha",
    nameBn: "ওড়িশা",
    districts: [
      {
        name: "Bhubaneswar",
        soilType: {
          en: "Red Lateritic Gravel and Clay",
          bn: "লাল ল্যাটেরাইটিক নুড়িময় এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Excellent dry load bearing. Standard isolated pad column foundations at 5.5ft are sufficient.",
          bn: "শুকনো চওড়া লাল নুড়ি মাটি। মাটির ৫.৫ ফুট গভীরে সাধারণ সাশ্রয়ী প্যাড বা একক আইসোলেটেড ফুটিং চমৎকার।"
        },
        defaultRate: 1650
      },
      {
        name: "Cuttack",
        soilType: {
          en: "Mahanadi Deltaic Silty Alluvium",
          bn: "মহানন্দা বদ্বীপের নরম পলি ও কাদা মাটি"
        },
        foundationAdvice: {
          en: "Wide combined raft or strap footings with deep brick plinth margins against seasonal flooding risk.",
          bn: "বন্যা ও জলাবদ্ধতা এড়াতে গভীর আরসিসি টাই-বিম সহ চওড়া কম্বাইন্ড রাফ্ট বা স্ট্র্যাপ ফুটিং।"
        },
        defaultRate: 1600
      }
    ]
  },
  {
    nameEn: "Punjab",
    nameBn: "পাঞ্জাব",
    districts: [
      {
        name: "Ludhiana",
        soilType: {
          en: "Deep Silt & Sandy Loam (Indo-Gangetic)",
          bn: "গভীর সূক্ষ্ম পলি ও দোআঁশ বেলেমাটি"
        },
        foundationAdvice: {
          en: "Highly stable. Traditional isolated columns with standard strip masonry blocks work perfectly.",
          bn: "বেশ স্থিতিশীল ও উর্বর শুকনো সমতল। সাধারণ কলাম এবং স্ট্যান্ডার্ড গাঁথনি বিম বেশ নির্ভরযোগ্য ও কম খরচে হবে।"
        },
        defaultRate: 1600
      },
      {
        name: "Amritsar",
        soilType: {
          en: "Silty Clay Alluvial Plains",
          bn: "পলিমাটি ও এঁটেল মাটি মিশ্রিত সমভূমি"
        },
        foundationAdvice: {
          en: "Standard Isolated RCC Columns with ground tying plinth beams to withstand dry hot expansions.",
          bn: "গ্রীষ্মের খরা ও প্রসারণ এড়াতে চার কোণে টাই-বিম সহ স্ট্যান্ডার্ড কলাম ফুটিং।"
        },
        defaultRate: 1650
      }
    ]
  },
  {
    nameEn: "Rajasthan",
    nameBn: "রাজস্থান",
    districts: [
      {
        name: "Jaipur",
        soilType: {
          en: "Arid Wind-Blown Sand & Gravelly Silt",
          bn: "মরু অঞ্চলের হাওয়া বাহিত বালি ও নুড়ি কাদা মাটি"
        },
        foundationAdvice: {
          en: "Soil compaction and water misting required prior to casting isolated trapezoidal footings to secure base sand.",
          bn: "আলগা শুষ্ক বালি বসা ঠেকাতে ঢালাইয়ের পূর্বে মাটির কম্প্যাকশন এবং চওড়া ট্র্যাপেজয়ডাল ফুটিং।"
        },
        defaultRate: 1650
      },
      {
        name: "Udaipur",
        soilType: {
          en: "Aravalli Rocks & Quartzite Gravels",
          bn: "আরাবল্লী পর্বতের শক্ত শিলা ও কোয়ার্টজ নুড়ি"
        },
        foundationAdvice: {
          en: "High load limit. Shallow, very economical isolated stone/concrete pad footings.",
          bn: "পাথুরে অত্যন্ত শক্তিশালী মাটি। স্বল্প গভীরতায় অত্যন্ত চমৎকার সাশ্রয়ী পাথুরে কংক্রিট প্যাড ফুটিং।"
        },
        defaultRate: 1700
      }
    ]
  },
  {
    nameEn: "Sikkim",
    nameBn: "সিকিম",
    districts: [
      {
        name: "Gangtok",
        soilType: {
          en: "Weathered Gneiss & Loose Mountain Shale",
          bn: "পরিবর্তিত নাইস শিলা ও আলগা পাহাড়ি ভঙ্গুর শেল"
        },
        foundationAdvice: {
          en: "Micro-piling or stepped row foundation tied firmly to solid rocky sub-grade; high anti-seismic protection (Zone V).",
          bn: "তীব্র ভূমিকম্প ও ধস প্রবণ পর্বত এলাকা (জোন ৫)। নিচে শক্ত বেডরকের সাথে স্টিল লিড বা মাইক্রো-পাইল নোঙর করা আবশ্যক।"
        },
        defaultRate: 2300
      },
      {
        name: "Namchi",
        soilType: {
          en: "Sloping Sandy Silt & Stone Rubble",
          bn: "ঢালু পাহাড়ি বেলে কাদা ও পাথুরে নুড়ি বালি"
        },
        foundationAdvice: {
          en: "Heavy step layouts with thick stone masonry retaining structures and weep drains.",
          bn: "পানি নিষ্কাশন আউটলেট সহ অত্যন্ত পুরু রিটেইনিং দেয়াল এবং খাড়া পাহাড়ি স্টেপ ধাপ ঢালাই।"
        },
        defaultRate: 2150
      }
    ]
  },
  {
    nameEn: "Tamil Nadu",
    nameBn: "তামিলনাড়ু",
    districts: [
      {
        name: "Chennai",
        soilType: {
          en: "Marine Alluvial Silt & Expansive Clay",
          bn: "লবণাক্ত সামুদ্রিক পলি ও আঠালো এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Deep piles or highly reinforced raft configurations. Sulfate-resistant cement is critical against salt intrusion.",
          bn: "সমুদ্রের নোনা জল এড়াতে গভীর পাইল বা চওড়া আরসিসি রাফ্ট এবং রডের ক্ষয় এড়াতে অ্যান্টি-করোসিভ সালফেট ক্রোম সিমেন্ট।"
        },
        defaultRate: 2000
      },
      {
        name: "Coimbatore",
        soilType: {
          en: "Red Gravelly Soil & Hard Quartz",
          bn: "লাল নুড়িময় পাথর মাটি ও কোয়ার্টজ শিলা"
        },
        foundationAdvice: {
          en: "Highly stable, rapid drainage. Economical shallow isolated square footings are recommended.",
          bn: "অত্যন্ত মজবুত লাল মাটি। খুব অল্প খরচে সাধারণ অগভীর আইসোলেটেড চারকোনা ফুটিং উপযুক্ত।"
        },
        defaultRate: 1800
      }
    ]
  },
  {
    nameEn: "Telangana",
    nameBn: "তেলেঙ্গানা",
    districts: [
      {
        name: "Hyderabad",
        soilType: {
          en: "Hard Alkaline Red Laterite & Granite Gneiss",
          bn: "কঠিন লাল ল্যাটেরাইট ও গ্র্যানাইট শক্ত শিলা"
        },
        foundationAdvice: {
          en: "Supremely stable. Extremely cost-effective shallow isolated columns (~5ft) with ground tie plinth beams.",
          bn: "দারুণ শক্তিশালী ভিত্তি মাটি। মাটির মাত্র ৫ ফুট নিচে সাশ্রয়ী প্যাড টাই-প্লিন্থ কলাম ফুটিং করা যাবে।"
        },
        defaultRate: 1900
      },
      {
        name: "Warangal",
        soilType: {
          en: "Sandy Clay mixed with Black Cotton Clumps",
          bn: "কালো তুলার মাটির টুকরো মিশ্রিত আঠালো বেলে মাটি"
        },
        foundationAdvice: {
          en: "Stiff isolated column pads with continuous ground tie-beams to counter moderate clay expansions.",
          bn: "মাটির মাঝারি প্রসারণ সামলাতে ক্রমাগত টাই-বিম সহ স্ট্যান্ডার্ড কলাম প্যাড ফুটিং।"
        },
        defaultRate: 1700
      }
    ]
  },
  {
    nameEn: "Tripura",
    nameBn: "ত্রিপুরা",
    districts: [
      {
        name: "Agartala",
        soilType: {
          en: "Soft Deep Humus Alluvial Silt",
          bn: "অত্যন্ত নরম গভীর হিউমাস পলি কাদা মাটি"
        },
        foundationAdvice: {
          en: "Double-reinforced raft foundation with damp-proof underlays; earthquake resistant specifications (Zone V).",
          bn: "নরম জলাবদ্ধ কাদা অঞ্চলের জন্য প্লাস্টিক ড্যাম্প-প্রুফিং সহ ডবল বিম আরসিসি রাফ্ট (ভূমিকম্প জোন ৫)।"
        },
        defaultRate: 1800
      },
      {
        name: "Dharmanagar",
        soilType: {
          en: "Undulated Sandy Clay & Soft Gravel",
          bn: "ঢেউ খেলানো নরম বেলে কাদা ও নুড়ি বালি"
        },
        foundationAdvice: {
          en: "Strap and combined footings with dry sand packing prior to layout framing.",
          bn: "কাঠামো বাঁধার পূর্বে শুকনো বালি চাদর ভরাট সহ স্ট্র্যাপ এবং কম্বাইন্ড ফুটিং ব্যবস্থা।"
        },
        defaultRate: 1750
      }
    ]
  },
  {
    nameEn: "Uttar Pradesh",
    nameBn: "উত্তর প্রদেশ",
    districts: [
      {
        name: "Lucknow",
        soilType: {
          en: "Deep Indo-Gangetic Alluvial Silt",
          bn: "সিন্ধু-গাঙ্গেয় পলি ও দোআঁশ কাদা মাটি"
        },
        foundationAdvice: {
          en: "Traditional isolated columns with thick plinth beams to support high dry masonry loads.",
          bn: "উচ্চ গাঁথনি লোড নিতে পুরু প্লিন্থ বিম সহ ঐতিহ্যবাহী বিচ্ছিন্ন কলাম ফুটিং করার পরামর্শ দেওয়া হয়।"
        },
        defaultRate: 1600
      },
      {
        name: "Varanasi",
        soilType: {
          en: "River-bed Sandy Loam Alluvium",
          bn: "নদীর অববাহিকার বেলে দোআঁশ মাটি"
        },
        foundationAdvice: {
          en: "Deep strip foundations with concrete leveling pads. Protect riverward slopes from moisture seepage.",
          bn: "কংক্রিট লেভেলিং প্যাড সহ গভীর স্ট্রিপ ফাউন্ডেশন করতে হবে। নদীর দিক থেকে আর্দ্রতা প্রতিরোধক দেয়াল নিন।"
        },
        defaultRate: 1650
      }
    ]
  },
  {
    nameEn: "Uttarakhand",
    nameBn: "উত্তরাখণ্ড",
    districts: [
      {
        name: "Dehradun",
        soilType: {
          en: "Doon Valley Gravely Silt & Boulder Beds",
          bn: "দুন উপত্যকার নুড়িময় শক্ত কাদা ও পাথর বেড"
        },
        foundationAdvice: {
          en: "Standard combination rafts with heavy grade plinth binders. Strong anti-seismic frame structure parameters (Zone IV).",
          bn: "শক্তিশালী আরসিসি গ্রেড বাইন্ডার সহ স্ট্যান্ডার্ড কম্বিনেশন রাফ্ট এবং আরসিসি ফ্রেম স্ট্রাকচার (জোন ৪)।"
        },
        defaultRate: 1900
      },
      {
        name: "Haridwar",
        soilType: {
          en: "River Gangetic Sandy Clay & Silt plains",
          bn: "গঙ্গা নদী অববাহিকার নরম বেলে সমতল ও কাদা মাটি"
        },
        foundationAdvice: {
          en: "Combined wide strap footings to prevent sandy moisture shifts. Raised plinths above normal flood logs.",
          bn: "জলাবদ্ধতার ঝুঁকি ও বালি বসা এড়াতে চওড়া স্ট্র্যাপ ফুটিং এবং উচুঁ প্লিন্থ স্ল্যাব নির্মাণ।"
        },
        defaultRate: 1750
      }
    ]
  },
  {
    nameEn: "West Bengal",
    nameBn: "পশ্চিমবঙ্গ",
    districts: [
      {
        name: "Kolkata",
        soilType: {
          en: "Soft Alluvial Clay & Silt",
          bn: "নরম পলিমাটি এবং কাদা মাটি"
        },
        foundationAdvice: {
          en: "Deep pile foundation or concrete raft slab with waterproofing is recommended due to high water table.",
          bn: "উচ্চ ভূগর্ভস্থ জলস্তরের কারণে ওয়াটার-প্রুফিং সহ ডিপ পাইল ফাউন্ডেশন বা কংক্রিট রাফ্ট স্ল্যাব করার পরামর্শ দেওয়া হচ্ছে।"
        },
        defaultRate: 1800
      },
      {
        name: "North 24 Parganas",
        soilType: {
          en: "Alluvial Loam Soil",
          bn: "দোআঁশ পলিমাটি"
        },
        foundationAdvice: {
          en: "Standard RC columns on strip footings, deep structural foundations for G+3 or above.",
          bn: "স্ট্রিপ ফুটিংয়ের উপর স্ট্যান্ডার্ড আরসি কলাম এবং জি+৩ বা তার উপরের জন্য গভীর স্ট্রুকচারাল ফাউন্ডেশন লাগবে।"
        },
        defaultRate: 1650
      },
      {
        name: "South 24 Parganas",
        soilType: {
          en: "Soft Alluvial Silt & Saline Clay",
          bn: "নরম পলি ও লবণাক্ত কাদা মাটি"
        },
        foundationAdvice: {
          en: "Pile foundation or continuous rafts with waterproof coating is highly recommended due to tidal influence.",
          bn: "জোয়ার-ভাটার প্রভাবের কারণে ওয়াটারপ্রুফ কোটিং সহ পাইল বা ক্রমাগত রাফট ফাউন্ডেশন তৈরি করা বাঞ্ছনীয়।"
        },
        defaultRate: 1650
      },
      {
        name: "Howrah",
        soilType: {
          en: "Alluvial Clay & Riverine Silt",
          bn: "পলিমাটি ও নদীর অববাহিকার কাদা মাটি"
        },
        foundationAdvice: {
          en: "Heavy raft or combined footing on soft clay. High water table requires solid water protection.",
          bn: "নরম কাদা মাটির উপর চওড়া রাফ্ট বা কম্বাইন্ড ফুটিং। উচ্চ জলস্তরের কারণে নিখুঁত জলপ্রতিরোধী ঢালাই দরকার।"
        },
        defaultRate: 1750
      },
      {
        name: "Hooghly",
        soilType: {
          en: "Clay Loam Alluvial Soil",
          bn: "দোআঁশ কাদা ও পলিমাটি"
        },
        foundationAdvice: {
          en: "Standard RC columns on strip footings. Suitable for typical residential builds with standard plinths.",
          bn: "স্ট্রিপ ফুটিংয়ের উপর স্ট্যান্ডার্ড আরসিসি কলাম। সাধারণ প্লিন্থ সহ সাধারণ আবাসিক বাড়ির জন্য চমৎকার উপযুক্ত।"
        },
        defaultRate: 1600
      },
      {
        name: "Purba Medinipur",
        soilType: {
          en: "Coastal Sandy Alluvium & Saline Clay",
          bn: "উপকূলীয় বেলে মাটি ও নোনা কাদা"
        },
        foundationAdvice: {
          en: "Deep pile foundations or continuous rafts with anti-corrosive concrete treatment against marine salt exposure.",
          bn: "সামুদ্রিক লোনা বাতাস ও ক্ষয় থেকে বাঁচাতে অ্যান্টি-করোসিভ সিমেন্ট ও কোটিং সহ গভীর পাইল বা ক্রমাগত রাফ্ট।"
        },
        defaultRate: 1650
      },
      {
        name: "Paschim Medinipur",
        soilType: {
          en: "Red Lateritic Soil & Gravel",
          bn: "লাল ল্যাটেরাইট মাটি ও নুড়িময় পাথর মাটি"
        },
        foundationAdvice: {
          en: "High load-bearing capacity. Safe shallow isolated pad footings are highly sufficient.",
          bn: "বেশ শক্ত ও চমৎকার ধারণক্ষমতা। কম গভীরতার সাধারণ সাশ্রয়ী কোণবিশিষ্ট কলাম ফুটিং চমৎকার কাজ দেবে।"
        },
        defaultRate: 1550
      },
      {
        name: "Purulia",
        soilType: {
          en: "Hard Red Laterite Rock & Gravel",
          bn: "কঠিন লাল ল্যাটেরাইট শিলা এবং নুড়ি মাটি"
        },
        foundationAdvice: {
          en: "High load-bearing capacity soil. Economical isolated shallow footings are highly sufficient.",
          bn: "উচ্চ বহন ক্ষমতা সম্পন্ন মাটি। সুলভ মূল্যে অগভীর ফুট কাটিং বা আইসোলেটেড ফুটিং চমৎকারভাবে কার্যকর।"
        },
        defaultRate: 1550
      },
      {
        name: "Bankura",
        soilType: {
          en: "Red Lateritic Soil & Sandy Loam",
          bn: "লাল ল্যাটেরাইট ও বেলে দোআঁশ মাটি"
        },
        foundationAdvice: {
          en: "Stable load capacity. Isolated pad footings with ground tie-beams satisfy building requirements easily.",
          bn: "বেশ স্থিতিশীল মাটি। টাই-বিম সহ সাধারণ আইসোলেটেড প্যাড কলাম ফুটিং অত্যন্ত সাশ্রয়ী ও উপযুক্ত হবে।"
        },
        defaultRate: 1550
      },
      {
        name: "Birbhum",
        soilType: {
          en: "Red Soil & Laterite Gravel",
          bn: "লাল মাটি ও ল্যাটেরাইট নুড়ি"
        },
        foundationAdvice: {
          en: "Strong gravelly ground. Economical shallow isolated pad footings. Good drainage prevents seepage.",
          bn: "মজবুত নুড়িময় পাথর মাটি। সাধারণ ও সাশ্রয়ী অগভীর কোণ ফুটিং এবং পানি নিষ্কাশনের সাধারণ ব্যবস্থা।"
        },
        defaultRate: 1550
      },
      {
        name: "Jhargram",
        soilType: {
          en: "Hard Red Laterite Soil & Dense Gravel",
          bn: "লাল কঠিন ল্যাটেরাইট মাটি ও ঘন নুড়ি পাথর"
        },
        foundationAdvice: {
          en: "Extremely stable bedrock. Shorter, cost-effective isolated column footings (~5ft depth only) are ideal.",
          bn: "অত্যন্ত মজবুত কঠিন ভিত্তি। মাত্র ৫ ফুট গভীরে সাধারণ ও সাশ্রয়ী কলাম ফুটিং উপযুক্ত কাজ দেবে।"
        },
        defaultRate: 1550
      },
      {
        name: "Purba Bardhaman",
        soilType: {
          en: "Alluvial Clay Loam",
          bn: "উর্বর পলিময় দোআঁশ কাদা মাটি"
        },
        foundationAdvice: {
          en: "Traditional isolated columns with standard strip masonry blocks. Safe stable plain.",
          bn: "উর্বর সমতল ভূমি। সাধারণ কলাম এবং স্ট্যান্ডার্ড গাঁথনি বিম বেশ নির্ভরযোগ্য ও কম খরচে হবে।"
        },
        defaultRate: 1600
      },
      {
        name: "Paschim Bardhaman",
        soilType: {
          en: "Rocky Laterite & Red Gravelly Soil",
          bn: "পাথুরে ল্যাটেরাইট ও লাল নুড়ি যুক্ত মাটি"
        },
        foundationAdvice: {
          en: "High load-bearing capacity. Simple standard isolated footings and stable plinths.",
          bn: "চমৎকার ও মজবুত ধারণক্ষমতা। সাধারণ সাশ্রয়ী একক কলাম ফুটিং ও মজবুত গ্রেড ও প্লিন্থ বিম।"
        },
        defaultRate: 1650
      },
      {
        name: "Nadia",
        soilType: {
          en: "Gangetic Alluvial Silt and Loam",
          bn: "গাঙ্গেয় অববাহিকার দোআঁশ পলিমাটি"
        },
        foundationAdvice: {
          en: "Thick plinth beams and standard isolated RCC columns are recommended to counter loose sand shifting.",
          bn: "বালি স্লাইডিং এড়াতে মজবুত টাই-বিম এবং চওড়া আইসোলেটেড ফুটিং বসানো উপযুক্ত কাজ হবে।"
        },
        defaultRate: 1600
      },
      {
        name: "Murshidabad",
        soilType: {
          en: "Gangetic Alluvial Silt and Old Clay",
          bn: "গাঙ্গেয় অববাহিকার প্রাচীন পলি ও আঠালো এঁটেল মাটি"
        },
        foundationAdvice: {
          en: "Continuous strip foundations with brick plinth margins against high groundwater moisture.",
          bn: "মাটির আর্দ্রতা এড়াতে ক্রমাগত আরসিসি স্ট্রিপ বা শক্তিশালী প্লিন্থ বিম সহ কলাম ফুটিং।"
        },
        defaultRate: 1600
      },
      {
        name: "Malda",
        soilType: {
          en: "Deep Alluvial Silt & Sandy Loam",
          bn: "গভীর সূক্ষ্ম পলি ও দোআঁশ কাদা মাটি"
        },
        foundationAdvice: {
          en: "Continuous RCC strip rafts or isolated columns with plinth elevated minimum 3.5ft above high flood level.",
          bn: "বন্যা ও জলাবদ্ধতা এড়াতে প্রথাগত কলাম ফুটিংয়ের সাথে প্লিন্থ মেঝের উচ্চতা সাড়ে তিন ফুট উঁচু রাখা বাঞ্ছনীয়।"
        },
        defaultRate: 1600
      },
      {
        name: "Uttar Dinajpur",
        soilType: {
          en: "Sandy Loam & Riverine Silt",
          bn: "বেলে দোআঁশ ও নদীর নরম পলিমাটি"
        },
        foundationAdvice: {
          en: "Combined wide strap footings to prevent sandy moisture shifts. Damp-proofing layers are recommended.",
          bn: "স্যাঁতসেঁতে আর্দ্রতা ঠেকাতে প্লাস্টিক ড্যাম্প-প্রুফিং ফুটিং এবং চওড়া আরসিসি টাই-বিম।"
        },
        defaultRate: 1600
      },
      {
        name: "Dakshin Dinajpur",
        soilType: {
          en: "Fine Silty Clay & Deep Alluvium",
          bn: "সূক্ষ্ম পলি মিশ্রিত কাদা মাটি"
        },
        foundationAdvice: {
          en: "Standard continuous strip footing or isolated column pads. Ensure good plinth tying.",
          bn: "স্থিতিশীল সমতল মাটি। সাধারণ আরসিসি স্ট্রিপ ফুটিং বা চওড়া আইসোলেটেড কলাম ফুটিং ব্যবহার করুন।"
        },
        defaultRate: 1600
      },
      {
        name: "Darjeeling",
        soilType: {
          en: "Hilly Mountainous Sandy Loam & Stone",
          bn: "পার্বত্য বালুকাময় দোআঁশ ও পাথুরে মাটি"
        },
        foundationAdvice: {
          en: "Step layout pile foundation anchored to solid bedrock, strong slope retaining walls with weep holes.",
          bn: "কঠিন পাথুরে ভিত্তির সাথে সংযুক্ত স্টেপ পাইল ফাউন্ডেশন এবং রিটেইনিং দেয়ালের অত্যন্ত প্রয়োজন।"
        },
        defaultRate: 2200
      },
      {
        name: "Kalimpong",
        soilType: {
          en: "Fissured Hard Rock & Hilly Silt",
          bn: "ফাটলযুক্ত শক্ত শিলা ও পাহাড়ি পলি মাটি"
        },
        foundationAdvice: {
          en: "Step-type anchoring directly into bedrocks; high anti-seismic configuration and thick retaining walls are mandatory.",
          bn: "ধস ও তীব্র ভূমিকম্প ঝুঁকি এড়াতে শিলার সাথে নোঙর করা খাঁজকাটা ধাপের কলাম এবং মজবুত গার্ড ওয়াল।"
        },
        defaultRate: 2150
      },
      {
        name: "Jalpaiguri",
        soilType: {
          en: "Terai Alluvial Sandy Gravel & Boulder beds",
          bn: "তরাই অঞ্চলের বেলে নুড়ি ও শক্ত বোল্ডার মাটি"
        },
        foundationAdvice: {
          en: "Deep continuous RCC strip rafts or piles with plinths raised above marshy levels.",
          bn: "আলগা বালি ও বোল্ডার মিশ্রণে দেবে যাওয়া এড়াতে চওড়া আরসিসি কম্বাইন্ড ফুটিং এবং প্লিন্থ মেঝের উচ্চতা বৃদ্ধি।"
        },
        defaultRate: 1700
      },
      {
        name: "Alipurduar",
        soilType: {
          en: "Silty Alluvium mixed with Boulder beds",
          bn: "পাথুরে নুড়ি বোল্ডার মিশ্রিত নরম কাদা ও পলি"
        },
        foundationAdvice: {
          en: "Continuous strip or combined footing with plinth beams. Anti-seismic detailing is required.",
          bn: "ভূমিকম্প প্রতিরোধী স্ট্র্যাপ বা কম্বাইন্ড ফুটিং সহ শক্ত প্লিন্থ বেল্ট ঢালাই সাজেস্ট করা যাচ্ছে।"
        },
        defaultRate: 1700
      },
      {
        name: "Cooch Behar",
        soilType: {
          en: "Soft Sandy Alluvial Silt",
          bn: "অত্যন্ত নরম বেলে দোআঁশ ও নদী পলিমাটি"
        },
        foundationAdvice: {
          en: "Reinforced cement concrete raft with raised plinths to prevent shifting from heavy rain waterlogging.",
          bn: "ভারী বৃষ্টির জলাবদ্ধতা এড়াতে আরসিসি চওড়া কলাম রাফ্ট বা ডাবল জালি ফুটিং সহ উঁচু বেসমেন্ট প্লিন্থ।"
        },
        defaultRate: 1700
      }
    ]
  },
  
  // UNION TERRITORIES OF INDIA
  {
    nameEn: "Andaman & Nicobar",
    nameBn: "আন্দামান ও নিকোবর",
    districts: [
      {
        name: "Port Blair",
        soilType: {
          en: "Marine Alluvial Silt & Coastal Sandy Shales",
          bn: "সামুদ্রিক পলি ও উপকূলীয় বেলে শেল কাদা"
        },
        foundationAdvice: {
          en: "Friction piles on rocky beds; maximum Grade V seismic safety, high anti-tsunami elevation.",
          bn: "উপকূলের বালি শোধনে আরসিসি ঘর্ষণ পাইল এবং সমুদ্রতীরের জলোচ্ছ্বাস এড়াতে সর্বোচ্চ জোন ৫ এর ভূমিকম্প নিরোধক রড ব্যান্ডিং।"
        },
        defaultRate: 2300
      }
    ]
  },
  {
    nameEn: "Chandigarh",
    nameBn: "চণ্ডীগড়",
    districts: [
      {
        name: "Chandigarh",
        soilType: {
          en: "Deep Silt & Clay Alluvium (Stable Plains)",
          bn: "গভীর সুসংহত পলি ও দোআঁশ সমতল কাদা মাটি"
        },
        foundationAdvice: {
          en: "Highly stable. Simple standard isolated RCC columns with tie-beams (~5ft depth only).",
          bn: "অত্যন্ত স্থিতিশীল মাটি। মাত্র ৫ ফুট গভীরে সাধারণ ও সাশ্রয়ী কলাম এবং স্ট্যান্ডার্ড প্লিন্থ টাই-বিম।"
        },
        defaultRate: 1950
      }
    ]
  },
  {
    nameEn: "Dadra & Nagar Haveli, Daman & Diu",
    nameBn: "দাদরা ও নগর হাভেলি, দমন ও দিউ",
    districts: [
      {
        name: "Daman",
        soilType: {
          en: "Coastal Silt & Marshy Sandy Soil",
          bn: "স্যাঁতসেঁতে উপকূলীয় পলি ও মোহনার কর্দমাক্ত বালু"
        },
        foundationAdvice: {
          en: "Raft foundations with standard anti-corrosive treatments to defend against coastal humidity.",
          bn: "লবণাক্ততা ও অতিরিক্ত ড্যাম্প থেকে রক্ষা পেতে অ্যান্টি-করোসিভ আরসিসি রাফ্ট এবং ড্যাম্প-প্রুফ প্লাস্টিক চাদর।"
        },
        defaultRate: 1900
      }
    ]
  },
  {
    nameEn: "Delhi",
    nameBn: "দিল্লি",
    districts: [
      {
        name: "South Delhi",
        soilType: {
          en: "Delhi Quartzite Ridge Rocky & Yamuna Sandy Silt",
          bn: "দিল্লি কোয়ার্টজাইট পাথুরে উপত্যকা এবং যমুনার বেলেমাটি"
        },
        foundationAdvice: {
          en: "High bearing capacity in rocky zones (isolated footings). Deep RCC rafts near Yamuna banks for seismic safety.",
          bn: "পাথুরে অঞ্চলে আইসোলেটেড ফুটিং এবং যমুনার কাছাকাছি অঞ্চলের জন্য ভূমিকম্প প্রতিরোধী আরসিসি রাফ্ট ফাউন্ডেশন বাঞ্ছনীয়।"
        },
        defaultRate: 2100
      },
      {
        name: "East Delhi",
        soilType: {
          en: "Yamuna Floodplain Alluvium & Loose Sand",
          bn: "যমুনা অববাহিকার পলি এবং আলগা বালি মাটি"
        },
        foundationAdvice: {
          en: "Raft foundations with reinforced floor beams to prevent differential settlement during micro-seismic events.",
          bn: "ভূমিকম্পে অসমান দেবে যাওয়া রোধে চওড়া রাফ্ট ফাউন্ডেশন এবং রিইনফোর্সড ফ্লোর বিম তৈরি করার পরামর্শ দেওয়া হচ্ছে।"
        },
        defaultRate: 1850
      }
    ]
  },
  {
    nameEn: "Jammu & Kashmir",
    nameBn: "জম্মু ও কাশ্মীর",
    districts: [
      {
        name: "Srinagar",
        soilType: {
          en: "Soft Lacustrine Silt & Carewas Clay",
          bn: "নরম হ্রদজাত পলি ও কারেওয়াস এঁটেল কাদা মাটি"
        },
        foundationAdvice: {
          en: "Wide combined raft foundations with highly reinforced beams (Zone V Seismic risk). Highly freeze-thaw insulated.",
          bn: "হ্রদ ও কাদা অঞ্চলের দেবে যাওয়া রুখতে চওড়া স্ল্যাব রাফ্ট এবং অতি ঠান্ডা প্রতিরোধী কোল্ড কনক্রিট মিক্স (ভূমিকম্প জোন ৫)।"
        },
        defaultRate: 2100
      },
      {
        name: "Jammu",
        soilType: {
          en: "Gravelly Sandy Alluvial plain",
          bn: "নুড়িযুক্ত বালি ও পলি মিশ্রিত উর্বর সমভূমি"
        },
        foundationAdvice: {
          en: "Sash isolated trapezoidal-pad systems with strong plinth level tie anchors.",
          bn: "আলগা বালি ও নুড়িময় ঢাল নিয়ন্ত্রণে টাই-অ্যাঙ্কর প্লিন্থ সহ সাধারণ ট্র্যাপেজয়ডাল প্যাড ফুটিং।"
        },
        defaultRate: 1900
      }
    ]
  },
  {
    nameEn: "Ladakh",
    nameBn: "লাদাখ",
    districts: [
      {
        name: "Leh",
        soilType: {
          en: "Glacial Till gravel & Permafrost Sandy Soil",
          bn: "হিমবাহ নুড়ি পাথর মাটি ও চিরহিমায়িত বরফ বালি মাটি"
        },
        foundationAdvice: {
          en: "Deep thermopile foundations or thermal insulation beds to protect from under-slab frost heave expansion.",
          bn: "চরম ঠাণ্ডায় মাটির ভেতরের বরফ সম্প্রসারণ ঠেকাতে থার্মো-পাইল এবং মাটির তলায় বিশেষ থার্মাল ড্রেন সিট স্থাপন।"
        },
        defaultRate: 2400
      }
    ]
  },
  {
    nameEn: "Lakshadweep",
    nameBn: "লাক্ষা দ্বীপ",
    districts: [
      {
        name: "Kavaratti",
        soilType: {
          en: "Coral Sandy Soil & Extremely Porous Calcareous Silt",
          bn: "প্রবাল বেলে মাটি ও চুনাপাথর সম্বলিত ছিদ্রযুক্ত সমুদ্র পলি"
        },
        foundationAdvice: {
          en: "Lightweight continuous strip rafting. High chemical moisture proofing required for coastal sea erosion protection.",
          bn: "ছিদ্রযুক্ত বেলে মাটির ক্ষয় রুখতে হালকা আরসিসি ফ্রেমিং এবং সমুদ্রের ঢেউ থেকে বাঁচতে অতিরিক্ত জিংক কোটিং পেন্ট ও প্লাস্টার।"
        },
        defaultRate: 2350
      }
    ]
  },
  {
    nameEn: "Puducherry",
    nameBn: "পুদুচেরি",
    districts: [
      {
        name: "Puducherry",
        soilType: {
          en: "Coastal Arenaceous Sand & Interspersed Red Soil",
          bn: "উপকূলীয় নোনা বালু ও পলি লাল মাটির সংমিশ্রণ"
        },
        foundationAdvice: {
          en: "Standard continuous strip rafts or isolated footing on high lateritic mounds.",
          bn: "উপকূলীয় আলগা বালির দেবে যাওয়ার ঝুঁকি এড়াতে আরসিসি স্ট্রিপ রাফ্ট বা লাল মাটির ওপরে আইসোলেটেড ফুটিং।"
        },
        defaultRate: 1850
      }
    ]
  }
];
