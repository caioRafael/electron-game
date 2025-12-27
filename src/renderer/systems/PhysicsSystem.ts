import { System } from "../engine/System";
import { Entity } from "../entities/Entity";
import { ColliderType } from "../physics/ColliderType";
import { PhysicsBody } from "../physics/PhysicsBody";
import { Game } from "../engine/Game";
import { TileMap } from "../map/TileMap";
import { TileCollisionType } from "../map/TileTypes";

export class PhysicsSystem implements System {
    game?: Game;
    private entities: (Entity & Partial<PhysicsBody>)[] = [];
    private tileMap?: TileMap;
    

    onInit(): void {
        // Inicialização do sistema de física
    }

    onUpdate(delta: number): void {
        // Processa colisões entre entidades e com o tile map
        this.checkCollisions();
        if (this.tileMap) {
            this.checkTileMapCollisions();
        }
    }

    onDestroy(): void {
        // Limpa o registro de entidades
        this.entities = [];
    }

    /**
     * Registra uma entidade no sistema de física
     */
    registerEntity(entity: Entity & Partial<PhysicsBody>): void {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
    }

    /**
     * Remove uma entidade do sistema de física
     */
    unregisterEntity(entity: Entity & Partial<PhysicsBody>): void {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    /**
     * Limpa todas as entidades registradas
     */
    clearEntities(): void {
        this.entities = [];
    }

    /**
     * Define o tile map para verificação de colisões
     */
    setTileMap(tileMap: TileMap | undefined): void {
        this.tileMap = tileMap;
    }

    /**
     * Verifica colisões entre todas as entidades registradas
     */
    private checkCollisions(): void {
        for (let i = 0; i < this.entities.length; i++) {
            const entityA = this.entities[i];
            
            for (let j = i + 1; j < this.entities.length; j++) {
                const entityB = this.entities[j];
                
                if(!this.isColliding(entityA, entityB)) continue;
                
                const aIsSolid = entityA.colliderType === ColliderType.SOLID;
                const bIsSolid = entityB.colliderType === ColliderType.SOLID;

                // Verifica se ambos são estáticos (sem velocidade)
                const aIsStatic = entityA.vx === undefined && entityA.vy === undefined;
                const bIsStatic = entityB.vx === undefined && entityB.vy === undefined;
                const bothStatic = aIsStatic && bIsStatic;

                //BLOQUEIA - apenas resolve colisão se pelo menos um objeto está em movimento
                if(aIsSolid && bIsSolid && !bothStatic) {
                    this.resolveCollision(entityA, entityB);

                    this.game?.eventBus.emit('collision', {entityA, entityB})
                    // entityA.onCollision?.(entityB);
                    // entityB.onCollision?.(entityA);
                }

                // TRIGGER - apenas emite se pelo menos um objeto está em movimento
                // Isso evita que objetos estáticos (como parede e porta) gerem eventos constantes
                if(!bothStatic) {
                    if(entityA.colliderType === ColliderType.TRIGGER) {
                        this.game?.eventBus.emit('trigger:enter', {
                            trigger: entityA,
                            other: entityB
                        })
                    }
                    if(entityB.colliderType === ColliderType.TRIGGER) {
                        this.game?.eventBus.emit('trigger:enter', {
                            trigger: entityB,
                            other: entityA
                        })
                    }
                }
            }
        }
    }

    /**
     * Verifica se duas entidades estão colidindo usando AABB (Axis-Aligned Bounding Box)
     */
    private isColliding(entityA: Entity, entityB: Entity): boolean {
        return (
            entityA.x < entityB.x + entityB.width &&
            entityA.x + entityA.width > entityB.x &&
            entityA.y < entityB.y + entityB.height &&
            entityA.y + entityA.height > entityB.y
        );
    }

    /**
     * Resolve a colisão entre duas entidades
     * Move a entidade A para fora da entidade B na direção de menor sobreposição
     */
    private resolveCollision(
        entityA: Entity & Partial<PhysicsBody>,
        entityB: Entity & Partial<PhysicsBody>
    ): void {
        // Calcula as sobreposições em cada eixo
        const overlapX = Math.min(
            entityA.x + entityA.width - entityB.x,
            entityB.x + entityB.width - entityA.x
        );
        const overlapY = Math.min(
            entityA.y + entityA.height - entityB.y,
            entityB.y + entityB.height - entityA.y
        );

        // Move a entidade A na direção de menor sobreposição
        if (overlapX < overlapY) {
            // Colisão horizontal - move para esquerda ou direita
            if (entityA.x < entityB.x) {
                // entityA está à esquerda de entityB
                entityA.x = entityB.x - entityA.width;
            } else {
                // entityA está à direita de entityB
                entityA.x = entityB.x + entityB.width;
            }
            
            // Zera a velocidade horizontal se a entidade tiver
            if (entityA.vx !== undefined) {
                entityA.vx = 0;
            }
        } else {
            // Colisão vertical - move para cima ou para baixo
            if (entityA.y < entityB.y) {
                // entityA está acima de entityB
                entityA.y = entityB.y - entityA.height;
            } else {
                // entityA está abaixo de entityB
                entityA.y = entityB.y + entityB.height;
            }
            
            // Zera a velocidade vertical se a entidade tiver
            if (entityA.vy !== undefined) {
                entityA.vy = 0;
            }
        }
    }

    /**
     * Verifica colisões entre entidades e o tile map
     */
    private checkTileMapCollisions(): void {
        if (!this.tileMap) return;

        for (const entity of this.entities) {
            // Apenas processa entidades sólidas que estão em movimento
            if (entity.colliderType !== ColliderType.SOLID) continue;
            const isStatic = entity.vx === undefined && entity.vy === undefined;
            if (isStatic) continue;

            // Verifica colisões com tiles sólidos
            this.checkEntityTileCollision(entity);

            // Verifica triggers do tile map
            this.checkEntityTileTriggers(entity);
        }
    }

    /**
     * Verifica e resolve colisão entre uma entidade e tiles sólidos
     */
    private checkEntityTileCollision(entity: Entity & Partial<PhysicsBody>): void {
        if (!this.tileMap) return;

        const tileSize = this.tileMap.tileSize;
        
        // Calcula quais tiles a entidade está sobrepondo
        const startTileX = this.tileMap.worldToTile(entity.x);
        const startTileY = this.tileMap.worldToTile(entity.y);
        const endTileX = this.tileMap.worldToTile(entity.x + entity.width);
        const endTileY = this.tileMap.worldToTile(entity.y + entity.height);

        let collisionX = false;
        let collisionY = false;
        let minOverlapX = Infinity;
        let minOverlapY = Infinity;
        let pushX = 0;
        let pushY = 0;

        // Verifica todos os tiles que a entidade está sobrepondo
        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
            for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                if (this.tileMap.collisionLayer.getTile(tileX, tileY) === TileCollisionType.SOLID) {
                    const tileWorldX = tileX * tileSize;
                    const tileWorldY = tileY * tileSize;

                    // Calcula sobreposição AABB
                    const overlapX = Math.min(
                        entity.x + entity.width - tileWorldX,
                        tileWorldX + tileSize - entity.x
                    );
                    const overlapY = Math.min(
                        entity.y + entity.height - tileWorldY,
                        tileWorldY + tileSize - entity.y
                    );

                    // Só processa se há sobreposição real
                    if (overlapX > 0 && overlapY > 0) {
                        // Determina direção da colisão baseada na menor sobreposição
                        if (overlapX < overlapY) {
                            collisionX = true;
                            if (overlapX < minOverlapX) {
                                minOverlapX = overlapX;
                                // Move para fora do tile na direção X
                                pushX = entity.x < tileWorldX 
                                    ? -(overlapX) // Move para esquerda
                                    : overlapX;   // Move para direita
                            }
                        } else {
                            collisionY = true;
                            if (overlapY < minOverlapY) {
                                minOverlapY = overlapY;
                                // Move para fora do tile na direção Y
                                pushY = entity.y < tileWorldY 
                                    ? -(overlapY) // Move para cima
                                    : overlapY;   // Move para baixo
                            }
                        }
                    }
                }
            }
        }

        // Resolve colisão movendo a entidade para fora do tile
        if (collisionX || collisionY) {
            // Resolve na direção de menor sobreposição
            if (minOverlapX < minOverlapY || !collisionY) {
                entity.x += pushX;
                if (entity.vx !== undefined) {
                    entity.vx = 0;
                }
            } else {
                entity.y += pushY;
                if (entity.vy !== undefined) {
                    entity.vy = 0;
                }
            }
        }
    }

    /**
     * Verifica triggers do tile map
     */
    private checkEntityTileTriggers(entity: Entity & Partial<PhysicsBody>): void {
        if (!this.tileMap) return;

        // Verifica o centro da entidade para triggers
        const centerX = entity.x + entity.width / 2;
        const centerY = entity.y + entity.height / 2;

        const trigger = this.tileMap.getTriggerAt(centerX, centerY);
        if (trigger === TileCollisionType.TRIGGER) {
            // Emite evento de trigger
            this.game?.eventBus.emit('trigger:enter', {
                trigger: { x: centerX, y: centerY, tileMap: this.tileMap } as any,
                other: entity
            });
        }
    }
}