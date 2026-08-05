'use client';

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export default function ImageWithFallback({ src, alt, className, containerClassName, ...props }: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative w-full h-full bg-gray-100 overflow-hidden ${containerClassName || ''}`}>
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
      )}
      
      {/* Error Fallback View (Sạch sẽ, UI tốt) */}
      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400 z-10">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Không tải được ảnh</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}
