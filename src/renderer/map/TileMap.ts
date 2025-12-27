import { TileLayer } from "./TileLayer";
import { TileCollisionType } from "./TileTypes";

export class TileMap {
    readonly tileSize: number;
    readonly width: number;
    readonly height: number;

    readonly visualLayer: TileLayer;
    readonly collisionLayer: TileLayer;

    constructor(params: {
        tileSize: number;
        width: number;
        height: number;
        visualLayer: TileLayer;
        collisionLayer: TileLayer;
      }) {
        this.tileSize = params.tileSize;
        this.width = params.width;
        this.height = params.height;
        this.visualLayer = params.visualLayer;
        this.collisionLayer = params.collisionLayer;
      }

      worldToTile(value: number): number {
        return Math.floor(value / this.tileSize);
      }

      isSolidAt(worldX: number, worldY: number): boolean {
        const tileX = this.worldToTile(worldX);
        const tileY = this.worldToTile(worldY);
    
        const tile = this.collisionLayer.getTile(tileX, tileY);
        return tile === TileCollisionType.SOLID;
      }
    
      getTriggerAt(worldX: number, worldY: number): TileCollisionType | null {
        const tileX = this.worldToTile(worldX);
        const tileY = this.worldToTile(worldY);
    
        const tile = this.collisionLayer.getTile(tileX, tileY);
    
        if (tile === TileCollisionType.TRIGGER) {
          return tile;
        }
    
        return null;
      }
}