import { Tile } from "./Tile";

export class Tileset{
    private image: HTMLImageElement;
    tiles:  Map<number, Tile> = new Map();

    constructor(
        imagePath: string,
        private tileSize: number,
    ){
        this.image = new Image();
        this.image.src = imagePath;

        this.image.onload = () => {
            this.sliceTiles();
        }
    }

    private sliceTiles(){
        const cols = Math.floor(this.image.width / this.tileSize);
        const rows = Math.floor(this.image.height / this.tileSize);
        console.log("cols", cols);
        console.log("rows", rows);
        console.log("tileSize", this.tileSize);
        console.log("image.width", this.image.width);
        console.log("image.height", this.image.height);

        let id = 0;

        for(let y = 0; y < rows; y++){
            for(let x = 0; x < cols; x++){
                this.tiles.set(
                    id, 
                    new Tile(
                        id,
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        x,
                        y
                    )
                )
                id++;
            }
        }
    }

    getAllTiles(): Tile[] {
        return Array.from(this.tiles.values());
    }

    getTile(id: number): Tile | undefined {
        return this.tiles.get(id);
    }

    getImage(): HTMLImageElement {
        return this.image;
    }
}