import { Game } from "./Game";
import { CanvasRenderer } from "../rendering/CanvasRenderer";

export abstract class Scene {
    game?: Game;
    protected renderer?: CanvasRenderer;

    abstract onEnter(): void;
    abstract onExit(): void;
    abstract update(delta: number): void;
    abstract render(): void;
}