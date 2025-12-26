import { ColliderType } from "./ColliderType";

export interface PhysicsBody {
    vx: number;
    vy: number;
    // solid: boolean;

    colliderType: ColliderType;

    onCollision?(other: Partial<PhysicsBody>): void;
    onTrigger?(other: Partial<PhysicsBody>): void;
  }
  