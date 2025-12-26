import { Game } from "./Game";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { RenderSystem } from "../systems/RenderSystem";

export abstract class Scene {
    game?: Game;

    /**
     * Obtém o CanvasRenderer através do RenderSystem
     */
    protected getRenderer(): CanvasRenderer | undefined {
        const renderSystem = this.game?.getSystems(RenderSystem);
        return renderSystem?.getRenderer();
    }

    abstract onEnter(): void;
    abstract onExit(): void;
    abstract update(delta: number): void;
    abstract render(): void;
}