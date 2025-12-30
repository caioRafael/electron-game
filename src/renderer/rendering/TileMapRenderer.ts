import { TileMap } from "../map/TileMap";
import { Tileset } from "../map/Tileset";
import { Camera } from "./Camera";

export class TileMapRenderer {
    constructor(private ctx: CanvasRenderingContext2D) {}

    render(map: TileMap, camera: Camera, tileset?: Tileset){
        const tileSize = map.tileSize;
        const layer = map.visualLayer;

        // Calcula quais tiles estão visíveis na viewport da câmera
        const startX = Math.floor(camera.x / tileSize);
        const startY = Math.floor(camera.y / tileSize);

        const endX = Math.ceil((camera.x + camera.width) / tileSize);
        const endY = Math.ceil((camera.y + camera.height) / tileSize);

        // Clampa os valores aos limites do TileMap/TileLayer
        const clampedStartX = Math.max(0, startX);
        const clampedStartY = Math.max(0, startY);
        const clampedEndX = Math.min(map.width - 1, endX);
        const clampedEndY = Math.min(map.height - 1, endY);

        // Renderiza apenas os tiles visíveis que estão dentro dos limites do TileLayer
        for(let y = clampedStartY; y <= clampedEndY; y++){
            for(let x = clampedStartX; x <= clampedEndX; x++){
                const tileId = layer.getTile(x, y);
                if(tileId < 0) continue; // Tile vazio

                const worldX = x * tileSize;
                const worldY = y * tileSize;

                // Se temos um tileset, renderiza a textura
                if(tileset && tileset.getImage().complete){
                    const tile = tileset.getTile(tileId);
                    if(tile){
                        const img = tileset.getImage();
                        this.ctx.drawImage(
                            img,
                            tile.sx, tile.sy, tile.size, tile.size, // source rectangle
                            worldX, worldY, tileSize, tileSize // destination rectangle
                        );
                    } else {
                        // Fallback: renderiza cor se o tile não existir no tileset
                        this.ctx.fillStyle = '#808080';
                        this.ctx.fillRect(worldX, worldY, tileSize, tileSize);
                    }
                } else {
                    // Fallback: renderiza cor se não houver tileset ou imagem não carregada
                    this.ctx.fillStyle = tileId === 1 ? '#3cb371' : '#8b4513';
                    this.ctx.fillRect(worldX, worldY, tileSize, tileSize);
                }
            }
        }
    }
}