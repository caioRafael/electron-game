# Documentação do Sistema de Sprites e Animações

Esta documentação explica como usar o sistema de sprites e animações no jogo.

## Visão Geral

O sistema de sprites e animações é composto por três classes principais:

- **SpriteSheet**: Gerencia a imagem do sprite sheet e divide em frames individuais
- **Animation**: Define uma sequência de frames com duração e comportamento de loop
- **AnimatedSprite**: Gerencia múltiplas animações e renderiza o frame atual

## Estrutura de Arquivos

```
src/renderer/rendering/sprites/
├── SpriteSheet.ts      # Classe para gerenciar sprite sheets
├── Animation.ts         # Classe para definir animações
└── AnimatedSprite.ts   # Classe para gerenciar sprites animados
```

## Preparando o Sprite Sheet

### Requisitos da Imagem

1. **Formato**: PNG com canal alpha (transparência)
2. **Organização**: Grade uniforme de frames (ex: 4x4, 8x8)
3. **Sem espaçamento**: Frames devem estar adjacentes sem gaps
4. **Tamanho consistente**: Todos os frames devem ter o mesmo tamanho

### Exemplo de Sprite Sheet

Um sprite sheet típico pode ter:
- **4 linhas** (direções: down, right, left, up)
- **4 colunas** (frames de animação: frame 0, 1, 2, 3)
- **Total**: 16 frames organizados em uma grade

```
[Frame 0,0] [Frame 1,0] [Frame 2,0] [Frame 3,0]  ← Linha 0 (down)
[Frame 0,1] [Frame 1,1] [Frame 2,1] [Frame 3,1]  ← Linha 1 (right)
[Frame 0,2] [Frame 1,2] [Frame 2,2] [Frame 3,2]  ← Linha 2 (left)
[Frame 0,3] [Frame 1,3] [Frame 2,3] [Frame 3,3]  ← Linha 3 (up)
```

### Calculando Dimensões dos Frames

Se você tem uma imagem de **1080x589 pixels** em uma grade de **4x4**:

- **Largura do frame**: `1080 / 4 = 270 pixels`
- **Altura do frame**: `589 / 4 ≈ 147 pixels` (pode precisar ajustar se não for exato)

**Fórmula geral**:
```
frameWidth = larguraTotal / numeroDeColunas
frameHeight = alturaTotal / numeroDeLinhas
```

## Usando SpriteSheet

### Criando um SpriteSheet

```typescript
import { SpriteSheet } from "../rendering/sprites/SpriteSheet";

// Cria um sprite sheet
// Parâmetros: caminho da imagem, largura do frame, altura do frame
const sheet = new SpriteSheet('./assets/sprites/player.png', 270, 149);
```

**Parâmetros**:
- `imagePath`: Caminho relativo à pasta `dist/renderer/` (onde os assets são servidos)
- `frameWidth`: Largura de cada frame em pixels
- `frameHeight`: Altura de cada frame em pixels

**Importante**: O `SpriteSheet` carrega a imagem de forma assíncrona. O sistema verifica se a imagem está carregada antes de renderizar.

## Criando Animações

### Definindo Frames

Cada frame é definido por suas coordenadas na grade do sprite sheet:

```typescript
import { Animation } from "../rendering/sprites/Animation";

// Animação simples (um único frame)
const idle = new Animation([
    {x: 0, y: 0}  // Frame na posição (0,0) da grade
], 500);  // Duração de 500ms

// Animação com múltiplos frames
const walk = new Animation([
    {x: 0, y: 0},  // Frame 0
    {x: 1, y: 0},  // Frame 1
    {x: 2, y: 0},  // Frame 2
    {x: 3, y: 0},  // Frame 3
], 150);  // Duração de 150ms por frame
```

**Parâmetros do construtor**:
- `frames`: Array de objetos `{x: number, y: number}` representando as coordenadas dos frames
- `frameDuration`: Duração de cada frame em **milissegundos**
- `loop`: Se a animação deve repetir (padrão: `true`)

### Coordenadas dos Frames

As coordenadas `(x, y)` referem-se à posição na grade do sprite sheet:
- `x`: Coluna (0 = primeira coluna, 1 = segunda, etc.)
- `y`: Linha (0 = primeira linha, 1 = segunda, etc.)

**Exemplo**: Em uma grade 4x4:
- `{x: 0, y: 0}` = primeiro frame, primeira linha (canto superior esquerdo)
- `{x: 3, y: 0}` = quarto frame, primeira linha (canto superior direito)
- `{x: 0, y: 3}` = primeiro frame, quarta linha (canto inferior esquerdo)
- `{x: 3, y: 3}` = quarto frame, quarta linha (canto inferior direito)

### Duração dos Frames

A duração é especificada em **milissegundos**:
- **Animações rápidas** (caminhada, corrida): 100-200ms por frame
- **Animações médias** (ataques): 200-400ms por frame
- **Animações lentas** (idle, respiração): 500-1000ms por frame

**Dica**: Animações muito rápidas (< 100ms) podem parecer desfocadas. Animações muito lentas (> 1000ms) podem parecer travadas.

