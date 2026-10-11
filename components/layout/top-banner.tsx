import Image from "next/image";

export function TopCyberBanner() {
  return (
    <div className="relative w-full overflow-hidden border-b border-[#132d19] bg-[#020503]">
      <div className="relative w-full aspect-[1983/260] max-h-[140px] sm:max-h-[180px] lg:max-h-[220px]">
        <Image
          src="/images/branding/top-header-banner.png"
          alt="ArgusOs Gaming Characters & 3D Logo Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020503]/50 pointer-events-none" />
      </div>
    </div>
  );
}
