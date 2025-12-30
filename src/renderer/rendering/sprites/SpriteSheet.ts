export class SpriteSheet {
    image: HTMLImageElement;

    constructor(
        imagePath: string, 
        public readonly frameWidth: number, 
        public readonly frameHeight: number
    ) {
        this.image = new Image();
        this.image.src = imagePath;
    }
}