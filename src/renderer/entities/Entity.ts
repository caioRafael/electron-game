export abstract class Entity {
    x: number;
    y: number;
    width: number;
    height: number;

    
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    //metodos de uodate e render temporários
    abstract update(delta: number): void;
    abstract render(): void;
}