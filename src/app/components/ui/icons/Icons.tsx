// ─── CTRL Icon System ─────────────────────────────────────────────────────────
// Single source of truth for all app icons.
// All icons are imported from SVG files in this folder.
//
// USAGE:
//   import { IconBack, IconSearch } from '../ui/icons/Icons';
//   <IconBack />
//   <IconSearch size={24} color="#FF0000" />
//
// ADDING A NEW ICON:
//   1. Export SVG from Figma → drop into this folder
//   2. Add an import line below
//   3. Add a component following the same pattern
// ─────────────────────────────────────────────────────────────────────────────

import iconBackSrc    from './icon-back.svg';
import iconSearchSrc  from './icon-search.svg';
import iconProfileSrc from './icon-profile.svg';
import iconStarSrc       from './icon-star.svg';
import iconStarFilledSrc from './icon-star-filled.svg';
import iconShareSrc   from './icon-share.svg';
import iconPlusSrc    from './icon-plus.svg';
import iconAlertSrc   from './icon-alert.svg';
import iconInfoSrc    from './icon-info.svg';

// ─── Shared prop type ─────────────────────────────────────────────────────────

interface IconProps {
  size?: number;
  color?: string;       // tint via CSS filter — see note below
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

// NOTE on color:
// SVG files imported as <img> can't be tinted with a fill prop.
// Two options:
//   A) Design all icons in Figma as white (#F1F1F1) — works for 95% of cases
//   B) Pass a CSS filter string via the `style` prop for special tints
// Most CTRL icons are always white so this is fine.
// If you need a colored icon (e.g. star filled yellow), pass:
//   <IconStar style={{ filter: 'brightness(0) saturate(100%) invert(83%) sepia(67%) ...' }} />
// Or keep a separate SVG variant in Figma (e.g. icon-star-filled.svg).

// ─── Navigation / Header icons (32×32 default) ───────────────────────────────

export function IconBack({ size = 32, style, className, onClick }: IconProps) {
  return (
    <img
      src={iconBackSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, cursor: onClick ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={onClick}
    />
  );
}

export function IconSearch({ size = 32, style, className, onClick }: IconProps) {
  return (
    <img
      src={iconSearchSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, cursor: onClick ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={onClick}
    />
  );
}

export function IconProfile({ size = 32, style, className, onClick }: IconProps) {
  return (
    <img
      src={iconProfileSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, cursor: onClick ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={onClick}
    />
  );
}

// ─── Action icons (24×24 default) ────────────────────────────────────────────

export function IconStar({ size = 24, style, className, onClick }: IconProps) {
  return (
    <img
      src={iconStarSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, opacity: 0.6, cursor: onClick ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={onClick}
    />
  );
}

// Filled/saved state — yellow star from Figma
export function IconStarFilled({ size = 24, style, className, onClick }: IconProps) {
  return (
    <img
      src={iconStarFilledSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, cursor: onClick ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={onClick}
    />
  );
}

export function IconShare({ size = 24, style, className, onClick }: IconProps) {
  return (
    <img
      src={iconShareSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, cursor: onClick ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={onClick}
    />
  );
}

export function IconPlus({ size = 24, style, className, onClick }: IconProps) {
  return (
    <img
      src={iconPlusSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, cursor: onClick ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={onClick}
    />
  );
}

// ─── Status icons (18×18 default) ────────────────────────────────────────────

export function IconAlert({ size = 18, style, className }: IconProps) {
  return (
    <img
      src={iconAlertSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
    />
  );
}

export function IconInfo({ size = 18, style, className }: IconProps) {
  return (
    <img
      src={iconInfoSrc}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
    />
  );
}
