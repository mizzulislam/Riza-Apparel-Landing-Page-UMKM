export type MotifTemplateId = 
  | 'ende-zawo' 
  | 'ende-diamond' 
  | 'flores-waves' 
  | 'flores-wave' 
  | 'kelimutu-crater' 
  | 'modern-stripes' 
  | 'athletic-minimal' 
  | 'abstract-geo' 
  | 'camo-sport' 
  | 'sash-diagonal' 
  | 'gradient-fade' 
  | 'halftone-dots' 
  | 'solid-clean'
  | 'gradient-slash'
  | 'diagonal-blaze'
  | 'hex-grid'
  | 'camo-military'
  | 'cross-hoops'
  | 'kelimutu-abstract'
  | 'chevron-arrow'
  | 'solid-minimalist'
  | 'custom-upload'
  | (string & {});

export type CollarStyleId = 'v-neck' | 'o-neck' | 'polo' | 'stand-up' | 'rib-overlap';
export type CollarStyle = CollarStyleId;
export type JerseyPatternTemplate = MotifTemplateId | string;
export type JerseySize = string;
export type JerseyLayer = DesignLayer;

export interface TeamSizeBreakdownItem {
  size: string;
  count: number;
}

export type ViewAngleId = 'front' | 'back' | 'sleeve-left' | 'sleeve-right';

export type StudioModeId = '2d' | '3d';

export type SponsorPlacement = 'chest' | 'chest-center' | 'left-chest' | 'right-chest' | 'sleeve' | 'upper-back' | 'none';

export type LayerKey = 'collar' | 'typography' | 'sponsor' | 'motif' | 'base';

export interface DesignLayer {
  id: LayerKey;
  label: string;
  visible: boolean;
}

export type InspectorElementId = 'typography' | 'sponsor' | 'motif' | 'all';

export type TextAlignment = 'left' | 'center' | 'right';

export interface ElementPositionConfig {
  x?: number;
  y?: number;
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
  opacity?: number; // 0 to 100
  scale?: number;
  alignment?: TextAlignment;
}

export interface CustomFontItem {
  name: string;
  url?: string;
  isLocal?: boolean;
}

export interface DesignColorConfig {
  hex: string;
  secondaryHex?: string;
  accentHex?: string;
}

export interface DesignConfig {
  baseColor: string | DesignColorConfig;
  secondaryColorHex?: string;
  secondaryColor?: string;
  accentColorHex?: string;
  accentColor?: string;
  collarColor?: string;
  nameColor?: string;
  numberColor?: string;
  numberStrokeColor?: string;
  sponsorColor?: string;
  
  motif?: string;
  motifTemplate?: MotifTemplateId;
  collar?: CollarStyleId;
  collarStyle?: CollarStyleId;
  
  playerName?: string;
  playerNumber?: string;
  fontFamily?: string;
  nameFontSize?: number;
  numberFontSize?: number;
  fontWeight?: 'normal' | 'bold' | '800' | '900';
  isItalic?: boolean;
  hasTextOutline?: boolean;

  // Typography Extensions
  textAlignment?: TextAlignment;
  letterSpacing?: number;
  isUnderline?: boolean;
  textTransform?: 'uppercase' | 'capitalize' | 'none';
  strokeWidth?: number;
  strokeColor?: string;

  teamName?: string;
  sponsorLogoText?: string;
  sponsorText?: string;
  sponsorLogoUrl?: string;
  sponsorLogoPosition?: SponsorPlacement;
  sponsorScale?: number;

  customPatternUrl?: string;
  customPatternScale?: number;
  referenceImageUrl?: string;
  referenceNote?: string;

  // Element Position & Layout
  namePosition?: ElementPositionConfig;
  numberPosition?: ElementPositionConfig;
  sponsorPosition?: ElementPositionConfig;
  customMotifPosition?: ElementPositionConfig;
  elementOpacity?: number;
  isGrouped?: boolean;

  // Sizing
  selectedSize?: string;
  sizeBreakdown?: Record<string, number>;
  teamSizeBreakdown?: TeamSizeBreakdownItem[];

  // Custom user uploaded fonts
  customFonts?: CustomFontItem[];

  layers?: DesignLayer[];

  selectedAngle?: ViewAngleId;
  viewSide?: ViewAngleId;
  rotation3D?: number;
  mode?: StudioModeId;
  zoomLevel?: number;
}

export interface DesignState {
  mode: StudioModeId;
  viewSide: ViewAngleId;
  baseColor: string;
  motifTemplate: MotifTemplateId;
  motif?: MotifTemplateId;
  secondaryColor: string;
  accentColor: string;
  collarColor?: string;
  nameColor?: string;
  numberColor?: string;
  numberStrokeColor?: string;
  sponsorColor?: string;
  
  collarStyle: CollarStyleId;
  
  // Typography
  playerName: string;
  playerNumber: string;
  fontFamily?: string;
  nameFontSize?: number;
  numberFontSize?: number;
  fontWeight?: 'normal' | 'bold' | '800' | '900';
  isItalic?: boolean;
  hasTextOutline?: boolean;

  // Typography Extensions
  textAlignment?: TextAlignment;
  letterSpacing?: number;
  isUnderline?: boolean;
  textTransform?: 'uppercase' | 'capitalize' | 'none';
  strokeWidth?: number;
  strokeColor?: string;

  // Sponsor & Logos
  sponsorText: string;
  sponsorLogoUrl?: string;
  sponsorLogoPosition?: SponsorPlacement;
  sponsorScale?: number;

  // Custom Motif / Patterns / Reference Media
  customPatternUrl?: string;
  customPatternScale?: number;
  referenceImageUrl?: string;
  referenceNote?: string;

  // Element Position & Inspector
  namePosition?: ElementPositionConfig;
  numberPosition?: ElementPositionConfig;
  sponsorPosition?: ElementPositionConfig;
  customMotifPosition?: ElementPositionConfig;
  elementOpacity?: number;
  isGrouped?: boolean;
  activeInspectorElement?: InspectorElementId;

  // Sizing Breakdown
  selectedSize?: string;
  jerseySize?: string;
  sizeBreakdown?: Record<string, number>;
  teamSizeBreakdown?: TeamSizeBreakdownItem[];

  // Custom fonts uploaded
  customFonts?: CustomFontItem[];

  // Layer Ordering & Visibility
  layers?: DesignLayer[];

  quantity: number;
  zoomLevel: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: 'team' | 'community' | 'casual';
  startingPrice: number;
  promoBadge?: string;
  description: string;
  features: string[];
  fabricSpecs: string;
  leadTimeDays: number;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  options?: { label: string; action: string }[];
  isEscalation?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  rating: number;
  avatarUrl?: string; // Optional for graceful degradation
  verifiedProduct: string;
}
