export interface GameExtraDetail {
  year: string;
  developer: string;
  genre: string;
  genre_en?: string;
  status: string;
  trailerYoutubeId?: string;
  screenshots: string[];
  fileSize: string;
  patchType: string;
  steamUrl?: string;
  installSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  compatibilityNotes?: string;
}

export const GAME_EXTRAS: Record<string, GameExtraDetail> = {
  "silent-hill-townfall": {
    year: "2026",
    developer: "No Code / Konami / Annapurna Interactive",
    genre: "رعب نفسي • غموض • تحقيق",
    genre_en: "Psychological Horror • Mystery",
    status: "مكتمل 100%",
    trailerYoutubeId: "P-Y3o92x830",
    screenshots: [
      "/images/covers/silent-hill-townfall.jpg",
    ],
    fileSize: "18 ميغابايت",
    patchType: "استبدال ملفات Unreal Engine 5 (.pak)",
    steamUrl: "https://store.steampowered.com/",
    installSteps: [
      {
        step: 1,
        title: "تحميل الباتش",
        description: "حمّل ملف الباتش المضغوط باللغة العربية وفك الضغط عنه باستخدام 7-Zip أو WinRAR.",
      },
      {
        step: 2,
        title: "نقل ملف التعريب",
        description: "انقل ملف `pakchunk1-Windows.pak` المعرب إلى مجلد اللعبة الرئيسي داخل مسار `Townfall/Content/Paks/`.",
      },
      {
        step: 3,
        title: "تشغيل اللعبة",
        description: "شغل اللعبة مباشرة وستجد كافة الحوارات والواجهات والنصوص باللغة العربية السليمة.",
      },
    ],
    compatibilityNotes: "متوافق مع النسخة الرسمية على PC مع الحفاظ على ملفات الحفظ الأصلية.",
  },

  "control-resonant": {
    year: "2024",
    developer: "Remedy Entertainment / 505 Games",
    genre: "أكشن • خوارق طبيعية • تصويب منظور ثالث",
    genre_en: "Action • Supernatural • Third-Person Shooter",
    status: "مكتمل 100%",
    trailerYoutubeId: "F74LLDhAh9w",
    screenshots: [
      "/images/covers/control-resonant.jpg",
    ],
    fileSize: "84 ميغابايت",
    patchType: "مثبت تلقائي + استبدال ملفات",
    steamUrl: "https://store.steampowered.com/app/870780/Control_Ultimate_Edition/",
    installSteps: [
      {
        step: 1,
        title: "تحميل الملف",
        description: "حمّل حزمة التعريب وفك الضغط عنها في أي مجلد تختاره.",
      },
      {
        step: 2,
        title: "تطبيق التحديث",
        description: "انسخ محتويات الباتش وضعها داخل مجلد تثبيت اللعبة `Control/data_pack/` واستبدل عند الطلب.",
      },
      {
        step: 3,
        title: "بدء اللعب",
        description: "ادخل إلى خيارات اللعبة واختر العربية للغة القوائم والحوارات.",
      },
    ],
    compatibilityNotes: "متوافق مع نسختي Steam و Epic Games Store لنسخة Control Ultimate Edition.",
  },

  "escape-from-duckov": {
    year: "2025",
    developer: "Team Duckov",
    genre: "إطلاق نار وتكتيك • بقاء • منظور علوي",
    genre_en: "Tactical Shooter • Survival • Top-down",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/duckov-1.png",
      "/images/screenshots/duckov-2.png",
      "/images/screenshots/duckov-3.png",
    ],
    fileSize: "32 ميغابايت",
    patchType: "ملفات إضافية وتحديث الخطوط (BepInEx)",
    steamUrl: "https://store.steampowered.com/",
    installSteps: [
      {
        step: 1,
        title: "فك ضغط الباتش",
        description: "حمّل ملف التعريب `Escape_from_Duckov_Arabic_RuntimeSafe_v2.3.zip` وافتحه.",
      },
      {
        step: 2,
        title: "نسخ المجلدات",
        description: "انسخ مجلد `BepInEx` والصقه مباشرة في مجلد اللعبة الرئيسي بجوار ملف تشغيل اللعبة `.exe`.",
      },
      {
        step: 3,
        title: "تشغيل اللعبة",
        description: "شغل اللعبة بشكل طبيعي وسيتم تفعيل التعريب ودعم الكتابة من اليمين إلى اليسار تلقائياً.",
      },
    ],
    compatibilityNotes: "يدعم أحدث تحديث للعبة على منصة Steam.",
  },

  "the-dressmaker": {
    year: "2024",
    developer: "Indie Horror Collective",
    genre: "رعب نفسي • ألغاز • سرد قصصي",
    genre_en: "Psychological Horror • Puzzle • Narrative",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/dressmaker-1.png",
      "/images/covers/dressmaker.png",
    ],
    fileSize: "14 ميغابايت",
    patchType: "استبدال ملفات اللعبة",
    installSteps: [
      {
        step: 1,
        title: "تحميل باتش صانعة الفساتين",
        description: "حمّل حزمة التعريب وفك الضغط عن الملف.",
      },
      {
        step: 2,
        title: "استبدال الملفات",
        description: "انقل ملفات التعريب إلى مجلد اللعبة واستبدل الملفات المطلوبة.",
      },
      {
        step: 3,
        title: "الاستمتاع باللعبة",
        description: "افتح اللعبة واستمتع بتجربة الرعب السردي باللغة العربية الفصحى.",
      },
    ],
    compatibilityNotes: "متوافق مع نظام Windows للنسخ الأصلية.",
  },

  "backseat": {
    year: "2024",
    developer: "Dystopian Studio",
    genre: "غموض • قيادة وسفر • رعب نفسي",
    genre_en: "Mystery • Psychological Horror • Driving",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/backseat-1.png",
      "/images/screenshots/backseat-2.png",
    ],
    fileSize: "16 ميغابايت",
    patchType: "باتش استبدال ملفات اللغات",
    installSteps: [
      {
        step: 1,
        title: "فك الضغط",
        description: "حمّل ملف الباتش وفك الضغط عنه بواسطة WinRAR أو 7-Zip.",
      },
      {
        step: 2,
        title: "نقل الحزمة",
        description: "انسخ الملفات إلى مجلد اللعبة الرئيسي.",
      },
      {
        step: 3,
        title: "التشغيل",
        description: "شغل اللعبة واستمتع بالقصة باللغة العربية.",
      },
    ],
  },

  "echoweaver": {
    year: "2025",
    developer: "Echo Games",
    genre: "ألغاز ومنصات • خيال علمي • مغامرة",
    genre_en: "Puzzle Platformer • Sci-Fi",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/echoweaver-1.png",
      "/images/screenshots/echoweaver-2.png",
    ],
    fileSize: "22 ميغابايت",
    patchType: "استبدال ملفات الواجهة والنصوص",
    installSteps: [
      {
        step: 1,
        title: "تحميل الباتش",
        description: "حمّل الملف المضغوط وفك الضغط عنه.",
      },
      {
        step: 2,
        title: "التثبيت",
        description: "ضع ملفات التعريب في مسار التثبيت الرئيسي للعبة.",
      },
      {
        step: 3,
        title: "جاهز",
        description: "ابدأ اللعبة وستجد كافة الألغاز والنصوص معربة بالكامل.",
      },
    ],
  },

  "guacamelee-2": {
    year: "2018",
    developer: "DrinkBox Studios",
    genre: "مترويدفينيا • أكشن ومغامرات • قتال وكوميديا",
    genre_en: "Metroidvania • Action-Adventure • Brawler",
    status: "مكتمل 100%",
    trailerYoutubeId: "Z0oYyV_4v5k",
    screenshots: [
      "/images/covers/guacamelee-2.png",
    ],
    fileSize: "65 ميغابايت",
    patchType: "حزمة تعريب كاملة للخطوط والنصوص",
    steamUrl: "https://store.steampowered.com/app/534500/Guacamelee_2/",
    installSteps: [
      {
        step: 1,
        title: "فك الضغط",
        description: "فك الضغط عن حزمة التعريب للعبة Guacamelee! 2.",
      },
      {
        step: 2,
        title: "استبدال ملفات اللعبة",
        description: "انسخ محتويات الباتش إلى مجلد تثبيت اللعبة واستبدل الملفات عند المطالبة.",
      },
      {
        step: 3,
        title: "بدء اللعب",
        description: "شغل اللعبة وستظهر القوائم والنصوص الفكاهية باللغة العربية.",
      },
    ],
  },

  "inside": {
    year: "2016",
    developer: "Playdead",
    genre: "ألغاز • منصات سينمائية • غموض ورعب هادئ",
    genre_en: "Puzzle-Platformer • Cinematic • Dystopian",
    status: "مكتمل 100%",
    trailerYoutubeId: "yDm6PAgNohU",
    screenshots: [
      "/images/covers/inside.jpg",
    ],
    fileSize: "10 ميغابايت",
    patchType: "استبدال نصوص وقوائم اللعبة",
    steamUrl: "https://store.steampowered.com/app/304430/INSIDE/",
    installSteps: [
      {
        step: 1,
        title: "تحميل الباتش",
        description: "حمّل ملف التعريب لـ INSIDE وفك الضغط.",
      },
      {
        step: 2,
        title: "نقل الملفات",
        description: "انقل ملفات الباتش لمجلد اللعبة واستبدل الملفات المطلوبة.",
      },
      {
        step: 3,
        title: "التشغيل",
        description: "شغل اللعبة وستجد القوائم والإعدادات معربة بالكامل.",
      },
    ],
  },

  "bloodstained-ritual-of-the-night": {
    year: "2019",
    developer: "ArtPlay / 505 Games",
    genre: "أكشن آر بي جي • مترويدفينيا • رعب قوطي",
    genre_en: "Action RPG • Metroidvania • Gothic Horror",
    status: "مكتمل 100%",
    trailerYoutubeId: "5k4F31Z0n00",
    screenshots: [
      "/images/covers/bloodstained.jpg",
    ],
    fileSize: "115 ميغابايت",
    patchType: "حزمة نصوص وخطوط مخصصة",
    steamUrl: "https://store.steampowered.com/app/692850/Bloodstained_Ritual_of_the_Night/",
    installSteps: [
      {
        step: 1,
        title: "تحميل الباتش",
        description: "حمّل الحزمة وفك الضغط عن الملفات.",
      },
      {
        step: 2,
        title: "وضع الملفات في مجلد Paks",
        description: "انسخ ملفات الباتش المعربة إلى مجلد `BloodstainedRotN/Content/Paks/`.",
      },
      {
        step: 3,
        title: "بدء اللعب",
        description: "شغل اللعبة واستمتع بترجمة جميع الحوارات والمهام والقوائم.",
      },
    ],
  },

  "end-of-abyss": {
    year: "2024",
    developer: "Abyss Interactive",
    genre: "رعب واستكشاف • أعماق البحار • غموض",
    genre_en: "Horror • Deep Sea • Exploration",
    status: "مكتمل 100%",
    screenshots: [
      "/images/covers/end-of-abyss.jpg",
    ],
    fileSize: "38 ميغابايت",
    patchType: "استبدال ملفات اللعبة",
    installSteps: [
      {
        step: 1,
        title: "فك الضغط",
        description: "فك الضغط عن حزمة التعريب.",
      },
      {
        step: 2,
        title: "التثبيت",
        description: "انقل الملفات إلى مجلد اللعبة واستبدلها.",
      },
      {
        step: 3,
        title: "التشغيل",
        description: "شغل اللعبة لتجربة أجواء الرعب باللغة العربية.",
      },
    ],
  },

  "the-seance-of-blake-manor": {
    year: "2024",
    developer: "Spooky Tales Studio",
    genre: "تحقيق وخوارق • رعب كلاسيكي • ألغاز",
    genre_en: "Supernatural • Detective • Mystery",
    status: "مكتمل 100%",
    screenshots: [
      "/images/covers/blake-manor.jpg",
    ],
    fileSize: "26 ميغابايت",
    patchType: "استبدال ملفات الحوارات والنصوص",
    steamUrl: "https://store.steampowered.com/app/3249050/",
    installSteps: [
      {
        step: 1,
        title: "تحميل الملف",
        description: "حمّل ملف الباتش المحدث.",
      },
      {
        step: 2,
        title: "النقل",
        description: "انقل محتويات الحزمة إلى مجلد اللعبة.",
      },
      {
        step: 3,
        title: "التشغيل",
        description: "ابدأ جلسة التحضير باللغة العربية كاملة.",
      },
    ],
  },

  "well-dweller": {
    year: "2024",
    developer: "Wellspring Games",
    genre: "رعب واستكشاف • مغامرة سريالية",
    genre_en: "Horror • Surreal • Exploration",
    status: "مكتمل 100%",
    screenshots: [
      "/images/covers/well-dweller.jpg",
    ],
    fileSize: "19 ميغابايت",
    patchType: "استبدال ملفات اللعبة",
    steamUrl: "https://store.steampowered.com/app/3067810/",
    installSteps: [
      {
        step: 1,
        title: "تحميل الباتش",
        description: "فك الضغط عن الملف المحمل.",
      },
      {
        step: 2,
        title: "تثبيت الملفات",
        description: "انقل ملفات الباتش لمجلد اللعبة الرئيسي.",
      },
      {
        step: 3,
        title: "بدء اللعب",
        description: "شغل اللعبة واستمتع بالنصوص المعربة.",
      },
    ],
  },

  "welcome-to-elderfield": {
    year: "2024",
    developer: "Elderfield Collective",
    genre: "تحقيق في بلدة غامضة • رعب نفسي • سردي",
    genre_en: "Narrative Horror • Psychological • Mystery",
    status: "مكتمل 100%",
    screenshots: [
      "/images/covers/elderfield.jpg",
    ],
    fileSize: "35 ميغابايت",
    patchType: "استبدال ملفات اللعبة والواجهة",
    steamUrl: "https://store.steampowered.com/app/3195440/",
    installSteps: [
      {
        step: 1,
        title: "تحميل الباتش",
        description: "حمّل الباتش المحدث وفك الضغط عنه.",
      },
      {
        step: 2,
        title: "نقل الملفات",
        description: "ضع ملفات الباتش في مجلد تثبيت اللعبة واستبدل عند المطالبة.",
      },
      {
        step: 3,
        title: "التشغيل",
        description: "شغل اللعبة واكتشف أسرار إلدر فيلد باللغة العربية.",
      },
    ],
  },
};

export function getGameExtra(slug: string): GameExtraDetail {
  if (GAME_EXTRAS[slug]) {
    return GAME_EXTRAS[slug];
  }

  // Sensible default for any newly added game
  return {
    year: "2024",
    developer: "مطور مستقل",
    genre: "ألعاب كمبيوتر • مغامرات",
    genre_en: "PC Games • Adventure",
    status: "مكتمل 100%",
    screenshots: [],
    fileSize: "25 ميغابايت",
    patchType: "حزمة استبدال ملفات اللعبة",
    installSteps: [
      {
        step: 1,
        title: "تحميل الباتش",
        description: "حمّل ملف الباتش المضغوط وفك الضغط عنه بواسطة WinRAR أو 7-Zip.",
      },
      {
        step: 2,
        title: "نقل الملفات",
        description: "انسخ محتويات الباتش وضعها داخل مجلد اللعبة الرئيسي أو شغل ملف التثبيت المرفق.",
      },
      {
        step: 3,
        title: "تشغيل اللعبة",
        description: "شغل اللعبة واستمتع بتجربة اللعب باللغة العربية.",
      },
    ],
    compatibilityNotes: "متوافق مع أحدث إصدارات اللعبة على نظام Windows (PC).",
  };
}
