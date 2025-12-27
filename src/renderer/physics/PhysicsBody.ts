import { ColliderType } from "./ColliderType";

export abstract class PhysicsBody {
    vx?: number;
    vy?: number;
    // solid: boolean;

    abstract colliderType: ColliderType;

    onCollision?(other: Partial<PhysicsBody>): void;
    onTrigger?(other: Partial<PhysicsBody>): void;
  }
  