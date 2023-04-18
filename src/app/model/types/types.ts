type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type TRANSPARENT = 'transparent'

export type Color = RGB | RGBA | HEX | TRANSPARENT;
