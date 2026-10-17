import React from "react";
import { cn } from "@/lib/utils";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
}

export function Image({ src, alt = "", fill, className, ...props }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn(fill ? "absolute inset-0 h-full w-full object-cover" : "", className)}
      {...props}
    />
  );
}

export default Image;