## Usando AnimatedSprite

### Criando um AnimatedSprite

```typescript
import { AnimatedSprite } from "../rendering/sprites/AnimatedSprite";
import { SpriteSheet } from "../rendering/sprites/SpriteSheet";
import { Animation } from "../rendering/sprites/Animation";

// Cria o sprite sheet
const sheet = new SpriteSheet('./assets/sprites/player.png', 270, 149);

// Cria o sprite animado com múltiplas animações
const sprite = new AnimatedSprite(sheet, {
    idle_down: new Animation([{x: 2, y: 0}], 500),
    idle_up: new Animation([{x: 0, y: 3}], 500),
    idle_left: new Animation([{x: 2, y: 1}], 500),
    idle_right: new Animation([{x: 0, y: 1}], 500),
    walk_down: new Animation([
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
    ], 150),
    walk_up: new Animation([
        {x: 0, y: 3},
        {x: 1, y: 3},
        {x: 2, y: 3},
        {x: 3, y: 3},
    ], 150),
    walk_left: new Animation([
        {x: 2, y: 1},
        {x: 3, y: 1},
        {x: 2, y: 2},
        {x: 3, y: 2},
    ], 150),
    walk_right: new Animation([
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 0, y: 2},
        {x: 1, y: 2},
    ], 150),
});

// Inicia com uma animação específica
sprite.play('idle_down');
```

### Métodos Principais

#### `play(name: string)`

Troca para uma animação específica:

```typescript
sprite.play('walk_down');  // Inicia animação de caminhada para baixo
sprite.play('idle_right'); // Troca para animação idle virado para direita
```

**Comportamento**:
- Se a animação já está tocando, não faz nada (evita resetar desnecessariamente)
- Reseta a animação anterior se existir
- Reseta a nova animação para o primeiro frame

#### `update(delta: number)`

Atualiza o frame atual da animação:

```typescript
// No método update() da entidade
sprite.update(delta);  // delta vem em segundos do game loop
```

**Importante**: O `delta` vem em **segundos** do game loop, mas a animação converte internamente para milissegundos.

#### `draw(ctx: CanvasRenderingContext2D, x: number, y: number)`

Renderiza o frame atual na tela:

```typescript
const ctx = renderer.getContext();
sprite.draw(ctx, 100, 200);  // Renderiza na posição (100, 200)
```

**Verificações automáticas**:
- Verifica se há uma animação atual
- Verifica se a imagem está carregada antes de renderizar
- Retorna silenciosamente se não puder renderizar

## Exemplo Completo: Player com Sprites Animados

```typescript
import { Entity } from "./Entity";
import { SpriteSheet } from "../rendering/sprites/SpriteSheet";
import { AnimatedSprite } from "../rendering/sprites/AnimatedSprite";
import { Animation } from "../rendering/sprites/Animation";

export class Player extends Entity {
    sprite?: AnimatedSprite;
    private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down';

    constructor(x: number = 0, y: number = 0) {
        super(x, y, 50, 50);

        // Cria o sprite sheet
        const sheet = new SpriteSheet('./assets/sprites/player-02.png', 270, 149);

        // Cria o sprite animado com todas as animações
        this.sprite = new AnimatedSprite(sheet, {
            idle_down: new Animation([{x: 2, y: 0}], 500),
            idle_up: new Animation([{x: 0, y: 3}], 500),
            idle_left: new Animation([{x: 2, y: 1}], 500),
            idle_right: new Animation([{x: 0, y: 1}], 500),
            walk_down: new Animation([
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 2, y: 0},
            ], 150),
            walk_up: new Animation([
                {x: 0, y: 3},
                {x: 1, y: 3},
                {x: 2, y: 3},
                {x: 3, y: 3},
            ], 150),
            walk_left: new Animation([
                {x: 2, y: 1},
                {x: 3, y: 1},
                {x: 2, y: 2},
                {x: 3, y: 2},
            ], 150),
            walk_right: new Animation([
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 0, y: 2},
                {x: 1, y: 2},
            ], 150),
        });

        // Inicia com animação idle_down
        this.sprite.play('idle_down');
    }

    update(delta: number): void {
        // Determina qual animação usar baseado no movimento
        let animationName: string;
        
        if (this.isMoving()) {
            // Está se movendo
            if (this.movingUp()) {
                animationName = 'walk_up';
                this.lastDirection = 'up';
            } else if (this.movingDown()) {
                animationName = 'walk_down';
                this.lastDirection = 'down';
            } else if (this.movingLeft()) {
                animationName = 'walk_left';
                this.lastDirection = 'left';
            } else {
                animationName = 'walk_right';
                this.lastDirection = 'right';
            }
        } else {
            // Parado, usa animação idle baseada na última direção
            animationName = `idle_${this.lastDirection}`;
        }

        // Atualiza a animação
        if (this.sprite) {
            this.sprite.play(animationName);
            this.sprite.update(delta);
        }
    }

    render(): void {
        const renderer = this.getRenderer();
        if (!renderer || !this.sprite) return;
        
        // Verifica se a imagem está carregada
        if (!this.sprite.sheet.image.complete) {
            // Fallback: desenha um retângulo enquanto carrega
            renderer.fillRect(this.x, this.y, this.width, this.height, '#ff0000');
            return;
        }
        
        // Obtém o contexto do canvas
        const ctx = renderer.getContext();
        
        // Calcula a posição para centralizar o sprite
        const spriteX = this.x - (this.sprite.sheet.frameWidth - this.width) / 2;
        const spriteY = this.y - (this.sprite.sheet.frameHeight - this.height) / 2;
        
        // Renderiza o sprite
        this.sprite.draw(ctx, spriteX, spriteY);
    }
}
```

