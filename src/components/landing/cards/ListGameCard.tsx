import React from 'react';
import Image from 'next/image';
import { DetailButton } from '../buttons/DetailButton';

export interface ListGameCardProps {
  name: string;
  bgColor: string;
  textColor?: string;
  logoImage?: string;
  secondaryImage?: string;
  buttonLabel?: string;
  onClick?: () => void;
}

export const ListGameCard: React.FC<ListGameCardProps> = ({
  name,
  bgColor,
  logoImage,
  secondaryImage,
  buttonLabel = 'Detail',
  onClick,
}) => {
  const isPlayStation = name.toLowerCase().includes('playstation') || bgColor === '#2425B5';
  const isNintendo = name.toLowerCase().includes('nintendo') || bgColor === '#E71B24';
  const isLogitech = name.toLowerCase().includes('logitech') || bgColor === '#E0FE0A';

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
      className="group relative w-full max-w-[260px] sm:max-w-[285px] h-[360px] sm:h-[380px] rounded-[2.25rem] p-6 flex flex-col justify-between shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer select-none overflow-hidden"
    >
      {/* Center Image / Branding Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 overflow-hidden py-2">
        {secondaryImage ? (
          /* Dual Asset Layout (e.g. Logitech Wheel) */
          <>
            <div className="relative w-36 sm:w-44 h-36 sm:h-44 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={secondaryImage}
                alt={`${name} Wheel`}
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain drop-shadow-md"
              />
            </div>
            {logoImage && (
              <div className="relative w-full max-w-[180px] sm:max-w-[210px] h-16 sm:h-20 shrink-0 transition-transform duration-300">
                <Image
                  src={logoImage}
                  alt={`${name} Logo`}
                  fill
                  sizes="(max-width: 640px) 180px, 210px"
                  className="object-contain"
                />
              </div>
            )}
          </>
        ) : (
          /* Single Main Logo Layout (PlayStation, Nintendo, Logitech) */
          logoImage && (
            <div
              className={`relative shrink-0 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center ${
                isPlayStation
                  ? 'w-full max-w-[250px] sm:max-w-[285px] h-36 sm:h-44'
                  : isNintendo
                  ? 'w-full max-w-[250px] sm:max-w-[285px] h-32 sm:h-40'
                  : 'w-full max-w-[250px] sm:max-w-[285px] h-36 sm:h-44'
              }`}
            >
              <Image
                src={logoImage}
                alt={`${name} Logo`}
                fill
                priority
                sizes="(max-width: 640px) 285px, 320px"
                className={`object-contain ${
                  isPlayStation || isNintendo ? 'brightness-0 invert' : ''
                }`}
              />
            </div>
          )
        )}
      </div>

      {/* Bottom Right CTA Button */}
      <div className="shrink-0 w-full flex justify-end items-center pt-2 z-10">
        <DetailButton label={buttonLabel} textColor="text-white" />
      </div>
    </div>
  );
};
