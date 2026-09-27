import { clamp, inv, mix, smooth } from '../core/draw';

export const P = {
  paper: '#F4F1EA',
  paper2: '#E9E4D8',
  ink: '#0E0F11',
  ink2: '#17191D',
  red: '#DD1100',
  redHot: '#FF3B1F',
  grey: '#8B877F',
  greyDark: '#5A5852',
  bone: '#EDE9E0',
};

/** 0 = paper world, 1 = ink world. The flip happens across the breakdown into the WL drop, and back for the outro. */
export function darkness(bar: number) {
  if (bar < 35) return 0;
  if (bar < 37) return smooth(inv(35.5, 37, bar)) * 0.85 + (bar >= 36.95 ? 0.15 : 0);
  if (bar < 68) return 1;
  return 1 - smooth(inv(68.5, 70, bar));
}
export const ground = (bar: number) => mix(P.paper, P.ink, darkness(bar));
export const fg = (bar: number) => mix(P.ink, P.bone, darkness(bar));
export const fgSoft = (bar: number) => mix('#6E6A62', '#8E8B84', darkness(bar));
export { clamp };
