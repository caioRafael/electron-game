import { Animation } from "./Animation";
import { SpriteSheet } from "./SpriteSheet";

export class AnimatedSprite {
    private current?: Animation;

    constructor(
        public readonly sheet: SpriteSheet,
        private animations: Record<string, Animation>,
    ){}

    play(name: string): void {
        const animation = this.animations[name];
        if(!animation) {
            console.warn(`Animation "${name}" not found`);
            return;
        }
        
        // Se já está tocando a mesma animação, não faz nada
        if(this.current === animation) return;

        // Reseta a animação anterior se existir
        this.current?.reset();
        
        // Define a nova animação atual e reseta ela
        this.current = animation;
        this.current.reset();
    }

    update(delta: number): void {
        this.current?.update(delta);
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        if(!this.current) return;
        
        // Verifica se a imagem está carregada antes de tentar renderizar
        if(!this.sheet.image.complete) return;

        const frame = this.current.frame;

        ctx.drawImage(
            this.sheet.image,
            frame.x * this.sheet.frameWidth,
            frame.y * this.sheet.frameHeight,
            this.sheet.frameWidth,
            this.sheet.frameHeight,
            x, 
            y,
            this.sheet.frameWidth,
            this.sheet.frameHeight
        )
    }
}