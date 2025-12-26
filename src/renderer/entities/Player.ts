import { Entity } from "./Entity";
import { InputState } from "../input/InputState";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { PhysicsBody } from "../physics/PhysicsBody";

export class Player extends Entity implements PhysicsBody {
    vx: number = 0;
    vy: number = 0;
    solid: boolean = true;
    speed: number = 200; // pixels por segundo
    input?: InputState;
    private renderer: CanvasRenderer;

    constructor(renderer: CanvasRenderer, x: number = 0, y: number = 0) {
        super(x, y, 50, 50);
        this.renderer = renderer;
    }

    /**
     * Getter para facilitar o acesso ao tamanho (já que width e height são iguais)
     */
    get size(): number {
        return this.width;
    }

    /**
     * Setter para facilitar a definição do tamanho (define width e height)
     */
    set size(value: number) {
        this.width = value;
        this.height = value;
    }

    update(delta: number): void {
        if (!this.input) return;

        // Usa isHeld para detectar teclas mantidas pressionadas
        const wPressed = this.input.isHeld('w') || this.input.isPressed('w');
        const aPressed = this.input.isHeld('a') || this.input.isPressed('a');
        const sPressed = this.input.isHeld('s') || this.input.isPressed('s');
        const dPressed = this.input.isHeld('d') || this.input.isPressed('d');

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
        const moveDistance = this.speed * delta;
        this.x += moveX * moveDistance;
        this.y += moveY * moveDistance;
    }

    render(): void {
        // Desenha o player na posição atual usando width e height da Entity
        this.renderer.fillRect(this.x, this.y, this.width, this.height, '#ff0000');
    }
}