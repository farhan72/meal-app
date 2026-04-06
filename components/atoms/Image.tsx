import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageProps extends NextImageProps {
  wrapperClassName?: string;
}

export function Image({ wrapperClassName, className, alt, ...props }: ImageProps) {
  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      <NextImage
        className={cn("transition-opacity duration-300", className)}
        alt={alt}
        {...props}
      />
    </div>
  );
}
