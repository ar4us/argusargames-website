import {
  ShieldCheck,
  Gamepad2,
  CloudDownload,
  Wrench,
  BookOpen,
  Users,
} from "lucide-react";

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "تعريب احترافي",
    description: "ترجمة دقيقة وطبيعية خالية من الأخطاء",
  },
  {
    icon: Gamepad2,
    title: "مجموعة كبيرة من الألعاب",
    description: "ألعاب متنوعة ومحدثة باستمرار لأحدث العناوين",
  },
  {
    icon: CloudDownload,
    title: "تحميل مباشر",
    description: "روابط سريعة وآمنة بدون إعلانات مزعجة",
  },
  {
    icon: Wrench,
    title: "أدوات مفيدة",
    description: "أدوات ومساعدات لتسهيل عملية التعريب",
  },
  {
    icon: BookOpen,
    title: "شروحات مفصلة",
    description: "دليل التثبيت والتشغيل خطوة بخطوة",
  },
  {
    icon: Users,
    title: "مجتمع داعم",
    description: "مساعدة فورية ونقاشات بين اللاعبين والمترجمين",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <div
            key={idx}
            className="group relative flex flex-col justify-between p-4 rounded-xl border border-[#142e1a] bg-[#061009]/80 backdrop-blur-md transition-all duration-300 hover:border-[#00ff66]/50 hover:bg-[#0a1e10] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00ff66]/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#00ff66]/20">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold text-white group-hover:text-[#00ff66] transition-colors leading-snug">
                {feature.title}
              </h4>
              <p className="mt-1 text-[11px] text-[#789d84] leading-relaxed line-clamp-2">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
