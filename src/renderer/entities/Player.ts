import { Entity } from "./Entity";
import { PhysicsBody } from "../physics/PhysicsBody";
import { ActionInput } from "../input/ActionInput";
import { InputAction } from "../input/InputAction";
import { ColliderType } from "../physics/ColliderType";
import { SpriteSheet } from "../rendering/sprites/SpriteSheet";
import { AnimatedSprite } from "../rendering/sprites/AnimatedSprite";
import { Animation } from "../rendering/sprites/Animation";

export class Player extends Entity implements PhysicsBody {
    vx: number = 0;
    vy: number = 0;
    colliderType: ColliderType = ColliderType.SOLID;
    speed: number = 200; // pixels por segundo
    // input?: InputState;
    actions?: ActionInput;
    sprite?: AnimatedSprite;    

    private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down';

    constructor(x: number = 0, y: number = 0) {
        // Tamanho baseado no sprite (270x147 para grade 4x4), mas vamos usar um tamanho menor para colisão
        super(x, y, 50, 50);

        // Imagem é 1080x589 pixels em uma grade de 4x4 (4 colunas, 4 linhas)
        // Cada frame: 1080/4 = 270 pixels de largura, 589/4 ≈ 147 pixels de altura
        const sheet = new SpriteSheet('./assets/sprites/player-02.png', 270, 149);

        this.sprite = new AnimatedSprite(sheet, {
            idle_down: new Animation([
                {x: 2, y: 0},
            ], 500),
            idle_up: new Animation([
                {x: 0, y: 3},
            ], 500),
            idle_left: new Animation([
                {x: 2, y: 1},
            ], 500),
            idle_right: new Animation([
                {x: 0, y: 1},
            ], 500),
            walk_down: new Animation([
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 2, y: 0},
            ], 150),
            walk_right: new Animation([
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 0, y: 2},
                {x: 1, y: 2},
            ], 150),
            walk_left: new Animation([
                {x: 2, y: 1},
                {x: 3, y: 1},
                {x: 2, y: 2},
                {x: 3, y: 2},
            ], 150),
            walk_up: new Animation([
                {x: 0, y: 3},
                {x: 1, y: 3},
                {x: 2, y: 3},
                {x: 3, y: 3},
            ], 150),
        });

        // Inicia com animação idle_down
        this.sprite.play('idle_down');
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
        if (!this.actions) {
            this.vx = 0;
            this.vy = 0;
            // Quando parado, usa animação idle baseada na última direção
            if (this.sprite) {
                this.sprite.play(`idle_${this.lastDirection}`);
                this.sprite.update(delta);
            }
            return;
        }
    
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
    
        // Determina a direção baseada no movimento
        let animationName: string;
        if (magnitude > 0) {
            // Está se movendo
            if (Math.abs(moveY) > Math.abs(moveX)) {
                // Movimento vertical é dominante
                if (moveY < 0) {
                    animationName = 'walk_up';
                    this.lastDirection = 'up';
                } else {
                    animationName = 'walk_down';
                    this.lastDirection = 'down';
                }
            } else {
                // Movimento horizontal é dominante
                if (moveX < 0) {
                    animationName = 'walk_left';
                    this.lastDirection = 'left';
                } else {
                    animationName = 'walk_right';
                    this.lastDirection = 'right';
                }
            }
        } else {
            // Parado, usa animação idle baseada na última direção
            animationName = `idle_${this.lastDirection}`;
        }
    
        // Atualiza a animação do sprite
        if (this.sprite) {
            this.sprite.play(animationName);
            this.sprite.update(delta);
        }
    
        // Atualiza velocidade para o sistema de física detectar movimento
        this.vx = moveX * this.speed;
        this.vy = moveY * this.speed;
    
        // Atualiza posição baseada na velocidade
        this.x += this.vx * delta;
        this.y += this.vy * delta;
      }

    render(): void {
        const renderer = this.getRenderer();
        if (!renderer || !this.sprite) return;
        
        // Verifica se a imagem do sprite está carregada
        if (!this.sprite.sheet.image.complete) {
            // Fallback: desenha um retângulo enquanto a imagem carrega
            renderer.fillRect(this.x, this.y, this.width, this.height, '#ff0000');
            return;
        }
        
        // Obtém o contexto do canvas para renderizar o sprite
        const ctx = renderer.getContext();
        
        // Renderiza o sprite animado na posição do player
        // Ajusta a posição para centralizar o sprite (já que o sprite é maior que a área de colisão)
        const spriteX = this.x - (this.sprite.sheet.frameWidth - this.width) / 2;
        const spriteY = this.y - (this.sprite.sheet.frameHeight - this.height) / 2;
        
        this.sprite.draw(ctx, spriteX, spriteY);
    }

    onCollision?(other: Partial<PhysicsBody>): void {
        console.log('Player colidiu com outra entidade');
    }

    onTrigger?(other: Partial<PhysicsBody>): void {
        console.log('Player colidiu com outra entidade');
    }
}