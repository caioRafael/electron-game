import { Game } from "./engine/Game";
import { Loop } from "./engine/Loop";
import { CanvasRenderer } from "./rendering/CanvasRenderer";
import { Scene } from "./engine/Scene";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { Camera } from "./rendering/Camera";
import { CameraSystem } from "./systems/CameraSystem";

export class App {
    private game: Game;
    private renderer: CanvasRenderer;
    
    constructor(renderer: CanvasRenderer){
        this.renderer = renderer;
        this.setupCanvas();
        const loop = new Loop();
        this.game = new Game(loop);

        const camera = new Camera(
            renderer.getCanvas().width,
            renderer.getCanvas().height
        )
        
        this.game.addSystem(new InputSystem());
        this.game.addSystem(new CameraSystem(camera));
        this.game.addSystem(new PhysicsSystem());
        
        // Cria e configura o RenderSystem com o renderer
        const renderSystem = new RenderSystem(renderer, camera);
        this.game.addSystem(renderSystem);
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