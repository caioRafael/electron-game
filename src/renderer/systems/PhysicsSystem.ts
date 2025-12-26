import { System } from "../engine/System";
import { Entity } from "../entities/Entity";
import { ColliderType } from "../physics/ColliderType";
import { PhysicsBody } from "../physics/PhysicsBody";

export class PhysicsSystem implements System {
    private entities: (Entity & Partial<PhysicsBody>)[] = [];

    onInit(): void {
        // Inicialização do sistema de física
    }

    onUpdate(delta: number): void {
        // Processa colisões entre todas as entidades
        this.checkCollisions();
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

                //BLOQUEIA
                if(aIsSolid && bIsSolid) {
                    this.resolveCollision(entityA, entityB);
                    entityA.onCollision?.(entityB);
                    entityB.onCollision?.(entityA);
                }

                // TRIGGER
                if(entityA.colliderType === ColliderType.TRIGGER) {
                    entityA.onTrigger?.(entityB);
                }
                if(entityB.colliderType === ColliderType.TRIGGER) {
                    entityB.onTrigger?.(entityA);
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
}