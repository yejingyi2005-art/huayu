import { useState, useEffect } from "react";
import { getPhoto } from "../lib/services/photo-store";

interface PhotoImgProps {
  photoId: string;
  alt?: string;
  className?: string;
}

export function PhotoImg({ photoId, alt = "", className = "" }: PhotoImgProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPhoto(photoId).then((url) => {
      if (!cancelled && url) setSrc(url);
    });
    return () => { cancelled = true; };
  }, [photoId]);

  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}
