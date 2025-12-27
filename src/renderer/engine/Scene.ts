import { Game, GameStatus } from "./Game";
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

    /**
     * Verifica se o jogo está em um estado específico
     */
    protected isStatus(status: GameStatus): boolean {
        return this.game?.getStatus() === status;
    }

    /**
     * Verifica se o jogo está pausado
     */
    protected isPaused(): boolean {
        return this.isStatus(GameStatus.PAUSED);
    }

    /**
     * Verifica se o jogo está em gameplay
     */
    protected isPlaying(): boolean {
        return this.isStatus(GameStatus.PLAYING);
    }

    /**
     * Verifica se está no menu
     */
    protected isMenu(): boolean {
        return this.isStatus(GameStatus.MENU);
    }

    abstract onEnter(): void;
    abstract onExit(): void;
    abstract update(delta: number): void;
    abstract render(): void;
}