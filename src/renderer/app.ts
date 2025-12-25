import { Game } from "./engine/Game";
import { Loop } from "./engine/Loop";
import { CanvasRenderer } from "./rendering/CanvasRenderer";
import { Scene } from "./engine/Scene";
import { InputSystem } from "./systems/InputSystem";

export class App {
    private game: Game;
    private renderer: CanvasRenderer;
    
    constructor(renderer: CanvasRenderer){
        this.renderer = renderer;
        this.setupCanvas();
        const loop = new Loop();
        this.game = new Game(loop);

        this.game.addSystem(new InputSystem());
    }

    private setupCanvas(): void {
        const canvas = this.renderer.getCanvas();
        // Configura o canvas para ocupar toda a tela
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    start(initialScene: Scene){
        console.log('App started');
        this.game.start(initialScene);
    }
}