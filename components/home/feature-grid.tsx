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
    description: "ترجمة دقيقة وطبيعية",
  },
  {
    icon: Gamepad2,
    title: "مجموعة كبيرة من الألعاب",
    description: "ألعاب متنوعة ومحدثة باستمرار",
  },
  {
    icon: CloudDownload,
    title: "تحميل مباشر",
    description: "روابط سريعة وآمنة",
  },
  {
    icon: Wrench,
    title: "أدوات مفيدة",
    description: "لتسهيل عملية التعريب",
  },
  {
    icon: BookOpen,
    title: "شروحات مفصلة",
    description: "دليل التثبيت خطوة بخطوة",
  },
  {
    icon: Users,
    title: "مجتمع داعم",
    description: "مساعدة ونقاشات",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <div
            key={idx}
            className="group relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-[#142e1a] bg-[#050e08]/90 backdrop-blur-md transition-all duration-300 hover:border-[#00ff66]/50 hover:bg-[#091b10] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#00ff66]/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/25 text-[#00ff66] transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#00ff66]/20">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00ff66] transition-colors leading-snug truncate">
                {feature.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#739980] leading-tight truncate mt-0.5">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
