import { Scene } from "../engine/Scene";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { InputSystem } from "../systems/InputSystem";

export class Level01Scene extends Scene {
    private playerX: number = 0;
    private playerY: number = 0;
    private playerSize: number = 100;
    private playerSpeed: number = 200; // pixels por segundo

    constructor(renderer: CanvasRenderer){
        super();
        this.renderer = renderer;
    }

    /**
     * Chamado quando a cena entra em execução
     */
    onEnter(): void {
        console.log('Level01Scene: onEnter');
        // Inicializa o player no centro da tela
        if (this.renderer) {
            const canvas = this.renderer.getCanvas();
            this.playerX = canvas.width / 2 - this.playerSize / 2;
            this.playerY = canvas.height / 2 - this.playerSize / 2;
        }
    }

    /**
     * Chamado quando a cena é removida
     */
    onExit(): void {
        console.log('Level01Scene: onExit');
    }

    /**
     * Atualização lógica (inputs, animações, timers)
     */
    update(delta: number): void {
        // Lógica de atualização do nível
        const inputSystem = this.game?.getSystems(InputSystem);
        const input = inputSystem?.getState();

        if(!input) return

        // Usa isHeld para detectar teclas mantidas pressionadas
        const wPressed = input.isHeld('w') || input.isPressed('w');
        const aPressed = input.isHeld('a') || input.isPressed('a');
        const sPressed = input.isHeld('s') || input.isPressed('s');
        const dPressed = input.isHeld('d') || input.isPressed('d');

        // Calcula o vetor de direção do movimento
        let moveX = 0;
        let moveY = 0;

        if(wPressed) moveY -= 1;
        if(sPressed) moveY += 1;
        if(aPressed) moveX -= 1;
        if(dPressed) moveX += 1;

        // Normaliza o vetor para manter velocidade consistente em diagonais
        const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
        if (magnitude > 0) {
            moveX /= magnitude;
            moveY /= magnitude;
        }

        // Aplica o movimento baseado no delta time
        const moveDistance = this.playerSpeed * delta;
        this.playerX += moveX * moveDistance;
        this.playerY += moveY * moveDistance;
    }

    /**
     * Renderização gráfica
     */
    render(): void {
        if (!this.renderer) return;
        this.renderer.clear('#1e1e1e'); // Limpa com cor de fundo
        
        // Desenha o player na posição atual
        this.renderer.fillRect(this.playerX, this.playerY, this.playerSize, this.playerSize, '#ff0000');
    }
}

