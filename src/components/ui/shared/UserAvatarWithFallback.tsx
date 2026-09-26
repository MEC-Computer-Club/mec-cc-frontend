"use client";
import React, { useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/data/gallery";

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
    return getOptimizedImageUrl(initialImageUrl, 160);
  };

  const [imageSrc, setImageSrc] = useState(getInitialSrc);

  useEffect(() => {
    setImageSrc(getInitialSrc());
  }, [initialImageUrl]);

  const size = Math.max(w, h);
  const pos = imagePosition && imagePosition.trim() ? imagePosition.trim() : "50% 50%";

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border border-border-default bg-surface-secondary flex items-center justify-center ${className}`}
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
