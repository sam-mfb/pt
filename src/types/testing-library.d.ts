// Add proper types for Testing Library
declare module '@testing-library/react' {
  export function render(component: React.ReactElement): any;
  export const screen: any;
  export function waitFor(callback: () => void | Promise<void>, options?: any): Promise<void>;
  export function within(element: HTMLElement): any;
  export const fireEvent: {
    click: (element: HTMLElement | Document | Node | Element | Window | null) => boolean;
    change: (element: HTMLElement | Document | Node | Element | Window | null, options: any) => boolean;
    submit: (element: HTMLElement | Document | Node | Element | Window | null) => boolean;
  };
}

declare module '@testing-library/jest-dom' {
  // Export needed to make import work
}