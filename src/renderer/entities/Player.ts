import { Entity } from "./Entity";
import { InputState } from "../input/InputState";
import { PhysicsBody } from "../physics/PhysicsBody";
import { ActionInput } from "../input/ActionInput";
import { InputAction } from "../input/InputAction";

export class Player extends Entity implements PhysicsBody {
    vx: number = 0;
    vy: number = 0;
    solid: boolean = true;
    speed: number = 200; // pixels por segundo
    // input?: InputState;
    actions?: ActionInput;

    constructor(x: number = 0, y: number = 0) {
        super(x, y, 50, 50);
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
        if (!this.actions) return;
    
        let moveX = 0;
        let moveY = 0;
    
        if (this.actions.isHeld(InputAction.MOVE_UP)) moveY -= 1;
        if (this.actions.isHeld(InputAction.MOVE_DOWN)) moveY += 1;
        if (this.actions.isHeld(InputAction.MOVE_LEFT)) moveX -= 1;
        if (this.actions.isHeld(InputAction.MOVE_RIGHT)) moveX += 1;
    
        const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
        if (magnitude > 0) {
          moveX /= magnitude;
          moveY /= magnitude;
        }
    
        this.x += moveX * this.speed * delta;
        this.y += moveY * this.speed * delta;
      }

    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        
        // Desenha o player na posição atual usando width e height da Entity
        renderer.fillRect(this.x, this.y, this.width, this.height, '#ff0000');
    }
}