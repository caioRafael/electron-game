import { Game } from "./Game";

export interface System {
    game?: Game;
    onInit?(): void;
    onUpdate(delta: number): void;
    onDestroy?(): void;
  }