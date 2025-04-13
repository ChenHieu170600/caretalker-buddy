
declare module 'lodash' {
  export interface DebouncedFunc<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;
    cancel(): void;
    flush(): ReturnType<T>;
    pending(): boolean;
  }
  
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      maxWait?: number;
      trailing?: boolean;
    }
  ): DebouncedFunc<T>;
  
  // Add other lodash functions as needed
  export function upperFirst(string?: string): string;
}
