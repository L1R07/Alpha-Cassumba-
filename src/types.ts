export type AspectRatioType = 
  | '1:1'    // Instagram Square (1080x1080)
  | '9:16'   // Stories / Reels / TikTok (1080x1920)
  | '4:5'    // Instagram Portrait (1080x1350)
  | '16:9'   // Twitter / YouTube Header / Facebook (1200x675)
  | '2:3'    // Pinterest Pin (1000x1500)
  | '3:4';   // Classic Poster (1200x1600)

export type BackgroundStyle = 'gradient' | 'solid' | 'image' | 'pattern' | 'mesh';

export type FontFamily = 
  | 'Plus Jakarta Sans' 
  | 'Playfair Display' 
  | 'Montserrat' 
  | 'Cinzel' 
  | 'Caveat' 
  | 'Cormorant Garamond' 
  | 'Poppins' 
  | 'Syne' 
  | 'Space Grotesk' 
  | 'Pacifico';

export interface BrandingProfile {
  enabled: boolean;
  brandName: string;
  tagline: string;
  handle: string;
  phone: string;
  website: string;
  logoUrl?: string;
  position: 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'badge-corner';
  style: 'minimal' | 'badge' | 'glass' | 'bold';
}

export interface CanvasOverlay {
  id: string;
  type: 'badge' | 'sticker' | 'quote-mark' | 'frame' | 'line';
  content: string;
  x: number; // percentage or relative
  y: number;
  size: number;
  color: string;
  opacity: number;
}

export interface PostDesignState {
  id: string;
  title: string;
  aspectRatio: AspectRatioType;
  bgType: BackgroundStyle;
  bgColor1: string;
  bgColor2: string;
  bgAngle: number;
  bgImage?: string;
  bgBlur: number;
  bgBrightness: number;
  bgOverlayOpacity: number;
  
  // Quote / Main Text
  mainText: string;
  fontFamily: FontFamily;
  fontSize: number; // in px
  fontColor: string;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number; // px
  lineHeight: number;
  isBold: boolean;
  isItalic: boolean;
  hasTextShadow: boolean;
  hasTextPillBg: boolean;
  textPillBgColor: string;

  // Author / Subtitle
  authorText: string;
  authorFontFamily: FontFamily;
  authorFontSize: number;
  authorColor: string;
  authorStyle: 'dash' | 'quote' | 'pill' | 'minimal' | 'uppercase';

  // Branding
  branding: BrandingProfile;

  // Additional elements
  showQuoteIcon: boolean;
  quoteIconStyle: 'classic' | 'modern' | 'minimal' | 'serif';
  quoteIconColor: string;

  overlays: CanvasOverlay[];
}

export interface QuoteCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  color: string;
}

export interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  previewGradient: string;
  design: Partial<PostDesignState>;
}

export interface GeneratedCaption {
  style: string;
  text: string;
  hashtags: string[];
}
