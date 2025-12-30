export type Frame = {
    x: number;
    y: number;
}

export class Animation {
    private elapsed = 0;
    private currentFrame = 0;

    constructor(
        private frames: Frame[],
        private frameDuration: number,
        private loop: boolean = true,
    ){}


    update(delta: number): void {
        // Delta vem em segundos, converte para milissegundos
        this.elapsed += delta * 1000;

        if(this.elapsed >= this.frameDuration){
            this.elapsed = 0;
            this.currentFrame++;

            if(this.currentFrame >= this.frames.length){
                this.currentFrame = this.loop ? 0 : this.frames.length - 1;
            }
        }
    }

    get frame(): Frame {
        return this.frames[this.currentFrame];
    }

    reset(): void {
        this.elapsed = 0;
        this.currentFrame = 0;
    }
}