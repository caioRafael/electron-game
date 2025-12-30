# Documentação do Sistema de Mapas

Esta documentação explica como criar mapas e aplicar texturas no jogo.

## Visão Geral

O sistema de mapas é composto por várias classes que trabalham juntas:

- **TileMap**: Representa o mapa completo com suas dimensões e camadas
- **TileLayer**: Camada de dados do mapa (visual ou colisão)
- **Tileset**: Gerencia a imagem de texturas e divide em tiles individuais
- **Tile**: Representa um tile individual com suas coordenadas
- **TileMapRenderer**: Responsável por renderizar o mapa na tela

## Estrutura de Arquivos

```
src/renderer/map/
├── TileMap.ts          # Classe principal do mapa
├── TileLayer.ts        # Camada de dados (visual/colisão)
├── Tileset.ts          # Gerenciador de texturas
├── Tile.ts             # Tile individual
├── TileTypes.ts        # Tipos de colisão
└── maps/
    └── level01.ts      # Exemplo de mapa
```

## Como Criar um Novo Mapa

### 1. Criar o Arquivo do Mapa

Crie um novo arquivo em `src/renderer/map/maps/` com o nome do seu nível (ex: `level02.ts`):

```typescript
import { TileLayer } from "../TileLayer";
import { TileMap } from "../TileMap";
import { TileCollisionType } from "../TileTypes";

export function createLevel02Map(): TileMap {
    const tileSize = 32;  // Tamanho de cada tile em pixels
    const width = 25;     // Largura do mapa em tiles
    const height = 20;    // Altura do mapa em tiles

    // ... código das camadas visual e colisão ...

    return new TileMap({
        tileSize,
        width,
        height,
        visualLayer,
        collisionLayer,
    });
}
```

### 2. Definir a Camada Visual

A camada visual define quais tiles aparecem visualmente no mapa. Cada número representa um ID de tile do tileset:

```typescript
const visualData: number[][] = [];
for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
        // Define qual tile será usado em cada posição
        // 0 = vazio, outros números = ID do tile no tileset
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
            row.push(1); // Tile de parede
        } else {
            row.push(2); // Tile de chão
        }
    }
    visualData.push(row);
}
const visualLayer = new TileLayer(width, height, visualData);
```

**Importante**: Os IDs dos tiles começam em 0 e correspondem à ordem dos tiles na imagem do tileset (da esquerda para direita, de cima para baixo).

### 3. Definir a Camada de Colisão

A camada de colisão define onde há obstáculos físicos no mapa:

```typescript
const collisionData: number[][] = [];
for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
        // Usa TileCollisionType para definir o tipo de colisão
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
            row.push(TileCollisionType.SOLID);  // Bloqueia movimento
        } else {
            row.push(TileCollisionType.NONE);   // Permite movimento
        }
    }
    collisionData.push(row);
}

// Adiciona triggers (áreas especiais que disparam eventos)
collisionData[10][15] = TileCollisionType.TRIGGER;

const collisionLayer = new TileLayer(width, height, collisionData);
```

**Tipos de Colisão**:
- `TileCollisionType.NONE` (0): Sem colisão, permite movimento
- `TileCollisionType.SOLID` (1): Sólido, bloqueia movimento
- `TileCollisionType.TRIGGER` (2): Trigger, dispara eventos quando entidades entram

### 4. Exemplo Completo

```typescript
import { TileLayer } from "../TileLayer";
import { TileMap } from "../TileMap";
import { TileCollisionType } from "../TileTypes";

export function createLevel02Map(): TileMap {
    const tileSize = 32;
    const width = 25;
    const height = 20;

    // Camada visual
    const visualData: number[][] = [];
    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            // Padrão: bordas com tile 1, centro com tile 2
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                row.push(1);
            } else {
                row.push(2);
            }
        }
        visualData.push(row);
    }
    const visualLayer = new TileLayer(width, height, visualData);

    // Camada de colisão
    const collisionData: number[][] = [];
    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                row.push(TileCollisionType.SOLID);
            } else {
                row.push(TileCollisionType.NONE);
            }
        }
        collisionData.push(row);
    }
    const collisionLayer = new TileLayer(width, height, collisionData);

    return new TileMap({
        tileSize,
        width,
        height,
        visualLayer,
        collisionLayer,
    });
}
```

