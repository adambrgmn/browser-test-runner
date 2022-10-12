declare module 'browser-test-runner' {
  export function it(title: string, callback: () => void | Promise<void>): void;
  export function before(callback: () => void | Promise<void>): void;
  export function beforeEach(callback: () => void | Promise<void>): void;
  export function afterEach(callback: () => void | Promise<void>): void;
  export function afterEach(callback: () => void | Promise<void>): void;
}
