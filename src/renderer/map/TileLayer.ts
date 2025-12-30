export class TileLayer {
    readonly width: number;
    readonly height: number;
    readonly data: number[][];

    constructor(width: number, height: number, data: number[][]) {
        this.width = width;
        this.height = height;
        this.data = data;
    }

    getTile(x: number, y: number): number {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
          return -1;
        }
      
        return this.data[y][x];
    }
}