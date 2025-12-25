export interface System {
    onInit?(): void;
    onUpdate(delta: number): void;
    onDestroy?(): void;
  }