## Boas Práticas

### 1. Organização de Sprite Sheets

- **Agrupe animações relacionadas**: Todas as animações de um personagem em um sprite sheet
- **Use grades consistentes**: Mantenha o mesmo número de frames por linha quando possível
- **Padronize direções**: Use sempre a mesma ordem (ex: down, right, left, up)

### 2. Nomenclatura de Animações

Use nomes descritivos e consistentes:

```typescript
// Bom
idle_down, walk_down, run_down, attack_down
idle_up, walk_up, run_up, attack_up

// Evite
anim1, anim2, down1, down2
```

### 3. Performance

- **Limite o número de animações**: Não crie animações desnecessárias
- **Reutilize sprite sheets**: Use o mesmo sprite sheet para múltiplas entidades quando possível
- **Verifique carregamento**: Sempre verifique se a imagem está carregada antes de renderizar

### 4. Ajuste de Dimensões

Se as dimensões calculadas não funcionarem perfeitamente:

```typescript
// Tente valores próximos
const sheet = new SpriteSheet('./assets/sprites/player.png', 270, 149);  // Original
const sheet = new SpriteSheet('./assets/sprites/player.png', 270, 147);  // Ajustado
const sheet = new SpriteSheet('./assets/sprites/player.png', 272, 148);  // Alternativa
```

**Dica**: Use ferramentas de edição de imagem para verificar as dimensões exatas de cada frame.

## Troubleshooting

### Sprite não aparece

**Possíveis causas**:
1. Imagem não carregou: Verifique se o caminho está correto e se a imagem existe em `dist/renderer/assets/`
2. Dimensões incorretas: Verifique se `frameWidth` e `frameHeight` correspondem ao tamanho real dos frames
3. Coordenadas incorretas: Verifique se as coordenadas `(x, y)` dos frames estão corretas

**Solução**:
```typescript
// Adicione logs para debug
console.log('Image loaded:', sprite.sheet.image.complete);
console.log('Current animation:', sprite.current);
console.log('Current frame:', sprite.current?.frame);
```

### Animação não muda de frame

**Possíveis causas**:
1. `update()` não está sendo chamado: Certifique-se de chamar `sprite.update(delta)` no método `update()` da entidade
2. Duração muito longa: A animação pode estar correta, mas a duração é muito longa para perceber

**Solução**:
```typescript
// Verifique se update está sendo chamado
sprite.update(delta);
console.log('Elapsed:', sprite.current?.elapsed);  // Se possível acessar
```

### Frames desalinhados

**Possíveis causas**:
1. Dimensões incorretas: `frameWidth` ou `frameHeight` não correspondem ao tamanho real
2. Sprite sheet com espaçamento: Frames não estão adjacentes na imagem

**Solução**:
- Meça as dimensões exatas de cada frame na imagem
- Ajuste `frameWidth` e `frameHeight` conforme necessário
- Considere usar uma ferramenta para gerar sprite sheets sem espaçamento

### Animação muito rápida/lenta

**Solução**:
Ajuste a duração dos frames:

```typescript
// Muito rápida? Aumente a duração
new Animation([...], 200);  // Era 150

// Muito lenta? Diminua a duração
new Animation([...], 100);  // Era 150
```

## Estrutura de Coordenadas

### Sistema de Coordenadas

O sistema usa coordenadas baseadas em **índices da grade**:

```
Grade 4x4:
┌─────────┬─────────┬─────────┬─────────┐
│ (0,0)   │ (1,0)   │ (2,0)   │ (3,0)   │ ← Linha 0
├─────────┼─────────┼─────────┼─────────┤
│ (0,1)   │ (1,1)   │ (2,1)   │ (3,1)   │ ← Linha 1
├─────────┼─────────┼─────────┼─────────┤
│ (0,2)   │ (1,2)   │ (2,2)   │ (3,2)   │ ← Linha 2
├─────────┼─────────┼─────────┼─────────┤
│ (0,3)   │ (1,3)   │ (2,3)   │ (3,3)   │ ← Linha 3
└─────────┴─────────┴─────────┴─────────┘
   ↑       ↑       ↑       ↑
 Col 0   Col 1   Col 2   Col 3
```

**Lembrete**: 
- `x` = coluna (horizontal)
- `y` = linha (vertical)
- Coordenadas começam em `(0, 0)` no canto superior esquerdo

## Referências

- [Documentação de Mapas](./MAPA.md) - Para informações sobre tilesets
- [README Principal](../README.md) - Para visão geral do projeto

