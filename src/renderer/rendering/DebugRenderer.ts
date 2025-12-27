import { CanvasRenderer } from "./CanvasRenderer";
import { Entity } from "../entities/Entity";
import { PhysicsBody } from "../physics/PhysicsBody";
import { ColliderType } from "../physics/ColliderType";
import { TileMap } from "../map/TileMap";
import { TileCollisionType } from "../map/TileTypes";
import { Camera } from "./Camera";

export class DebugRenderer {
    constructor(private ctx: CanvasRenderingContext2D) {}

    /**
     * Renderiza bounding boxes de todas as entidades
     */
    renderBoundingBoxes(entities: (Entity & Partial<PhysicsBody>)[], camera: Camera): void {
        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);

        for (const entity of entities) {
            const colliderType = entity.colliderType;
            
            if (colliderType === ColliderType.SOLID) {
                // Bounding box verde para SOLID
                this.ctx.strokeStyle = '#00ff00';
                this.ctx.lineWidth = 2;
            } else if (colliderType === ColliderType.TRIGGER) {
                // Bounding box amarelo para TRIGGER
                this.ctx.strokeStyle = '#ffff00';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
            } else {
                // Bounding box cinza para entidades sem collider
                this.ctx.strokeStyle = '#888888';
                this.ctx.lineWidth = 1;
                this.ctx.setLineDash([2, 2]);
            }

            this.ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);
            this.ctx.setLineDash([]);
        }

        this.ctx.restore();
    }

    /**
     * Renderiza grid do tile map
     */
    renderGrid(tileMap: TileMap, camera: Camera): void {
        const tileSize = tileMap.tileSize;
        const startX = Math.floor(camera.x / tileSize) * tileSize;
        const startY = Math.floor(camera.y / tileSize) * tileSize;
        const endX = Math.ceil((camera.x + camera.width) / tileSize) * tileSize;
        const endY = Math.ceil((camera.y + camera.height) / tileSize) * tileSize;

        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;

        // Linhas verticais
        for (let x = startX; x <= endX; x += tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }

        // Linhas horizontais
        for (let y = startY; y <= endY; y += tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    /**
     * Renderiza tiles de colisão do tile map
     */
    renderTileCollisions(tileMap: TileMap, camera: Camera): void {
        const tileSize = tileMap.tileSize;
        const startTileX = Math.floor(camera.x / tileSize);
        const startTileY = Math.floor(camera.y / tileSize);
        const endTileX = Math.ceil((camera.x + camera.width) / tileSize);
        const endTileY = Math.ceil((camera.y + camera.height) / tileSize);

        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);

        for (let y = startTileY; y <= endTileY; y++) {
            for (let x = startTileX; x <= endTileX; x++) {
                const collisionType = tileMap.collisionLayer.getTile(x, y);
                
                if (collisionType === TileCollisionType.SOLID) {
                    // Tile sólido - vermelho semi-transparente
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                    this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    this.ctx.strokeStyle = '#ff0000';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
                } else if (collisionType === TileCollisionType.TRIGGER) {
                    // Tile trigger - amarelo semi-transparente
                    this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                    this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    this.ctx.strokeStyle = '#ffff00';
                    this.ctx.lineWidth = 1;
                    this.ctx.setLineDash([3, 3]);
                    this.ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    this.ctx.setLineDash([]);
                }
            }
        }

        this.ctx.restore();
    }

    /**
     * Renderiza informações de colisões ativas
     */
    renderActiveCollisions(
        entities: (Entity & Partial<PhysicsBody>)[],
        collisions: Array<{ entityA: Entity & Partial<PhysicsBody>, entityB: Entity & Partial<PhysicsBody> }>,
        camera: Camera
    ): void {
        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.lineWidth = 3;

        for (const collision of collisions) {
            const { entityA, entityB } = collision;
            
            // Linha conectando as duas entidades em colisão
            const centerAX = entityA.x + entityA.width / 2;
            const centerAY = entityA.y + entityA.height / 2;
            const centerBX = entityB.x + (entityB.width || 0) / 2;
            const centerBY = entityB.y + (entityB.height || 0) / 2;

            this.ctx.beginPath();
            this.ctx.moveTo(centerAX, centerAY);
            this.ctx.lineTo(centerBX, centerBY);
            this.ctx.stroke();

            // Círculo no centro de cada entidade
            this.ctx.fillStyle = '#ff00ff';
            this.ctx.beginPath();
            this.ctx.arc(centerAX, centerAY, 3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(centerBX, centerBY, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }
}

