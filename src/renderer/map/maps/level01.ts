import { TileLayer } from "../TileLayer";
import { TileMap } from "../TileMap";
import { TileCollisionType } from "../TileTypes";

export function createLevel01Map(): TileMap {
    const tileSize = 32;
    const width = 50;
    const height = 35;

    // Camada visual: 0 = vazio, 1 = grama verde, 2 = terra marrom
    const visualData: number[][] = [];
    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            // Cria um padrão simples: bordas são terra, centro é grama
            if(y === 0 && x === 0){
                row.push(3); // Canto superior esquedo
            }else if(y === 0 && (x > 0 && x < width-1)){
                row.push(4); // Topo 
            } else if(y === 0 && x === width-1){
                row.push(5); // Canto superior direito
            } else if(y === height -1 && x === 0){
                row.push(9); // Canto inferior esquerdo
            }else if((y > 0 && y < height) && x === 0){
                row.push(6); // Lado esquerdo
            }else if(y === height -1 && x === width-1){
                row.push(11); // Canto inferior direito
            } else if((y > 0 || y < height -1) && x === width-1){
                row.push(8); // Lado direito
            } else if(y === height-1 && (x > 0 || x < width-1)){
                row.push(10); // Base
            } else {
                row.push(7); // Areia no centro
            }
        }
        visualData.push(row);
    }
    const visualLayer = new TileLayer(width, height, visualData);

    // Camada de colisão: 0 = nenhuma, 1 = sólido, 2 = trigger
    const collisionData: number[][] = [];
    for (let y = 0; y <= height; y++) {
        const row: number[] = [];
        for (let x = 0; x <= width; x++) {
            // Bordas são sólidas
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                row.push(TileCollisionType.SOLID);
            } else {
                row.push(TileCollisionType.NONE);
            }
        }
        collisionData.push(row);
    }
    // Adiciona um trigger no meio direito
    const triggerX = width - 2;
    const triggerY = Math.floor(height / 2);
    collisionData[triggerY][triggerX] = TileCollisionType.TRIGGER;
    
    const collisionLayer = new TileLayer(width, height, collisionData);

    return new TileMap({
        tileSize,
        width,
        height,
        visualLayer,
        collisionLayer,
    });
}