## Como Aplicar Texturas

### 1. Preparar a Imagem do Tileset

A imagem do tileset deve ser uma imagem PNG ou outro formato suportado pelo navegador, organizada em uma grade de tiles:

- Todos os tiles devem ter o mesmo tamanho
- Os tiles devem estar organizados em linhas e colunas
- Não deve haver espaços entre os tiles

**Exemplo**: Uma imagem de 320x320 pixels com tiles de 32x32 pixels terá 10x10 tiles (100 tiles no total).

### 2. Colocar a Imagem no Diretório Correto

Coloque a imagem em `src/assets/map/`:

```
src/assets/map/
└── tilemap_packed-2.png
```

### 3. Criar o Tileset na Cena

Na sua cena (ex: `Level01Scene.ts`), crie uma instância do `Tileset`:

```typescript
import { Tileset } from "../map/Tileset";

export class Level01Scene extends Scene {
    private tileset?: Tileset;

    constructor() {
        super();
        
        // Cria o tileset
        // Parâmetros: caminho da imagem, tamanho de cada tile
        this.tileset = new Tileset('./assets/map/tilemap_packed-2.png', 32);
        
        // ... resto do código ...
    }
}
```

**Parâmetros do Tileset**:
- `imagePath`: Caminho relativo à pasta `dist/renderer/` (onde os assets são servidos)
- `tileSize`: Tamanho de cada tile em pixels (deve corresponder ao tamanho usado no TileMap)

### 4. Configurar o Tileset no Sistema de Renderização

No método `onEnter()` da sua cena, configure o tileset no RenderSystem:

```typescript
onEnter(): void {
    const renderSystem = this.game?.getSystems(RenderSystem);
    
    if (renderSystem) {
        // Configura o tile map
        if (this.tileMap) {
            renderSystem.setTileMap(this.tileMap);
        }
        
        // Configura o tileset para aplicar as texturas
        if (this.tileset) {
            renderSystem.setTileset(this.tileset);
        }
    }
}
```

### 5. Mapeamento de IDs

O sistema automaticamente numera os tiles da imagem do tileset:

```
Tile ID 0:  (0, 0)   - Primeiro tile, canto superior esquerdo
Tile ID 1:  (1, 0)   - Segundo tile da primeira linha
Tile ID 2:  (2, 0)   - Terceiro tile da primeira linha
...
Tile ID 9:  (9, 0)   - Último tile da primeira linha (se a imagem tiver 10 colunas)
Tile ID 10: (0, 1)   - Primeiro tile da segunda linha
...
```

**Importante**: Os IDs na camada visual do mapa devem corresponder aos IDs dos tiles na imagem. Se você usar `row.push(5)` na camada visual, o sistema renderizará o tile com ID 5 da imagem do tileset.

## Exemplo Prático Completo

Aqui está um exemplo completo de como criar um nível com texturas:

### Arquivo: `src/renderer/map/maps/level02.ts`

