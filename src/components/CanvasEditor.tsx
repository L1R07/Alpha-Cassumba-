import React, { forwardRef } from 'react';
import { PostDesignState } from '../types';
import { Quote, Sparkles, Building2, Phone, Globe, Instagram, ShieldCheck } from 'lucide-react';

interface CanvasEditorProps {
  design: PostDesignState;
  className?: string;
}

export const CanvasEditor = forwardRef<HTMLDivElement, CanvasEditorProps>(({ design }, ref) => {
  // Determine aspect ratio class / dimension styles
  const getAspectRatioStyle = () => {
    switch (design.aspectRatio) {
      case '1:1':
        return 'aspect-square max-w-[540px]';
      case '4:5':
        return 'aspect-[4/5] max-w-[480px]';
      case '9:16':
        return 'aspect-[9/16] max-w-[380px]';
      case '16:9':
        return 'aspect-[16/9] max-w-[620px]';
      case '2:3':
        return 'aspect-[2/3] max-w-[440px]';
      case '3:4':
        return 'aspect-[3/4] max-w-[460px]';
      default:
        return 'aspect-square max-w-[540px]';
    }
  };

  // Determine Background inline style
  const getBackgroundStyle = (): React.CSSProperties => {
    if (design.bgType === 'solid') {
      return { backgroundColor: design.bgColor1 };
    }
    if (design.bgType === 'gradient') {
      return {
        background: `linear-gradient(${design.bgAngle || 135}deg, ${design.bgColor1}, ${design.bgColor2})`,
      };
    }
    if (design.bgType === 'image' && design.bgImage) {
      return {
        backgroundImage: `url(${design.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: `brightness(${design.bgBrightness ?? 100}%) blur(${design.bgBlur ?? 0}px)`,
      };
    }
    return {
      background: `linear-gradient(135deg, ${design.bgColor1}, ${design.bgColor2})`,
    };
  };

  const fontFamilyCss = design.fontFamily ? `'${design.fontFamily}', sans-serif` : 'sans-serif';
  const authorFontFamilyCss = design.authorFontFamily ? `'${design.authorFontFamily}', sans-serif` : 'sans-serif';

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-6 select-none">
      <div
        ref={ref}
        id="postly-canvas-render"
        className={`relative w-full ${getAspectRatioStyle()} rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between border border-slate-800/60`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.1)',
        }}
      >
        {/* Background Layer */}
        <div
          className="absolute inset-0 z-0 transition-all duration-300 pointer-events-none"
          style={getBackgroundStyle()}
        />

        {/* Optional Background Overlay Tint for contrast */}
        {design.bgType === 'image' && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundColor: '#000000',
              opacity: (design.bgOverlayOpacity ?? 30) / 100,
            }}
          />
        )}

        {/* TOP CONTENT: Optional Header Badge or Quote Icon */}
        <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
          {design.showQuoteIcon ? (
            <div
              className={`p-2.5 rounded-xl transition-all ${
                design.quoteIconStyle === 'modern'
                  ? 'bg-white/10 backdrop-blur-md border border-white/10'
                  : ''
              }`}
            >
              <Quote
                className="w-8 h-8 opacity-90 transform -scale-x-100"
                style={{ color: design.quoteIconColor || '#f59e0b' }}
              />
            </div>
          ) : (
            <div />
          )}

          {/* Top Branding Badge if set to top-center / corner */}
          {design.branding?.enabled && design.branding.position === 'top-center' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{design.branding.brandName}</span>
            </div>
          )}
        </div>

        {/* CENTER CONTENT: Quote / Main Statement & Author */}
        <div className="relative z-10 px-6 sm:px-10 py-4 flex-1 flex flex-col justify-center items-center text-center">
          
          {/* Main Text Container */}
          <div
            className={`w-full max-w-full my-auto transition-all ${
              design.hasTextPillBg
                ? 'p-5 sm:p-6 rounded-2xl backdrop-blur-md'
                : ''
            }`}
            style={{
              backgroundColor: design.hasTextPillBg ? design.textPillBgColor || 'rgba(0,0,0,0.4)' : 'transparent',
            }}
          >
            <h2
              className="transition-all tracking-tight"
              style={{
                fontFamily: fontFamilyCss,
                fontSize: `${Math.max(18, design.fontSize || 32)}px`,
                color: design.fontColor || '#ffffff',
                textAlign: design.textAlign || 'center',
                letterSpacing: `${design.letterSpacing || 0}px`,
                lineHeight: design.lineHeight || 1.4,
                fontWeight: design.isBold ? 800 : 400,
                fontStyle: design.isItalic ? 'italic' : 'normal',
                textShadow: design.hasTextShadow ? '0 4px 18px rgba(0,0,0,0.6)' : 'none',
              }}
            >
              "{design.mainText}"
            </h2>

            {/* Author / Source Tag */}
            {design.authorText && (
              <div className="mt-5 flex items-center justify-center">
                {design.authorStyle === 'pill' ? (
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/15 border border-white/20"
                    style={{
                      fontFamily: authorFontFamilyCss,
                      color: design.authorColor || '#f59e0b',
                      fontSize: `${design.authorFontSize || 14}px`,
                    }}
                  >
                    {design.authorText}
                  </span>
                ) : (
                  <p
                    className="tracking-wide"
                    style={{
                      fontFamily: authorFontFamilyCss,
                      fontSize: `${design.authorFontSize || 16}px`,
                      color: design.authorColor || '#f59e0b',
                      fontWeight: 600,
                      textTransform: design.authorStyle === 'uppercase' ? 'uppercase' : 'none',
                    }}
                  >
                    {design.authorStyle === 'dash' && !design.authorText.startsWith('—') && '— '}
                    {design.authorText}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* BOTTOM CONTENT: Business Branding Watermark / Footer */}
        {design.branding?.enabled && (
          <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8">
            <div
              className={`w-full flex items-center justify-between text-xs text-white/90 ${
                design.branding.position === 'bottom-left'
                  ? 'flex-row'
                  : design.branding.position === 'bottom-right'
                  ? 'flex-row-reverse'
                  : 'flex-col gap-2 text-center'
              }`}
            >
              
              {/* Brand Name & Handle */}
              <div className="flex items-center gap-2">
                {design.branding.logoUrl ? (
                  <img
                    src={design.branding.logoUrl}
                    alt="Logo"
                    className="w-7 h-7 rounded-lg object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                    {design.branding.brandName ? design.branding.brandName.charAt(0).toUpperCase() : 'P'}
                  </div>
                )}
                <div>
                  <p className="font-bold tracking-wide text-white text-xs sm:text-sm">
                    {design.branding.brandName || 'Sua Marca Aqui'}
                  </p>
                  {design.branding.handle && (
                    <p className="text-[11px] text-slate-300/80 font-medium flex items-center gap-1">
                      <Instagram className="w-3 h-3 text-pink-400" />
                      <span>{design.branding.handle}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Tagline or Contact details */}
              <div className="flex items-center gap-3 text-[11px] text-slate-300/80">
                {design.branding.phone && (
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{design.branding.phone}</span>
                  </span>
                )}
                {design.branding.website && (
                  <span className="hidden sm:flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span>{design.branding.website}</span>
                  </span>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';
