import gamesData from "@/data/games.json";

export interface GameExtraDetail {
  year: string;
  developer: string;
  publisher?: string;
  knownAs?: string;
  genre: string;
  genre_en?: string;
  platforms: string;
  officialUrl?: string;
  status: string;
  trailerYoutubeId?: string;
  trailerUrl?: string;
  screenshots: string[];
  fileSize: string;
  patchType: string;
  steamUrl?: string;
  aboutGame?: string;
  highlights?: string[];
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
    developer: "No Code / Annapurna Interactive",
    publisher: "Konami",
    knownAs: "سايلنت هيل: سقوط البلدة",
    genre: "رعب نفسي • غموض • تحقيق",
    genre_en: "Psychological Horror • Mystery",
    platforms: "PC (Windows)",
    officialUrl: "https://store.steampowered.com/",
    status: "مكتمل 100%",
    trailerYoutubeId: "P-Y3o92x830",
    screenshots: [
      "/images/covers/silent-hill-townfall.jpg",
    ],
    fileSize: "18 ميغابايت",
    patchType: "استبدال ملفات Unreal Engine 5 (.pak)",
    steamUrl: "https://store.steampowered.com/",
    aboutGame: `بعد سنوات من الصمت، تعود سلسلة الرعب النفسي الأيقونية Silent Hill بجزء جديد مشوق بعنوان Townfall من تطوير الاستوديو البريطاني المبدع No Code (مبتكرو Stories Untold و Observation).
تدور الأحداث في بلدة ساحلية غامضة ومعزولة تحيط بها أسرار مظلمة ورسائل مشفرة عبر أجهزة بث صوتية قديمة، حيث يتعين على اللاعب كشف الحقيقة وراء الحوادث المريبة وسط أجواء رعب نفسي سينمائية تأخذ الأنفاس.`,
    highlights: [
      "تجربة رعب نفسي فريدة من تطوير استوديو No Code بالتعاون مع Konami",
      "قصة غامضة تدور في بلدة ساحلية مليئة بالأسرار والتسجيلات الصوتية المشفرة",
      "تعريب فصيح واحترافي لكافة الحوارات والرسائل والقوائم بنسبة 100%",
      "أجواء سينمائية مشدودة مع شاشات تفاعلية وأجهزة راديو قديمة",
    ],
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
    developer: "Remedy Entertainment",
    publisher: "505 Games",
    knownAs: "كنترول: صدى الاضطراب",
    genre: "أكشن • خوارق طبيعية • تصويب منظور ثالث",
    genre_en: "Action • Supernatural • Third-Person Shooter",
    platforms: "PC (Windows)",
    officialUrl: "https://store.steampowered.com/app/870780/Control_Ultimate_Edition/",
    status: "مكتمل 100%",
    trailerYoutubeId: "F74LLDhAh9w",
    screenshots: [
      "/images/covers/control-resonant.jpg",
    ],
    fileSize: "84 ميغابايت",
    patchType: "مثبت تلقائي + استبدال ملفات",
    steamUrl: "https://store.steampowered.com/app/870780/Control_Ultimate_Edition/",
    aboutGame: `بعد اجتياح قوة خفية وخارقة للعادة لمكتب التحكم الفيدرالي (FBC) في نيويورك، تتولى جيسي فادين منصب المديرة الجديدة في محاولة لاستعادة السيطرة وكشف الحقائق الغامضة عن ماضيها وأخيها المفقود.
استمتع بأسلوب لعب حركي استثنائي يجمع بين استخدام الأسلحة النارية القابلة للتحول والقدرات التخاطرية الخارقة في بيئة ديناميكية قابلة للتدمير بالكامل داخل مبنى The Oldest House الغامض.`,
    highlights: [
      "قدرات خارقة ممتعة تتيح لك رمي وتطويع البيئة المحيطة بسلاسة تامة",
      "عالم مفتوح غامض ومترابط داخل مبنى The Oldest House المتغير باستمرار",
      "تعريب دقيق لمصطلحات FBC والملفات السرية والتقارير والتسجيلات الصوتية",
      "رسومات استثنائية مع تقنيات تتبع الأشعة وتدمير بيئي متقدم",
    ],
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
    publisher: "Duckov Studios",
    knownAs: "الهروب من دوكوف",
    genre: "إطلاق نار وتكتيك • بقاء • منظور علوي",
    genre_en: "Tactical Shooter • Survival • Top-down",
    platforms: "PC (Windows)",
    officialUrl: "https://store.steampowered.com/",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/duckov-1.png",
      "/images/screenshots/duckov-2.png",
      "/images/screenshots/duckov-3.png",
    ],
    fileSize: "32 ميغابايت",
    patchType: "ملفات إضافية وتحديث الخطوط (BepInEx)",
    steamUrl: "https://store.steampowered.com/",
    aboutGame: `لعبة إطلاق نار وبقاء تكتيكية من منظور علوي مستوحاة من ألعاب الاستخراج مثل Escape from Tarkov ولكن بشخصيات بطية مرحة ومواجهات شرسة في مدينة دوكوف المحاصرة.
اجمع الغنائم والأسلحة، تفادى دوريات الأعداء، وخطط لمسار هروبك للعودة إلى المخبأ بسلام قبل نفاد المؤن أو الوقوع في كمين.`,
    highlights: [
      "أسلوب لعب استخراجي وتكتيكي حماسي مليء بالتحدي والذكاء",
      "ترسانة ضخمة من الأسلحة وتعديل العتاد المتنوع",
      "دعم كامل للخطوط العربية الصحيحة وتوجيه النصوص من اليمين لليسار (RTL)",
      "أجواء بقاء حابسة للأنفاس ومواجهات ذكية ضد الأعداء",
    ],
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
    publisher: "Indie Horror Collective",
    knownAs: "صانعة الفساتين",
    genre: "رعب نفسي • ألغاز • سرد قصصي",
    genre_en: "Psychological Horror • Puzzle • Narrative",
    platforms: "PC (Windows)",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/dressmaker-1.png",
      "/images/covers/dressmaker.png",
    ],
    fileSize: "14 ميغابايت",
    patchType: "استبدال ملفات اللعبة",
    aboutGame: `في متجر خياطة مهجور يعود للحقبة الفيكتورية، تستيقظ لتجد نفسك محاصراً بين دمى الخياطة والأقمشة الملطخة بأسرار مظلمة.
تعتمد اللعبة على حل الألغاز المعقدة واستكشاف المذكرات المتبقية لكشف مصير صانعة الفساتين التي اختفت في ظروف غامضة، مع أجواء رعب نفسي هادئة ومقلقة.`,
    highlights: [
      "قصة رعب نفسي غامضة مستوحاة من الحكايات الفيكتورية المظلمة",
      "ألغاز بيئية تتطلب الملاحظة الدقيقة والتفكير المنطقي",
      "تعريب فصيح يعكس الطابع الأدبي الكلاسيكي للقصة",
      "مؤثرات بصرية وصوتية تقشعر لها الأبدان",
    ],
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
  },

  "backseat": {
    year: "2024",
    developer: "Dystopian Games",
    publisher: "Dystopian Studio",
    knownAs: "باكسيت: رحلة المقعد الخلفي",
    genre: "غموض • قيادة وسفر • رعب نفسي",
    genre_en: "Mystery • Psychological Horror • Driving",
    platforms: "PC (Windows)",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/backseat-1.png",
      "/images/screenshots/backseat-2.png",
    ],
    fileSize: "16 ميغابايت",
    patchType: "باتش استبدال ملفات اللغات",
    aboutGame: `أنت تقود سيارتك ليلاً على طريق سريع موحش ومظلم، ولكنك سرعان ما تلاحظ شيئاً مرعباً في مرآة الرؤية الخلفية: شخص ما أو شيء ما يجلس في المقعد الخلفي!
رحلة نفسية مثيرة تتلاعب بأعصاب اللاعب عبر محادثات هاتفية متوترة وأحداث غريبة تجبرك على التركيز على الطريق مع مراقبة ما يحدث خلفك في نفس الوقت.`,
    highlights: [
      "تجربة قيادة مرعبة ومربكة في طرقات ليلية موحشة",
      "أحداث نفسية غير متوقعة وتغيرات صادمة في المقعد الخلفي",
      "حوارات معربة بعناية لتوصيل مشاعر التوتر والرهبة",
      "نهايات متعددة تعتمد على قراراتك وتعاملك مع المواقف",
    ],
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
    publisher: "Echo Games",
    knownAs: "إيكو ويفر: ناسجة الصدى",
    genre: "ألغاز ومنصات • خيال علمي • مغامرة",
    genre_en: "Puzzle Platformer • Sci-Fi",
    platforms: "PC (Windows)",
    status: "مكتمل 100%",
    screenshots: [
      "/images/screenshots/echoweaver-1.png",
      "/images/screenshots/echoweaver-2.png",
    ],
    fileSize: "22 ميغابايت",
    patchType: "استبدال ملفات الواجهة والنصوص",
    aboutGame: `في محطة فضائية مهجورة تتحدى قوانين الفيزياء، تتحكم في كائن يملك القدرة على نسج أصداء زمنية من أفعاله السابقة للتغلب على العقبات وحل الألغاز المعقدة.
لعبة منصات وألغاز ذكية تجمع بين التصميم المبتكر للمراحل والمؤثرات الصوتية المتناغمة مع حركة اللاعب.`,
    highlights: [
      "ميكانيكية تلاعب بالأصداء والزمن فريدة من نوعها لحل الألغاز",
      "تصميم مراحل ثنائي الأبعاد مبتكر يتطلب الدقة والتفكير المتأني",
      "ترجمة عربية متقونة لشاشات التعليمات والنصوص التقنية",
      "موسيقى تصويرية آسرة وبيئات خيال علمي ساحرة",
    ],
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

  "inside": {
    year: "2016",
    developer: "Playdead",
    publisher: "Playdead",
    knownAs: "إنسايد",
    genre: "ألغاز • منصات سينمائية • غموض ورعب هادئ",
    genre_en: "Puzzle-Platformer • Cinematic • Dystopian",
    platforms: "PC, PlayStation 4, Xbox One, Nintendo Switch",
    officialUrl: "https://store.steampowered.com/app/304430/INSIDE/",
    status: "مكتمل 100%",
    trailerYoutubeId: "yDm6PAgNohU",
    screenshots: [
      "/images/covers/inside.jpg",
    ],
    fileSize: "10 ميغابايت",
    patchType: "استبدال نصوص وقوائم اللعبة",
    steamUrl: "https://store.steampowered.com/app/304430/INSIDE/",
    aboutGame: `مطارد ووحيد، يجد صبي صغير نفسه مجروراً إلى قلب مشروع ديستوبي مظلم ومخيف.
تعد INSIDE واحدة من أعظم ألعاب المنصات والألغاز السينمائية في التاريخ، تتميز بسرد قصصي صامت ساحر وفيزياء حركة مبهرة وأجواء كئيبة غامضة تبقيك مشدوهاً حتى اللحظة الأخيرة.`,
    highlights: [
      "تحفة فنية سينمائية من مبتكري لعبة Limbo الأسطورية",
      "سرد قصصي صامت ومؤثر بدون حوارات يعتمد على البيئة والألغاز",
      "تعريب كامل للقوائم والواجهات والإعدادات",
      "فيزياء لعب دقيقة وأجواء كئيبة ومرعبة تخطف الأنفاس",
    ],
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
    developer: "ArtPlay",
    publisher: "505 Games",
    knownAs: "بلودستيند: طقس الليل",
    genre: "أكشن آر بي جي • مترويدفينيا • رعب قوطي",
    genre_en: "Action RPG • Metroidvania • Gothic Horror",
    platforms: "PC, PlayStation 4, Xbox One, Nintendo Switch",
    officialUrl: "https://store.steampowered.com/app/692850/Bloodstained_Ritual_of_the_Night/",
    status: "مكتمل 100%",
    trailerYoutubeId: "5k4F31Z0n00",
    screenshots: [
      "/images/covers/bloodstained.jpg",
    ],
    fileSize: "115 ميغابايت",
    patchType: "حزمة نصوص وخطوط مخصصة",
    steamUrl: "https://store.steampowered.com/app/692850/Bloodstained_Ritual_of_the_Night/",
    aboutGame: `الوريث الروحي الكلاسيكي لألعاب Castlevania الشهيرة من ابتكار كوجي إيغاراشي. تلعب بدور ميريام، فتاة يتيمة أصابتها لعنة خيميائي تؤدي ببطء إلى تحويل جسدها لبلورات صلبة.
قاتل عبر قلعة قوطية شاسعة موبوءة بالشياطين، واجمع البلورات والأسلحة والدروع لإنقاذ البشرية ونفسك في تجربة مترويدفينيا غنية بالأكشن.`,
    highlights: [
      "الوريث الروحي الكلاسيكي لسلسلة Castlevania بإشراف كوجي إيغاراشي",
      "استكشاف قلعة شاسعة ومئات القدرات والأسلحة والبلورات السحرية",
      "تعريب شامل لكافة الحوارات والمهام والقوائم والعتاد",
      "قتال زعماء أسطوري وموسيقى أوركسترالية قوطية ساحرة",
    ],
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

  "guacamelee-2": {
    year: "2018",
    developer: "DrinkBox Studios",
    publisher: "DrinkBox Studios",
    knownAs: "جواكاميلي! 2",
    genre: "مترويدفينيا • أكشن ومغامرات • قتال وكوميديا",
    genre_en: "Metroidvania • Action-Adventure • Brawler",
    platforms: "PC, PlayStation 4, Xbox One, Nintendo Switch",
    officialUrl: "https://store.steampowered.com/app/534500/Guacamelee_2/",
    status: "مكتمل 100%",
    trailerYoutubeId: "Z0oYyV_4v5k",
    screenshots: [
      "/images/covers/guacamelee-2.png",
    ],
    fileSize: "65 ميغابايت",
    patchType: "حزمة تعريب كاملة للخطوط والنصوص",
    steamUrl: "https://store.steampowered.com/app/534500/Guacamelee_2/",
    aboutGame: `يعود المصارع المكسيكي الأسطوري خوان أغواكاتي من التقاعد في مغامرة مترويدفينيا ملحمية ومرحة لإنقاذ الـ Mexiverse من خطر يهدد نسيج الزمان والمكان.
استمتع بنظام قتال عميق، تحولات دجاج بهلوانية، وألغاز منصات تتحدى مهاراتك مع دعم اللعب التعاوني حتى 4 لاعبين.`,
    highlights: [
      "قتال بيلاتشوريس وملاكمة مكسيكية مليئة بالكوميديا والحماس",
      "عالم حيوي ومشرق مستوحى من الفلكلور المكسيكي ويوم الموتى",
      "تعريب عربي ممتع للنكات والقفشات والمهارات الخاصة",
      "دعم اللعب التعاوني حتى 4 لاعبين على نفس الشاشة",
    ],
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
};

/**
 * Extracts and merges custom metadata stored in game.description_en or fallbacks to GAME_EXTRAS
 */
export function getGameExtra(slug: string, rawDescriptionEn?: string | null): GameExtraDetail {
  const fromJson = (gamesData as any[]).find((g) => g.slug === slug);

  const base: GameExtraDetail = fromJson
    ? {
        year: fromJson.year || "2024",
        developer: fromJson.developer || "مطور مستقل",
        publisher: fromJson.publisher || fromJson.developer || "ناشر مستقل",
        knownAs: fromJson.known_as || "",
        genre: fromJson.genre || "ألعاب كمبيوتر • مغامرات",
        genre_en: "PC Games • Adventure",
        platforms: fromJson.platforms || "PC (Windows)",
        officialUrl: fromJson.official_url || "",
        status: fromJson.status || "مكتمل 100%",
        trailerYoutubeId: fromJson.trailer_youtube_id || "",
        screenshots: fromJson.screenshots || [],
        fileSize: fromJson.file_size || "20 ميغابايت",
        patchType: "حزمة استبدال ملفات اللعبة",
        aboutGame: fromJson.about_game || "",
        highlights: fromJson.highlights || [
          "تعريب عربي كامل وشامل للنصوص والقوائم",
          "متوافق مع أحدث إصدارات اللعبة الرسمية",
          "خطوط عربية واضحة ومريحة للقراءة",
        ],
        installSteps: fromJson.install_steps || [
          {
            step: 1,
            title: "تحميل الباتش",
            description: "حمّل ملف الباتش وفك الضغط عنه بواسطة WinRAR أو 7-Zip.",
          },
          {
            step: 2,
            title: "نقل الملفات",
            description: "انقل ملفات التعريب إلى مجلد اللعبة الرئيسي.",
          },
          {
            step: 3,
            title: "تشغيل اللعبة",
            description: "شغل اللعبة واستمتع بالتجربة باللغة العربية.",
          },
        ],
        compatibilityNotes: "متوافق مع أحدث إصدارات اللعبة على نظام Windows (PC).",
      }
    : (GAME_EXTRAS[slug] || {
        year: "2024",
        developer: "مطور مستقل",
        publisher: "ناشر مستقل",
        knownAs: "",
        genre: "ألعاب كمبيوتر • مغامرات",
        genre_en: "PC Games • Adventure",
        platforms: "PC (Windows)",
        officialUrl: "",
        status: "مكتمل 100%",
        screenshots: [],
        fileSize: "25 ميغابايت",
        patchType: "حزمة استبدال ملفات اللعبة",
        highlights: [
          "تعريب عربي كامل وشامل للنصوص والقوائم",
          "متوافق مع أحدث إصدارات اللعبة الرسمية",
          "خطوط عربية واضحة ومريحة للقراءة",
        ],
        installSteps: [
          {
            step: 1,
            title: "تحميل الباتش",
            description: "حمّل ملف الباتش وفك الضغط عنه بواسطة WinRAR أو 7-Zip.",
          },
          {
            step: 2,
            title: "نقل الملفات",
            description: "انقل ملفات التعريب إلى مجلد اللعبة الرئيسي.",
          },
          {
            step: 3,
            title: "تشغيل اللعبة",
            description: "شغل اللعبة واستمتع بالتجربة باللغة العربية.",
          },
        ],
        compatibilityNotes: "متوافق مع أحدث إصدارات اللعبة على نظام Windows (PC).",
      });

  // If rawDescriptionEn contains JSON metadata saved from the admin panel, merge it!
  if (rawDescriptionEn && rawDescriptionEn.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(rawDescriptionEn.trim());
      return {
        ...base,
        year: parsed.year || base.year,
        developer: parsed.developer || base.developer,
        publisher: parsed.publisher || base.publisher,
        knownAs: parsed.knownAs || base.knownAs,
        genre: parsed.genre || base.genre,
        platforms: parsed.platforms || base.platforms,
        officialUrl: parsed.officialUrl || base.officialUrl,
        trailerYoutubeId: parsed.trailerYoutubeId || parsed.trailerUrl || base.trailerYoutubeId,
        screenshots: Array.isArray(parsed.screenshots) && parsed.screenshots.length > 0 ? parsed.screenshots : base.screenshots,
        fileSize: parsed.fileSize || base.fileSize,
        patchType: parsed.patchType || base.patchType,
        status: parsed.status || base.status,
        aboutGame: parsed.aboutGame || base.aboutGame,
        highlights: Array.isArray(parsed.highlights) && parsed.highlights.length > 0 ? parsed.highlights : base.highlights,
        installSteps: Array.isArray(parsed.installSteps) && parsed.installSteps.length > 0 ? parsed.installSteps : base.installSteps,
        compatibilityNotes: parsed.compatibilityNotes || base.compatibilityNotes,
      };
    } catch {
      // not valid json, fall back to base
    }
  }

  return base;
}
