import { TileMap } from "../map/TileMap";
import { Camera } from "./Camera";

export class TileMapRenderer {
    constructor(private ctx: CanvasRenderingContext2D) {}

    render(map: TileMap, camera: Camera){
        const tileSize = map.tileSize;

        // Calcula quais tiles estão visíveis na viewport da câmera
        const startX = Math.floor(camera.x / tileSize);
        const startY = Math.floor(camera.y / tileSize);

        const endX = Math.ceil((camera.x + camera.width) / tileSize);
        const endY = Math.ceil((camera.y + camera.height) / tileSize);

        // Renderiza apenas os tiles visíveis
        for(let y = startY; y <= endY; y++){
            for(let x = startX; x <= endX; x++){
                const tile = map.visualLayer.getTile(x, y);
                if(tile < 0) continue; // Tile vazio ou fora dos limites

                // Define cor baseada no tipo de tile
                // 1 = grama verde, 2 = terra marrom
                this.ctx.fillStyle = tile === 1 ? '#3cb371' : '#8b4513';

                // Renderiza o tile (a transformação da câmera já foi aplicada pelo RenderSystem)
                this.ctx.fillRect(
                    x * tileSize,
                    y * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }
}