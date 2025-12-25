import { App } from "./app";
import { CanvasRenderer } from "./rendering/CanvasRenderer";
import { MainMenuScene } from "./scenes/MainMenuScene";

window.addEventListener('DOMContentLoaded', () => {

    const game = document.getElementById('game') as HTMLCanvasElement;
    if (!game) {
        console.error('Canvas element not found!');
        return;
    }

    const renderer = new CanvasRenderer(game);
    const app = new App(renderer);

    app.start(new MainMenuScene(renderer));
    
});