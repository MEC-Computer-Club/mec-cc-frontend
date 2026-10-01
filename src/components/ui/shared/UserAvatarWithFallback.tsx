"use client";
import React, { useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/api/gallery";

interface UserAvatarProps {
  initialImageUrl?: string | null;
  fullName: string;
  w?: number;
  h?: number;
  imagePosition?: string;
  className?: string;
}
const DEFAULT_AVATAR_URL = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL || "/default-avatar.png";

const UserAvatarWithFallback: React.FC<UserAvatarProps> = ({
  initialImageUrl,
  fullName,
  w = 36,
  h = 36,
  imagePosition = "50% 50%",
  className = "",
}) => {
  const getInitialSrc = () => {
    if (!initialImageUrl) return DEFAULT_AVATAR_URL;
    // Floor at 100px so even tiny avatars (36px sidebar icons) request at
    // least 200px from Cloudinary after 2× DPR is applied — sharp on all
    // screens. A 200px WebP at q_auto:good is only ~4-6KB.
    const displaySize = Math.max(w, h);
    const requestWidth = Math.max(displaySize, 100);
    return getOptimizedImageUrl(initialImageUrl, requestWidth);
  };

  const [imageSrc, setImageSrc] = useState(getInitialSrc);

  useEffect(() => {
    setImageSrc(getInitialSrc());
  }, [initialImageUrl]);

  const size = Math.max(w, h);
  const pos = imagePosition && imagePosition.trim() ? imagePosition.trim() : "50% 50%";

  return (
    // No border here — the border lives on the parent wrapper so there's no
    // double-border gap that causes the blank curve artifact in the top-left.
    <div
      className={`relative rounded-full overflow-hidden shrink-0 bg-surface-secondary flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        borderRadius: "9999px",
      }}
    >
      <img
        src={imageSrc}
        alt={`${fullName}'s Profile`}
        className="w-full h-full object-cover block"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          display: "block",
        }}
        onError={() => {
          if (imageSrc !== DEFAULT_AVATAR_URL) {
            setImageSrc(DEFAULT_AVATAR_URL);
          }
        }}
      />
    </div>
  );
};

export default UserAvatarWithFallback;
