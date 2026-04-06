/// <reference types="vite/client" />

declare module 'figma:asset/*.png' {
  const src: string;
  export default src;
}

declare module 'figma:asset/*.jpg' {
  const src: string;
  export default src;
}

declare module 'figma:asset/*.svg' {
  const src: string;
  export default src;
}
