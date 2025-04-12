// Add TypeScript declarations for test utilities
declare namespace jest {
  interface Matchers<R> {
    toHaveLength(expected: number): R;
    toHaveBeenCalled(): R;
    toHaveBeenCalledWith(...args: any[]): R;
    toBeInTheDocument(): R;
    toHaveTextContent(text: string): R;
    toBeNull(): R;
    toBeUndefined(): R;
    toBeDefined(): R;
    toBeInstanceOf(expected: any): R;
    toContain(expected: any): R;
    toEqual(expected: any): R;
    toBe(expected: any): R;
    toHaveAttribute(attr: string, value?: any): R;
  }
}

// Make sure TypeScript recognizes the fireEvent object properly
declare module '@testing-library/react' {
  export const fireEvent: {
    click: (element: HTMLElement | Document | Element | Window) => boolean;
    change: (element: HTMLElement | Document | Element | Window, options: any) => boolean;
    submit: (element: HTMLElement | Document | Element | Window) => boolean;
  };
}

// Add Redux specific types for tests
declare module 'redux' {
  export interface Store<S = any, A extends Action = AnyAction> {
    getState(): S;
    dispatch: Dispatch<A>;
    subscribe(listener: () => void): Unsubscribe;
    replaceReducer(nextReducer: Reducer<S, A>): void;
  }
}