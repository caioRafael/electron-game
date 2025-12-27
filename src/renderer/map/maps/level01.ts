import { TileLayer } from "../TileLayer";
import { TileMap } from "../TileMap";
import { TileCollisionType } from "../TileTypes";

export function createLevel01Map(): TileMap {
    const tileSize = 32;
    const width = 20;
    const height = 15;

    // Camada visual: 0 = vazio, 1 = grama verde, 2 = terra marrom
    const visualData: number[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Cria um padrão simples: bordas são terra, centro é grama
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                visualData.push(2); // Terra nas bordas
            } else {
                visualData.push(1); // Grama no centro
            }
        }
    }
    const visualLayer = new TileLayer(width, height, visualData);

    // Camada de colisão: 0 = nenhuma, 1 = sólido, 2 = trigger
    const collisionData: number[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Bordas são sólidas
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                collisionData.push(TileCollisionType.SOLID);
            } else {
                collisionData.push(TileCollisionType.NONE);
            }
        }
    }
    // Adiciona um trigger no meio direito
    const triggerX = width - 2;
    const triggerY = Math.floor(height / 2);
    collisionData[triggerY * width + triggerX] = TileCollisionType.TRIGGER;
    
    const collisionLayer = new TileLayer(width, height, collisionData);

    return new TileMap({
        tileSize,
        width,
        height,
        visualLayer,
        collisionLayer,
    });
}