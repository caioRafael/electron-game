export interface Scene {
    game?: import("./Game").Game;
    onEnter(): void;
    onExit(): void;
    update(delta: number): void;
    render(): void;
  }