```typescript
import { TileLayer } from "../TileLayer";
import { TileMap } from "../TileMap";
import { TileCollisionType } from "../TileTypes";

export function createLevel02Map(): TileMap {
    const tileSize = 32;
    const width = 20;
    const height = 15;

    // Camada visual: cria um padrão de bordas
    const visualData: number[][] = [];
    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            // Cantos
            if (y === 0 && x === 0) {
                row.push(3);  // Canto superior esquerdo
            } else if (y === 0 && x === width - 1) {
                row.push(5);  // Canto superior direito
            } else if (y === height - 1 && x === 0) {
                row.push(9);  // Canto inferior esquerdo
            } else if (y === height - 1 && x === width - 1) {
                row.push(11); // Canto inferior direito
            }
            // Bordas
            else if (y === 0) {
                row.push(4);  // Borda superior
            } else if (y === height - 1) {
                row.push(10); // Borda inferior
            } else if (x === 0) {
                row.push(6);  // Borda esquerda
            } else if (x === width - 1) {
                row.push(8);  // Borda direita
            }
            // Centro
            else {
                row.push(7);  // Chão/areia
            }
        }
        visualData.push(row);
    }
    const visualLayer = new TileLayer(width, height, visualData);

    // Camada de colisão: bordas são sólidas
    const collisionData: number[][] = [];
    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                row.push(TileCollisionType.SOLID);
            } else {
                row.push(TileCollisionType.NONE);
            }
        }
        collisionData.push(row);
    }
    const collisionLayer = new TileLayer(width, height, collisionData);

    return new TileMap({
        tileSize,
        width,
        height,
        visualLayer,
        collisionLayer,
    });
}
```

### Uso na Cena: `src/renderer/scenes/Level02Scene.ts`

```typescript
import { Scene } from "../engine/Scene";
import { TileMap } from "../map/TileMap";
import { createLevel02Map } from "../map/maps/level02";
import { Tileset } from "../map/Tileset";
import { RenderSystem } from "../systems/RenderSystem";

export class Level02Scene extends Scene {
    private tileMap?: TileMap;
    private tileset?: Tileset;

    constructor() {
        super();
        
        // Cria o mapa
        this.tileMap = createLevel02Map();
        
        // Cria o tileset com a textura
        // Certifique-se de que o tileSize corresponde ao tamanho dos tiles na imagem
        this.tileset = new Tileset('./assets/map/tilemap_packed-2.png', 32);
    }

    onEnter(): void {
        const renderSystem = this.game?.getSystems(RenderSystem);
        
        if (renderSystem) {
            // Configura o mapa e tileset para renderização
            if (this.tileMap) {
                renderSystem.setTileMap(this.tileMap);
            }
            if (this.tileset) {
                renderSystem.setTileset(this.tileset);
            }
        }
    }
}
```

## Dicas e Boas Práticas

1. **Consistência de Tamanho**: Certifique-se de que o `tileSize` usado no `TileMap` seja o mesmo usado no `Tileset`.

2. **Organização de Tiles**: Mantenha tiles relacionados próximos na imagem do tileset para facilitar a organização.

3. **IDs de Tiles**: Use constantes ou enums para IDs de tiles ao invés de números mágicos:

```typescript
const TILE_IDS = {
    EMPTY: 0,
    GRASS: 1,
    WALL: 2,
    CORNER_TOP_LEFT: 3,
    // ...
};

// Uso:
row.push(TILE_IDS.GRASS);
```

4. **Teste Visual**: Teste o mapa visualmente antes de adicionar colisões complexas.

5. **Performance**: O sistema renderiza apenas os tiles visíveis na viewport da câmera, então mapas grandes são suportados.

6. **Carregamento Assíncrono**: O `Tileset` carrega a imagem de forma assíncrona. O sistema aguarda o carregamento antes de renderizar.

## Troubleshooting

### Tiles não aparecem / aparecem cinza
- Verifique se o caminho da imagem está correto
- Verifique se a imagem foi copiada para `dist/renderer/assets/map/`
- Verifique se o `tileSize` corresponde ao tamanho real dos tiles na imagem

### Tiles errados aparecem
- Verifique se os IDs na camada visual correspondem aos tiles corretos na imagem
- Lembre-se que os IDs começam em 0 e são numerados da esquerda para direita, de cima para baixo

### Colisões não funcionam
- Verifique se a camada de colisão foi configurada corretamente
- Certifique-se de que o `PhysicsSystem` recebeu o `TileMap` via `setTileMap()`

### Mapa muito grande ou muito pequeno
- Ajuste o `tileSize` no `TileMap` e `Tileset`
- Ajuste as dimensões `width` e `height` do mapa

