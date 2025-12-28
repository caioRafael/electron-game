# Game Engine - Projeto de Jogo Electron + TypeScript

Um motor de jogo 2D desenvolvido com Electron, TypeScript e Canvas API, implementando uma arquitetura baseada em sistemas, cenas e componentes.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [Desenvolvimento](#desenvolvimento)
- [Componentes Principais](#componentes-principais)

## 🎯 Visão Geral

Este projeto implementa um motor de jogo 2D com as seguintes características:

- **Arquitetura baseada em sistemas**: Sistema modular onde componentes independentes gerenciam aspectos específicos do jogo
- **Sistema de cenas**: Gerenciamento de diferentes estados do jogo (menu, gameplay, etc.)
- **Game Loop**: Loop de atualização baseado em `requestAnimationFrame` com cálculo de delta time
- **Sistema de input**: Captura e processamento de eventos de teclado e mouse
- **Sistema de física**: Detecção e resolução de colisões entre entidades e tiles
- **Sistema de tile map**: Mapas baseados em tiles com camadas visuais e de colisão
- **Sistema de renderização**: Renderização centralizada de entidades e tile maps
- **Sistema de câmera**: Câmera que segue entidades e aplica transformações de visualização
- **Sistema de game state**: Separação entre estado do jogo (MENU, PLAYING, PAUSED) e estado da cena
- **Sistema de entidades**: Arquitetura baseada em entidades com componentes
- **Sistema de áudio**: Música de fundo e efeitos sonoros com controle de volume separado
- **Renderização Canvas**: Renderização 2D usando Canvas API
- **Hot Reload**: Recarregamento automático durante o desenvolvimento

## 🛠 Tecnologias

- **Electron** (^39.2.7) - Framework para aplicações desktop multiplataforma
- **TypeScript** (^5.3.3) - Superset do JavaScript com tipagem estática
- **esbuild** (^0.19.0) - Bundler rápido para o código renderer
- **chokidar-cli** (^3.0.0) - Monitoramento de arquivos para hot reload
- **concurrently** (^9.2.1) - Execução paralela de scripts

## 📁 Estrutura do Projeto

```
game/
├── src/
│   ├── main/                    # Processo principal do Electron
│   │   └── index.ts             # Configuração da janela Electron
│   │
│   └── renderer/                 # Processo renderer (código do jogo)
│       ├── main.ts              # Ponto de entrada do renderer
│       ├── app.ts               # Classe principal da aplicação
│       ├── index.html           # HTML da aplicação
│       │
│       ├── engine/              # Motor do jogo
│       │   ├── Game.ts          # Classe principal do jogo
│       │   ├── Loop.ts          # Game loop com requestAnimationFrame
│       │   ├── Scene.ts         # Interface para cenas
│       │   ├── System.ts        # Interface para sistemas
│       │   └── EventBus.ts      # Sistema de eventos pub/sub
│       │
│       ├── systems/              # Sistemas do jogo
│       │   ├── InputSystem.ts   # Sistema de input (teclado e mouse)
│       │   ├── PhysicsSystem.ts # Sistema de física e colisões
│       │   ├── RenderSystem.ts  # Sistema de renderização
│       │   ├── CameraSystem.ts  # Sistema de câmera
│       │   └── AudioSystem.ts   # Sistema de áudio (música e SFX)
│       │
│       ├── entities/             # Entidades do jogo
│       │   ├── Entity.ts        # Classe base abstrata para entidades
│       │   ├── Player.ts        # Entidade do jogador
│       │   ├── Wall.ts          # Entidade de parede
│       │   ├── Door.ts          # Entidade de porta/trigger
│       │   └── Food.ts          # Entidade de comida coletável
│       │
│       ├── physics/              # Sistema de física
│       │   ├── PhysicsBody.ts   # Classe abstrata para corpos físicos
│       │   └── ColliderType.ts   # Tipos de collider (SOLID, TRIGGER)
│       │
│       ├── map/                   # Sistema de tile map
│       │   ├── TileMap.ts       # Classe principal do tile map
│       │   ├── TileLayer.ts     # Camada de tiles (visual e colisão)
│       │   ├── TileTypes.ts     # Tipos de colisão de tiles
│       │   └── maps/            # Mapas do jogo
│       │       └── level01.ts   # Mapa do nível 01
│       │
│       ├── input/                # Gerenciamento de input
│       │   ├── InputState.ts    # Estado das teclas pressionadas
│       │   └── MouseState.ts    # Estado do mouse (posição e botões)
│       │
│       ├── rendering/            # Renderização
│       │   ├── CanvasRenderer.ts # Renderizador Canvas 2D
│       │   ├── Camera.ts         # Classe de câmera
│       │   └── TileMapRenderer.ts # Renderizador de tile map
│       │
│       ├── ui/                   # Elementos de interface do usuário
│       │   ├── UIElement.ts     # Classe base abstrata para elementos de UI
│       │   ├── DebugFPS.ts      # Elemento de UI para exibir FPS
│       │   ├── PlayerStatus.ts  # Elemento de UI para status do player
│       │   ├── PauseMenu.ts     # Menu de pausa do jogo
│       │   └── ScoreUI.ts       # Elemento de UI para exibir pontuação
│       │
│       └── scenes/               # Cenas do jogo
│           ├── MainMenuScene.ts # Cena do menu principal
│           └── Level01Scene.ts  # Cena de gameplay nível 01
│
├── assets/                       # Assets do jogo (músicas e sons)
│   ├── musics/                  # Arquivos de música de fundo
│   └── sounds/                  # Arquivos de efeitos sonoros
├── dist/                         # Código compilado (gerado)
├── package.json
├── tsconfig.json                 # Configuração TypeScript principal
└── tsconfig.main.json            # Configuração TypeScript para main process
```

## 🏗 Arquitetura

### Visão Geral

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Electron Main Process       │
│    (Gerenciamento da janela)        │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Electron Renderer Process      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │          App                  │  │
│  │  (Inicialização e setup)      │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │          Game                 │  │
│  │  (Gerenciador principal)      │  │
│  └──────┬───────────────┬───────┘  │
│         │               │           │
│  ┌──────▼──────┐  ┌────▼────────┐ │
│  │   Loop      │  │   Systems   │ │
│  │ (Game Loop)  │  │  (Input,   │ │
│  │             │  │   Physics, │ │
│  └──────┬──────┘  │   Render)  │ │
│         │         └────┬────────┘ │
│         │              │           │
│  ┌──────▼──────────────▼───────┐  │
│  │         Scene                │  │
│  │  (Estado atual do jogo)      │  │
│  │  - Entities (Player, Wall)   │  │
│  └──────┬───────────────────────┘  │
│         │                           │
│  ┌──────▼───────────────────────┐  │
│  │    RenderSystem               │  │
│  │    CanvasRenderer             │  │
│  │    (Renderização 2D)          │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Componentes Principais

#### 1. **Game Loop (`Loop.ts`)**

Gerencia o ciclo principal do jogo usando `requestAnimationFrame`:

- Calcula o delta time (tempo entre frames)
- Chama o callback de atualização a cada frame
- Sincroniza com a taxa de atualização do navegador

**Fluxo:**
```
start() → loop() → requestAnimationFrame → loop() → ...
```

#### 2. **Game (`Game.ts`)**

Classe central que coordena todos os componentes:

- **Gerenciamento de estado**: STOPPED, MENU, PLAYING, PAUSED, GAME_OVER
- **Sistemas**: Registra e gerencia sistemas do jogo
- **Cenas**: Controla a cena atual e transições
- **Ciclo de atualização**: Orquestra update() e render()
- **EventBus**: Sistema de eventos para comunicação entre componentes

**Estados do Jogo (`GameStatus`):**
- `STOPPED`: Jogo parado (inicial)
- `MENU`: Menu principal ativo
- `PLAYING`: Gameplay ativo
- `PAUSED`: Jogo pausado (física pausada, UI ativa)
- `GAME_OVER`: Fim de jogo

**Fluxo de atualização:**
```
1. Scene.render()          → Sempre renderiza (mesmo quando pausado)
2. Scene.update(delta)     → Sempre atualiza para processar inputs (ex: ESC)
3. Systems.onUpdate(delta)  → Processamento de sistemas
   - InputSystem: Sempre atualiza (para processar inputs mesmo quando pausado)
   - PhysicsSystem: Apenas quando PLAYING (pausa quando PAUSED)
   - CameraSystem: Apenas quando PLAYING
   - RenderSystem: Não faz nada (renderização é feita pela cena)
```

**Métodos principais:**
- `getStatus()`: Obtém o estado atual do jogo
- `setStatus(status)`: Define o estado e emite evento `game:status:changed`
- `startPlaying()`: Transiciona para PLAYING
- `showMenu()`: Transiciona para MENU
- `pause()`: Pausa o jogo (PLAYING → PAUSED)
- `resume()`: Retoma o jogo (PAUSED → PLAYING)

#### 3. **Sistema de Cenas (`Scene.ts`)**

Classe abstrata para diferentes estados do jogo:

- **onEnter()**: Chamado quando a cena é ativada
- **onExit()**: Chamado quando a cena é desativada
- **update(delta)**: Atualização lógica a cada frame (sempre chamado, mesmo quando pausado)
- **render()**: Renderização visual (sempre chamado, mesmo quando pausado)
- **game**: Referência opcional ao Game para acessar sistemas e estado

**Métodos auxiliares para verificar estado do jogo:**
- `isStatus(status)`: Verifica se o jogo está em um estado específico
- `isPaused()`: Verifica se o jogo está pausado
- `isPlaying()`: Verifica se o jogo está em gameplay
- `isMenu()`: Verifica se está no menu

**Exemplo de uso:**
```typescript
class GameplayScene extends Scene {
    onEnter() { 
        // Define o estado do jogo quando entra na cena
        this.game?.startPlaying();
    }
    
    update(delta) { 
        // Processa inputs mesmo quando pausado (ex: ESC)
        if (this.isPaused()) {
            // Lógica de pausa
            return;
        }
        
        // Lógica de gameplay apenas quando PLAYING
        if (this.isPlaying()) {
            // Atualiza entidades, física, etc.
        }
    }
    
    render() { 
        // Sempre renderiza (mesmo quando pausado)
    }
    
    onExit() { /* Cleanup */ }
}
```

#### 4. **Sistema de Sistemas (`System.ts`)**

Interface para componentes modulares:

- **game**: Referência opcional ao Game (definida automaticamente ao adicionar sistema)
- **onInit()**: Inicialização (opcional)
- **onUpdate(delta)**: Atualização a cada frame
- **onDestroy()**: Cleanup (opcional)

**Sistemas disponíveis:**
- `InputSystem`: Captura eventos de teclado e mouse
- `PhysicsSystem`: Detecta e resolve colisões entre entidades
- `RenderSystem`: Gerencia renderização centralizada de entidades
- `CameraSystem`: Gerencia posição e movimento da câmera
- `AudioSystem`: Gerencia música de fundo e efeitos sonoros

**Acesso ao Game:**
Sistemas podem acessar o Game através de `this.game` após serem adicionados:
```typescript
export class MySystem implements System {
    game?: Game;
    
    onUpdate(delta: number): void {
        // Acessa o EventBus do jogo
        this.game?.eventBus.emit('my-event', { data: 'value' });
    }
}
```

#### 5. **Sistema de Eventos (`EventBus.ts`)**

Sistema pub/sub para comunicação entre componentes:

- **Suporta múltiplos listeners por evento**: Cada evento pode ter vários listeners registrados
- **Type-safe**: Tipagem genérica para eventos
- **Gerenciamento automático**: Limpa listeners quando não há mais nenhum

**Métodos principais:**
- `on<T>(event, listener)`: Registra um listener para um evento
- `off<T>(event, listener)`: Remove um listener de um evento
- `emit<T>(event, data)`: Emite um evento para todos os listeners registrados
- `clear()`: Limpa todos os listeners

**Eventos padrão:**
- `'collision'`: Emitido quando duas entidades SOLID colidem
  - Payload: `{ entityA: Entity, entityB: Entity }`
- `'trigger:enter'`: Emitido quando uma entidade entra em um TRIGGER
  - Payload: `{ trigger: Entity, other: Entity }`
- `'game:status:changed'`: Emitido quando o estado do jogo muda
  - Payload: `{ previous: GameStatus, current: GameStatus }`

**Uso em cenas:**
```typescript
onEnter(): void {
    // Usar arrow function para preservar contexto 'this'
    this.triggerHandler = (event) => this.onTriggerEnter(event);
    this.game?.eventBus.on('trigger:enter', this.triggerHandler);
}

private onTriggerEnter(event: {trigger: PhysicsBody, other: PhysicsBody}): void {
    if(event.trigger instanceof Door && event.other instanceof Player) {
        this.game?.setScene(new NextScene());
    }
}

onExit(): void {
    if (this.triggerHandler) {
        this.game?.eventBus.off('trigger:enter', this.triggerHandler);
    }
}
```

#### 5. **Sistema de Input**

**InputSystem (`InputSystem.ts`)**:
- Registra listeners de teclado e mouse
- Atualiza o estado das teclas e do mouse
- Limpa estados temporários após cada frame (mantém estados 'held')
- Gerencia transições de estado: pressed → held → released

**InputState (`InputState.ts`)**:
- Armazena o estado das teclas (pressed, released, held)
- Métodos para verificar estado: `isPressed()`, `isReleased()`, `isHeld()`
- Métodos de limpeza seletiva: `clearPressed()`, `clearReleased()`, `clear()`

**MouseState (`MouseState.ts`)**:
- Rastreia posição do mouse (x, y) relativa ao canvas
- Gerencia estado dos botões do mouse (0=esquerdo, 1=meio, 2=direito)
- Detecta cliques com posição: `wasClicked()`, `getClickPosition()`
- Limpeza de estados de clique: `clearClick()`, `clearAllClicks()`

**Uso:**
```typescript
const inputSystem = this.game?.getSystems(InputSystem);
const input = inputSystem?.getState();
const mouse = inputSystem?.getMouseState();

// Teclado
if (input?.isPressed('Enter')) {
    // Ação no primeiro frame que Enter é pressionado
}
if (input?.isHeld('w')) {
    // Ação enquanto W está sendo mantido pressionado
}

// Mouse
if (mouse?.wasClicked(0)) { // Botão esquerdo
    const clickPos = mouse.getClickPosition(0);
    console.log(`Clicado em: ${clickPos?.x}, ${clickPos?.y}`);
}
```

#### 6. **Sistema de Entidades**

**Entity (`entities/Entity.ts`)**:
- Classe abstrata base para todas as entidades do jogo
- Propriedades: `x`, `y`, `width`, `height`
- Métodos abstratos: `update(delta)`, `render()`

**Player (`entities/Player.ts`)**:
- Entidade controlável pelo jogador
- Implementa `PhysicsBody` completo (vx, vy, colliderType: SOLID)
- Movimento com WASD
- Normalização de vetor para movimento diagonal consistente

**Wall (`entities/Wall.ts`)**:
- Entidade estática (parede)
- Implementa `Partial<PhysicsBody>` (colliderType: SOLID)
- Não se move, apenas bloqueia outras entidades

**Door (`entities/Door.ts`)**:
- Entidade de porta/área de detecção
- Implementa `Partial<PhysicsBody>` (colliderType: TRIGGER)
- Não bloqueia movimento, apenas detecta quando entidades passam por ela

#### 7. **Sistema de Física**

**PhysicsSystem (`systems/PhysicsSystem.ts`)**:
- Gerencia detecção e resolução de colisões
- Usa AABB (Axis-Aligned Bounding Box) para detecção
- Suporta dois tipos de colliders: **SOLID** e **TRIGGER**
- **SOLID**: Bloqueia movimento e resolve colisão fisicamente
- **TRIGGER**: Detecta sobreposição sem bloquear movimento
- **Otimização**: Ignora colisões entre objetos estáticos (sem velocidade) para evitar processamento desnecessário
- **Eventos**: Emite eventos através do EventBus do Game (`collision`, `trigger:enter`)

**ColliderType (`physics/ColliderType.ts`)**:
- Enum que define os tipos de collider disponíveis:
  - `SOLID`: Bloqueia movimento, resolve colisão e emite evento `collision`
  - `TRIGGER`: Detecta sobreposição sem bloquear, emite evento `trigger:enter`

**PhysicsBody (`physics/PhysicsBody.ts`)**:
- **Classe abstrata** para entidades físicas (não mais interface)
- Propriedades:
  - `vx?`, `vy?`: Velocidade horizontal e vertical (opcional, apenas para entidades móveis)
  - `colliderType`: Tipo de collider (`ColliderType.SOLID` ou `ColliderType.TRIGGER`) - **abstrato, deve ser implementado**
  - `onCollision?(other)`: Callback opcional chamado quando há colisão entre dois SOLID
  - `onTrigger?(other)`: Callback opcional chamado quando um TRIGGER detecta sobreposição

**Comportamento:**
- **Colisão SOLID vs SOLID**: 
  - Se pelo menos um objeto está em movimento: resolve colisão (move entidade para fora) e emite evento `collision`
  - Se ambos são estáticos: ignora (não resolve nem emite eventos)
- **Colisão TRIGGER vs qualquer**: 
  - Se pelo menos um objeto está em movimento: emite evento `trigger:enter`
  - Se ambos são estáticos: ignora (evita eventos constantes entre objetos fixos)
- **Colisão com Tile Map**:
  - Verifica colisões entre entidades sólidas e tiles sólidos do mapa
  - Resolve colisões movendo a entidade para fora do tile na direção de menor sobreposição
  - Zera velocidade na direção da colisão
  - Detecta triggers do tile map e emite eventos `trigger:enter`

**Detecção de objetos estáticos:**
- Um objeto é considerado estático se `vx === undefined && vy === undefined`
- Objetos com `vx` e `vy` definidos (mesmo que sejam 0) são considerados móveis

**Métodos principais:**
- `registerEntity(entity)`: Registra entidade para processamento de física
- `unregisterEntity(entity)`: Remove entidade
- `clearEntities()`: Limpa todas as entidades
- `setTileMap(tileMap)`: Define o tile map para verificação de colisões

**Uso com EventBus:**
```typescript
// Na cena, escutar eventos de física
onEnter(): void {
    this.triggerHandler = (event) => this.onTriggerEnter(event);
    this.game?.eventBus.on('trigger:enter', this.triggerHandler);
    
    this.collisionHandler = (event) => this.onCollision(event);
    this.game?.eventBus.on('collision', this.collisionHandler);
}

private onTriggerEnter(event: {trigger: PhysicsBody, other: PhysicsBody}): void {
    if(event.trigger instanceof Door && event.other instanceof Player) {
        // Player entrou na porta
        this.game?.setScene(new NextScene());
    }
}

private onCollision(event: {entityA: PhysicsBody, entityB: PhysicsBody}): void {
    // Duas entidades SOLID colidiram
}
```

#### 8. **Sistema de Tile Map**

**TileMap (`map/TileMap.ts`)**:
- Representa um mapa baseado em tiles
- Suporta duas camadas: visual (renderização) e colisão (física)
- Propriedades:
  - `tileSize`: Tamanho de cada tile em pixels
  - `width`, `height`: Dimensões do mapa em tiles
  - `visualLayer`: Camada visual para renderização
  - `collisionLayer`: Camada de colisão para física

**TileLayer (`map/TileLayer.ts`)**:
- Representa uma camada de tiles
- Armazena dados como array unidimensional
- Métodos:
  - `getTile(x, y)`: Obtém o valor do tile na posição (retorna -1 se fora dos limites)

**TileCollisionType (`map/TileTypes.ts`)**:
- Enum que define tipos de colisão de tiles:
  - `NONE`: Tile vazio, sem colisão
  - `SOLID`: Tile sólido, bloqueia movimento
  - `TRIGGER`: Tile trigger, detecta quando entidades passam

**Métodos principais do TileMap:**
- `worldToTile(value)`: Converte coordenada do mundo para coordenada de tile
- `isSolidAt(worldX, worldY)`: Verifica se há um tile sólido na posição do mundo
- `getTriggerAt(worldX, worldY)`: Obtém o tipo de trigger na posição (ou null)

**TileMapRenderer (`rendering/TileMapRenderer.ts`)**:
- Renderiza o tile map na tela
- Otimização: renderiza apenas tiles visíveis na viewport da câmera
- Métodos:
  - `render(map, camera)`: Renderiza o mapa aplicando a câmera

**Criando um Tile Map:**

```typescript
import { TileLayer } from "../map/TileLayer";
import { TileMap } from "../map/TileMap";
import { TileCollisionType } from "../map/TileTypes";

export function createMyMap(): TileMap {
    const tileSize = 32;
    const width = 20;
    const height = 15;

    // Camada visual: dados dos tiles visuais
    const visualData: number[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Define o tipo visual do tile (ex: 0=vazio, 1=grama, 2=terra)
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                visualData.push(2); // Terra nas bordas
            } else {
                visualData.push(1); // Grama no centro
            }
        }
    }
    const visualLayer = new TileLayer(width, height, visualData);

    // Camada de colisão: dados de colisão dos tiles
    const collisionData: number[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Bordas são sólidas
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                collisionData.push(TileCollisionType.SOLID);
            } else {
                collisionData.push(TileCollisionType.NONE);
            }
        }
    }
    // Adiciona um trigger em uma posição específica
    const triggerX = width - 2;
    const triggerY = Math.floor(height / 2);
    collisionData[triggerY * width + triggerX] = TileCollisionType.TRIGGER;
    
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

**Usando Tile Map em uma Cena:**

```typescript
import { TileMap } from "../map/TileMap";
import { createMyMap } from "../map/maps/myMap";

export class MyScene extends Scene {
    private tileMap?: TileMap;

    constructor() {
        super();
        this.tileMap = createMyMap();
    }

    onEnter(): void {
        const renderSystem = this.game?.getSystems(RenderSystem);
        const physicsSystem = this.game?.getSystems(PhysicsSystem);

        // Configura o tile map no sistema de renderização
        if (renderSystem && this.tileMap) {
            renderSystem.setTileMap(this.tileMap);
        }

        // Configura o tile map no sistema de física para colisões
        if (physicsSystem && this.tileMap) {
            physicsSystem.setTileMap(this.tileMap);
        }
    }

    onExit(): void {
        // Remove o tile map dos sistemas
        const renderSystem = this.game?.getSystems(RenderSystem);
        const physicsSystem = this.game?.getSystems(PhysicsSystem);

        renderSystem?.setTileMap(undefined);
        physicsSystem?.setTileMap(undefined);
    }
}
```

**Integração com Física:**
- O PhysicsSystem verifica automaticamente colisões entre entidades e tiles sólidos
- Entidades são movidas para fora dos tiles quando colidem
- Triggers do tile map emitem eventos `trigger:enter` quando entidades passam por eles
- Apenas entidades em movimento são verificadas (objetos estáticos são ignorados)

**Integração com Renderização:**
- O RenderSystem renderiza o tile map antes das entidades
- A transformação da câmera é aplicada automaticamente
- Apenas tiles visíveis na viewport são renderizados (otimização)

#### 9. **Sistema de Câmera**

**CameraSystem (`systems/CameraSystem.ts`)**:
- Gerencia a posição e movimento da câmera
- Segue automaticamente uma entidade alvo
- Centraliza o alvo na tela
- Atualiza a posição da câmera a cada frame

**Camera (`rendering/Camera.ts`)**:
- Representa a viewport da câmera
- Propriedades: `x`, `y` (posição), `width`, `height` (tamanho da viewport)

**Métodos principais:**
- `getCamera()`: Retorna a instância da câmera
- `follow(target)`: Define uma entidade para a câmera seguir
  - `target`: Objeto com `x`, `y`, `width`, `height`

**Como funciona:**
- A câmera calcula sua posição para centralizar o alvo na viewport
- A posição é atualizada no `onUpdate()` do sistema
- O RenderSystem aplica a transformação da câmera ao renderizar o mundo

**Uso:**
```typescript
const cameraSystem = this.game?.getSystems(CameraSystem);
cameraSystem?.follow(this.player); // Câmera segue o player
```

#### 9. **Sistema de Renderização**

**RenderSystem (`systems/RenderSystem.ts`)**:
- Centraliza a renderização de entidades e elementos de UI
- Mantém ordem de renderização (world primeiro, depois UI)
- Aplica transformação da câmera ao renderizar o mundo
- Elementos de UI não são afetados pela câmera (sempre fixos na tela)
- Gerencia cor de fundo do canvas
- Injeta referência do RenderSystem em entidades e elementos de UI automaticamente

**Métodos principais:**
- `registerWorld(entity)`: Registra entidade para renderização (injeta RenderSystem)
- `unregisterWorld(entity)`: Remove entidade
- `registerUI(element)`: Registra elemento de UI (injeta RenderSystem)
- `unregisterUI(element)`: Remove elemento de UI
- `render()`: Limpa canvas, aplica câmera, renderiza entidades e depois elementos de UI
- `renderEntities()`: Renderiza apenas entidades (sem limpar)
- `setBackgroundColor(color)`: Define cor de fundo
- `setRenderer(renderer)`: Define o CanvasRenderer usado
- `getRenderer()`: Obtém o CanvasRenderer usado

**Transformação da Câmera:**
- O mundo é renderizado com `translate(-camera.x, -camera.y)`
- Isso faz com que entidades sejam deslocadas baseadas na posição da câmera
- Elementos de UI são renderizados após restaurar a transformação (fixos na tela)

#### 12. **Canvas Renderer (`CanvasRenderer.ts`)**

Abstração sobre Canvas API para renderização 2D:

- **Métodos de desenho**: `drawText()`, `fillRect()`, `clear()`
- **Utilitários**: `measureText()`, `save()`, `restore()`, `setTextAlign()`
- **Acesso ao canvas**: `getCanvas()` para obter o elemento HTMLCanvasElement
- Encapsula o contexto do canvas (privado)

**Métodos principais:**
- `clear(color?)`: Limpa o canvas (com cor opcional)
- `drawText(text, x, y, options)`: Desenha texto com fonte e cor opcionais
- `fillRect(x, y, width, height, color?)`: Desenha retângulo preenchido
- `measureText(text, font?)`: Mede dimensões do texto
- `save()` / `restore()`: Salva/restaura estado do contexto
- `setTextAlign(align)`: Define alinhamento do texto

### Fluxo de Execução

1. **Inicialização** (`main.ts`):
   ```
   DOMContentLoaded → Criar CanvasRenderer → Criar App → Iniciar cena inicial
   ```

2. **Game Loop**:
   ```
   Loop.start() → requestAnimationFrame → update(delta) → render() → ...
   ```

3. **Atualização de Frame**:
   ```
   Scene.update() → Scene.render() → Systems.onUpdate()
   ```

4. **Troca de Cena**:
   ```
   Scene.onExit() → Nova Scene → Scene.game = this → Scene.onEnter()
   ```

## 🚀 Instalação

```bash
# Instalar dependências
npm install
```

## 💻 Uso

### Desenvolvimento (com hot reload)

```bash
npm run dev
```

Este comando:
- Compila o código TypeScript
- Monitora mudanças em arquivos `.ts` e `.html`
- Recarrega automaticamente quando arquivos são salvos
- Inicia o Electron

### Build de Produção

```bash
npm run build
npm start
```

### Scripts Disponíveis

- `npm run build` - Compila todo o projeto
- `npm run build:main` - Compila apenas o processo main
- `npm run build:renderer` - Compila apenas o processo renderer
- `npm run copy:html` - Copia arquivos HTML para dist
- `npm run watch:html` - Monitora e copia HTML automaticamente
- `npm start` - Build e executa em produção
- `npm run dev` - Modo desenvolvimento com hot reload

## 🔧 Desenvolvimento

### Cenas Existentes

#### MainMenuScene
Cena inicial do jogo que exibe o menu principal:
- Exibe título "Meu Jogo"
- Instrução para pressionar ENTER
- Transição para Level01Scene ao pressionar ENTER

#### Level01Scene
Cena de gameplay demonstrando movimento de player e colisões:
- Player representado por um retângulo vermelho
- Movimento com WASD (w=up, a=left, s=down, d=right)
- Normalização de vetor de movimento para velocidade consistente em diagonais
- Movimento baseado em delta time (200 pixels/segundo)
- Player inicializado no centro do tile map
- Tile map com bordas sólidas que bloqueiam o movimento do player
- Sistema de física detecta e resolve colisões automaticamente
- Sistema de renderização centralizado gerencia a ordem de renderização
- Câmera segue o player mantendo-o sempre centralizado na tela
- **Menu de pausa**: Pressione ESC para pausar/retomar o jogo
  - Quando pausado, física para mas UI permanece ativa
  - Menu de pausa exibe "PAUSADO" com instruções

### Criando uma Nova Cena

1. Crie um arquivo em `src/renderer/scenes/`:

```typescript
import { Scene } from "../engine/Scene";
import { InputSystem } from "../systems/InputSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { Player } from "../entities/Player";
import { Wall } from "../entities/Wall";
import { DebugFPS } from "../ui/DebugFPS";

export class MyScene extends Scene {
    private player: Player;
    private wall: Wall;
    private debugFPS: DebugFPS;

    constructor() {
        super();
        // Não precisa passar renderer - acesso automático via RenderSystem
        this.player = new Player();
        this.wall = new Wall(200, 200, 100, 20);
        this.debugFPS = new DebugFPS();
    }
    
    onEnter(): void {
        console.log("Cena iniciada");
        
        // Configura a câmera para seguir o player
        const cameraSystem = this.game?.getSystems(CameraSystem);
        cameraSystem?.follow(this.player);
        
        // Registra entidades nos sistemas
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        const renderSystem = this.game?.getSystems(RenderSystem);
        
        if (physicsSystem) {
            physicsSystem.registerEntity(this.player);
            physicsSystem.registerEntity(this.wall);
        }
        
        if (renderSystem) {
            renderSystem.registerWorld(this.wall); // Renderiza primeiro
            renderSystem.registerWorld(this.player); // Renderiza por cima
            renderSystem.registerUI(this.debugFPS); // Renderiza por último (sobre tudo, fixo na tela)
        }
    }
    
    update(delta: number): void {
        // Acessar input
        const inputSystem = this.game?.getSystems(InputSystem);
        const input = inputSystem?.getState();
        
        // Usar sistema de ações (recomendado)
        const actions = inputSystem?.getActions();
        if (actions) {
            this.player.actions = actions;
            this.player.update(delta);
        }
        
        this.wall.update(delta);
        this.debugFPS.update(delta);
    }
    
    render(): void {
        // Usa o RenderSystem para renderizar
        const renderSystem = this.game?.getSystems(RenderSystem);
        if (renderSystem) {
            renderSystem.render();
        }
    }
    
    onExit(): void {
        console.log("Cena finalizada");
        
        // Remove entidades dos sistemas
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        const renderSystem = this.game?.getSystems(RenderSystem);
        
        if (physicsSystem) {
            physicsSystem.unregisterEntity(this.player);
            physicsSystem.unregisterEntity(this.wall);
        }
        
        if (renderSystem) {
            renderSystem.unregisterWorld(this.player);
            renderSystem.unregisterWorld(this.wall);
            renderSystem.unregisterUI(this.debugFPS);
        }
    }
}
```

2. Use a cena no `main.ts`:

```typescript
app.start(new MyScene());
    }
}
```

2. Use a cena no `main.ts`:

```typescript
app.start(new MyScene(renderer));
```

### Criando um Novo Sistema

1. Crie um arquivo em `src/renderer/systems/`:

```typescript
import { System } from "../engine/System";

export class MySystem implements System {
    onInit(): void {
        // Inicialização
    }
    
    onUpdate(delta: number): void {
        // Atualização a cada frame
    }
    
    onDestroy(): void {
        // Cleanup
    }
}
```

2. Registre no `app.ts`:

```typescript
this.game.addSystem(new MySystem());
```

### Criando uma Nova Entidade

#### Entidade com Collider SOLID (bloqueia movimento)

```typescript
import { Entity } from "./Entity";
import { PhysicsBody } from "../physics/PhysicsBody";
import { ColliderType } from "../physics/ColliderType";

export class MySolidEntity extends Entity implements Partial<PhysicsBody> {
    colliderType: ColliderType = ColliderType.SOLID;
    
    constructor(x: number, y: number) {
        super(x, y, 50, 50); // width, height
    }
    
    update(delta: number): void {
        // Lógica de atualização
    }
    
    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        renderer.fillRect(this.x, this.y, this.width, this.height, '#ff0000');
    }
    
    onCollision?(other: Partial<PhysicsBody>): void {
        console.log('Colidiu com:', other);
    }
}
```

#### Entidade com Collider TRIGGER (detecta sem bloquear)

```typescript
import { Entity } from "./Entity";
import { PhysicsBody } from "../physics/PhysicsBody";
import { ColliderType } from "../physics/ColliderType";

export class MyTriggerEntity extends Entity implements Partial<PhysicsBody> {
    colliderType: ColliderType = ColliderType.TRIGGER;
    
    constructor(x: number, y: number) {
        super(x, y, 100, 100);
    }
    
    update(delta: number): void {
        // Lógica de atualização
    }
    
    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        renderer.fillRect(this.x, this.y, this.width, this.height, '#00ff00');
    }
    
    onTrigger?(other: Partial<PhysicsBody>): void {
        console.log('Entidade passou pelo trigger:', other);
        // Exemplo: mudar de cena, dar item, etc.
    }
}
```

#### Entidade móvel com física completa

```typescript
import { Entity } from "./Entity";
import { PhysicsBody } from "../physics/PhysicsBody";
import { ColliderType } from "../physics/ColliderType";

export class MyMovingEntity extends Entity implements PhysicsBody {
    vx: number = 0;
    vy: number = 0;
    colliderType: ColliderType = ColliderType.SOLID;
    
    constructor(x: number, y: number) {
        super(x, y, 50, 50);
    }
    
    update(delta: number): void {
        // Atualiza posição usando velocidade
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }
    
    render(): void {
        const renderer = this.getRenderer();
        if (!renderer) return;
        renderer.fillRect(this.x, this.y, this.width, this.height, '#0000ff');
    }
}
```

#### Usando entidades em uma cena:

```typescript
const solidEntity = new MySolidEntity(100, 100);
const triggerEntity = new MyTriggerEntity(200, 200);
const movingEntity = new MyMovingEntity(300, 300);

const physicsSystem = this.game?.getSystems(PhysicsSystem);
const renderSystem = this.game?.getSystems(RenderSystem);

// Registra todas no sistema de física
physicsSystem?.registerEntity(solidEntity);
physicsSystem?.registerEntity(triggerEntity);
physicsSystem?.registerEntity(movingEntity);

// Registra no sistema de renderização
renderSystem?.registerWorld(solidEntity);
renderSystem?.registerWorld(triggerEntity);
renderSystem?.registerWorld(movingEntity);
```

### Criando um Novo Elemento de UI

1. Crie um arquivo em `src/renderer/ui/`:

```typescript
import { UIElement } from "./UIElement";

export class MyUIElement extends UIElement {
    update(delta: number): void {
        // Lógica de atualização (opcional)
    }
    
    render(): void {
        // Acessa o renderer através do método getRenderer()
        const renderer = this.getRenderer();
        if (!renderer) return;
        
        const canvas = renderer.getCanvas();
        
        // Renderização usando CanvasRenderer com posicionamento preciso
        renderer.drawText('Meu Texto', 10, 10, {
            font: '16px Arial',
            color: '#ffffff',
            verticalAlign: 'top',      // Evita corte no topo
            horizontalAlign: 'left'
        });
        
        // Exemplo: texto no canto superior direito
        renderer.drawText('Score: 100', canvas.width - 10, 10, {
            font: '20px Arial',
            color: '#ffff00',
            verticalAlign: 'top',
            horizontalAlign: 'right'    // Alinha à direita
        });
    }
}
```

2. Use o elemento de UI em uma cena:

```typescript
const uiElement = new MyUIElement();
const renderSystem = this.game?.getSystems(RenderSystem);

renderSystem?.registerUI(uiElement); // Injeta RenderSystem automaticamente
```

### Acessando Sistemas de uma Cena

```typescript
// Input System
const inputSystem = this.game?.getSystems(InputSystem);
const inputState = inputSystem?.getState();
const mouseState = inputSystem?.getMouseState();

// Verificar teclado
if (inputState?.isHeld('w')) {
    // Mover para cima
}

// Verificar mouse
if (mouseState?.wasClicked(0)) { // Botão esquerdo
    const pos = mouseState.getClickPosition(0);
    console.log(`Clicado em: ${pos?.x}, ${pos?.y}`);
}

// Physics System
const physicsSystem = this.game?.getSystems(PhysicsSystem);
physicsSystem?.registerEntity(myEntity);
physicsSystem?.unregisterEntity(myEntity);

// Camera System
const cameraSystem = this.game?.getSystems(CameraSystem);
cameraSystem?.follow(myEntity); // Câmera segue a entidade
const camera = cameraSystem?.getCamera(); // Obtém a câmera

// Render System
const renderSystem = this.game?.getSystems(RenderSystem);
renderSystem?.setBackgroundColor('#000000');
renderSystem?.registerWorld(myEntity); // Registra entidade (injeta RenderSystem)
renderSystem?.registerUI(myUIElement); // Registra elemento de UI (injeta RenderSystem)
renderSystem?.render(); // Renderiza todas as entidades e elementos de UI (com câmera aplicada)

// Audio System
const audioSystem = this.game?.getSystems(AudioSystem);
await audioSystem?.loadMusic('tema', './assets/musics/tema.mp3'); // Carrega música
audioSystem?.playMusic('tema'); // Toca música em loop
await audioSystem?.load('sfx', './assets/sounds/sfx.ogg'); // Carrega SFX
audioSystem?.playSFX('sfx'); // Toca efeito sonoro
audioSystem?.pauseMusic(); // Pausa música
audioSystem?.resumeMusic(); // Retoma música
audioSystem?.stopMusic(); // Para música
audioSystem?.setMasterVolume(0.8); // Volume geral
audioSystem?.setMusicVolume(0.5); // Volume da música
audioSystem?.setSFXVolume(1.0); // Volume dos SFX
```

## 📚 Componentes Principais

### Game (`engine/Game.ts`)

**Responsabilidades:**
- Gerenciar estado do jogo (STOPPED, MENU, PLAYING, PAUSED, GAME_OVER)
- Coordenar sistemas e cenas
- Controlar o ciclo de atualização
- Gerenciar EventBus para comunicação entre componentes
- Separar estado do jogo do estado da cena

**Propriedades:**
- `eventBus`: Instância pública do EventBus para comunicação entre sistemas e cenas

**Estados do Jogo:**
- `STOPPED`: Jogo parado (inicial)
- `MENU`: Menu principal ativo
- `PLAYING`: Gameplay ativo (física e sistemas funcionando)
- `PAUSED`: Jogo pausado (física pausada, UI e inputs ativos)
- `GAME_OVER`: Fim de jogo

**Métodos principais:**
- `start(scene)`: Inicia o jogo com uma cena inicial
- `setScene(scene)`: Troca de cena
- `getStatus()`: Obtém o estado atual do jogo
- `setStatus(status)`: Define o estado e emite evento `game:status:changed`
- `startPlaying()`: Transiciona para PLAYING
- `showMenu()`: Transiciona para MENU
- `pause()`: Pausa o jogo (PLAYING → PAUSED)
- `resume()`: Retoma o jogo (PAUSED → PLAYING)
- `stop()`: Finaliza o jogo
- `getSystems<T>(type)`: Obtém um sistema específico
- `addSystem(system)`: Adiciona um sistema ao jogo (define automaticamente `system.game = this`)

**Comportamento do Loop:**
- Sempre renderiza a cena (mesmo quando pausado)
- Sempre atualiza a cena (para processar inputs como ESC)
- InputSystem sempre atualiza (para processar inputs mesmo quando pausado)
- Outros sistemas atualizam apenas quando `PLAYING` (física pausa quando `PAUSED`)

### Loop (`engine/Loop.ts`)

**Responsabilidades:**
- Gerenciar o game loop usando `requestAnimationFrame`
- Calcular delta time entre frames
- Garantir atualização contínua

**Métodos:**
- `start(callback)`: Inicia o loop
- `stop()`: Para o loop

### CanvasRenderer (`rendering/CanvasRenderer.ts`)

**Responsabilidades:**
- Abstrair operações de renderização Canvas
- Gerenciar o contexto do canvas
- Fornecer métodos de desenho

**Métodos principais:**
- `clear(color?)`: Limpa o canvas (com cor opcional)
- `drawText(text, x, y, options)`: Desenha texto com fonte e cor opcionais
- `fillRect(x, y, width, height, color?)`: Desenha retângulo preenchido
- `measureText(text, font?)`: Mede dimensões do texto
- `save()` / `restore()`: Salva/restaura estado do contexto
- `setTextAlign(align)`: Define alinhamento do texto
- `getCanvas()`: Retorna o elemento HTMLCanvasElement

### InputSystem (`systems/InputSystem.ts`)

**Responsabilidades:**
- Capturar eventos de teclado e mouse
- Manter estado das teclas e do mouse
- Gerenciar transições de estado (pressed → held → released)
- Limpar estados temporários após cada frame

**Métodos:**
- `getState()`: Retorna o estado atual do input (InputState)
- `getMouseState()`: Retorna o estado atual do mouse (MouseState)

### InputState (`input/InputState.ts`)

**Responsabilidades:**
- Armazenar estado das teclas
- Fornecer métodos de verificação
- Gerenciar limpeza seletiva de estados

**Métodos:**
- `isPressed(key)`: Verifica se tecla foi pressionada neste frame
- `isReleased(key)`: Verifica se tecla foi solta neste frame
- `isHeld(key)`: Verifica se tecla está sendo mantida
- `clearPressed()`: Remove apenas estados 'pressed'
- `clearReleased()`: Remove apenas estados 'released'
- `clear()`: Remove todos os estados

### MouseState (`input/MouseState.ts`)

**Responsabilidades:**
- Rastrear posição do mouse relativa ao canvas
- Gerenciar estado dos botões do mouse
- Detectar cliques com posição

**Propriedades:**
- `x`, `y`: Posição atual do mouse

**Métodos:**
- `isPressed(button)`: Verifica se botão está pressionado
- `wasClicked(button)`: Verifica se botão foi clicado neste frame
- `getClickPosition(button)`: Obtém posição do clique
- `clearClick(button)`: Limpa estado de clique de um botão
- `clearAllClicks()`: Limpa todos os estados de clique

### PhysicsSystem (`systems/PhysicsSystem.ts`)

**Responsabilidades:**
- Detectar colisões entre entidades registradas usando AABB
- Resolver colisões entre entidades SOLID (bloqueia movimento)
- Detectar sobreposição com entidades TRIGGER (não bloqueia)
- Verificar colisões entre entidades e tiles sólidos do tile map
- Detectar triggers do tile map
- **Pausa automaticamente quando o jogo não está em PLAYING**

**Métodos:**
- `registerEntity(entity)`: Registra entidade para processamento de física
- `unregisterEntity(entity)`: Remove entidade do sistema
- `clearEntities()`: Limpa todas as entidades registradas
- `setTileMap(tileMap)`: Define o tile map para verificação de colisões

**Como funciona:**
- Usa detecção AABB (Axis-Aligned Bounding Box)
- **Pausa automática**: Não processa colisões quando `game.status !== PLAYING`
- **Colisão SOLID vs SOLID**: 
  - Se pelo menos um objeto está em movimento: resolve colisão movendo entidade para fora, calcula sobreposição em X e Y, move na direção de menor sobreposição, zera velocidade (`vx`/`vy`) quando aplicável, emite evento `collision`
  - Se ambos são estáticos: ignora (não processa colisão)
- **Colisão TRIGGER vs qualquer**: 
  - Se pelo menos um objeto está em movimento: emite evento `trigger:enter` através do EventBus
  - Se ambos são estáticos: ignora (evita eventos constantes)
- **Colisão com Tile Map**:
  - Verifica todos os tiles que a entidade está sobrepondo
  - Resolve colisões em X e Y separadamente para evitar atravessar paredes em diagonal
  - Detecta triggers do tile map e emite eventos `trigger:enter`

### CameraSystem (`systems/CameraSystem.ts`)

**Responsabilidades:**
- Gerenciar posição e movimento da câmera
- Seguir automaticamente uma entidade alvo
- Centralizar o alvo na viewport

**Métodos:**
- `getCamera()`: Retorna a instância da câmera
- `follow(target)`: Define uma entidade para a câmera seguir
  - O `target` deve ter propriedades: `x`, `y`, `width`, `height`

**Como funciona:**
- Calcula a posição da câmera para centralizar o alvo
- Atualiza `camera.x` e `camera.y` no `onUpdate()`
- O RenderSystem usa essas coordenadas para aplicar transformação

### Camera (`rendering/Camera.ts`)

**Responsabilidades:**
- Representar a viewport da câmera
- Armazenar posição e dimensões

**Propriedades:**
- `x`, `y`: Posição da câmera no mundo
- `width`, `height`: Tamanho da viewport (geralmente igual ao tamanho do canvas)

### AudioSystem (`systems/AudioSystem.ts`)

**Responsabilidades:**
- Gerenciar música de fundo e efeitos sonoros (SFX)
- Carregar arquivos de áudio de forma assíncrona
- Controlar volumes separados para música e SFX
- Suportar pausar e retomar música de fundo

**Métodos principais:**
- `load(name, url)`: Carrega um arquivo de áudio de forma assíncrona
- `loadMusic(name, url)`: Carrega música de fundo (wrapper de `load`)
- `playMusic(name)`: Toca música de fundo em loop
- `playSFX(name)`: Toca um efeito sonoro uma vez
- `stopMusic()`: Para completamente a música de fundo
- `pauseMusic()`: Pausa a música de fundo (mantém referência para retomar)
- `resumeMusic()`: Retoma a música de fundo pausada
- `setMasterVolume(volume)`: Define volume geral (0.0 a 1.0)
- `setMusicVolume(volume)`: Define volume da música (0.0 a 1.0)
- `setSFXVolume(volume)`: Define volume dos SFX (0.0 a 1.0)

**Como funciona:**
- Usa Web Audio API (`AudioContext`) para reprodução
- Mantém buffers de áudio em memória após carregamento
- Música de fundo toca em loop automaticamente
- SFX são tocados uma vez e não podem ser pausados individualmente
- Arquivos devem estar em `src/assets/` e são copiados para `dist/renderer/assets/` durante o build

**Uso:**
```typescript
const audioSystem = this.game?.getSystems(AudioSystem);

// Carregar e tocar música
await audioSystem?.loadMusic('tema', './assets/musics/tema.mp3');
audioSystem?.playMusic('tema');

// Carregar e tocar SFX
await audioSystem?.load('coletar', './assets/sounds/coletar.ogg');
audioSystem?.playSFX('coletar');

// Controle de volume
audioSystem?.setMasterVolume(0.8);
audioSystem?.setMusicVolume(0.5);
audioSystem?.setSFXVolume(1.0);
```

### RenderSystem (`systems/RenderSystem.ts`)

**Responsabilidades:**
- Centralizar renderização de entidades, tile maps e elementos de UI
- Gerenciar ordem de renderização (tile map primeiro, depois entidades, depois UI)
- Aplicar transformação da câmera ao renderizar o mundo
- Elementos de UI não são afetados pela câmera (fixos na tela)
- Controlar cor de fundo do canvas
- Injetar referência do RenderSystem em entidades e elementos de UI

**Métodos:**
- `registerWorld(entity)`: Registra entidade para renderização (injeta RenderSystem)
- `unregisterWorld(entity)`: Remove entidade
- `registerUI(element)`: Registra elemento de UI para renderização (injeta RenderSystem)
- `unregisterUI(element)`: Remove elemento de UI
- `setTileMap(tileMap)`: Define o tile map para renderização
- `render()`: Limpa canvas, aplica câmera, renderiza tile map, entidades e depois elementos de UI
- `renderEntities()`: Renderiza apenas entidades (sem limpar canvas)
- `clear()`: Limpa apenas o canvas
- `setBackgroundColor(color)`: Define cor de fundo
- `setRenderer(renderer)`: Define o CanvasRenderer usado
- `getRenderer()`: Obtém o CanvasRenderer usado

**Transformação da Câmera:**
- Usa `translate(-camera.x, -camera.y)` antes de renderizar o mundo
- Isso desloca tile map e entidades baseado na posição da câmera
- Restaura a transformação antes de renderizar UI (UI fica fixa)

### EventBus (`engine/EventBus.ts`)

**Responsabilidades:**
- Sistema pub/sub para comunicação entre componentes
- Suporta múltiplos listeners por evento
- Type-safe com tipagem genérica

**Métodos:**
- `on<T>(event, listener)`: Registra um listener para um evento
- `off<T>(event, listener)`: Remove um listener de um evento
- `emit<T>(event, data)`: Emite um evento para todos os listeners registrados
- `clear()`: Limpa todos os listeners

**Eventos padrão:**
- `'collision'`: Emitido quando duas entidades SOLID colidem
  - Payload: `{ entityA: Entity, entityB: Entity }`
- `'trigger:enter'`: Emitido quando uma entidade entra em um TRIGGER
  - Payload: `{ trigger: Entity, other: Entity }`

**Uso:**
```typescript
// Registrar listener (usar arrow function para preservar contexto)
this.handler = (event) => this.onEvent(event);
this.game?.eventBus.on('trigger:enter', this.handler);

// Emitir evento
this.game?.eventBus.emit('my-event', { data: 'value' });

// Remover listener
this.game?.eventBus.off('trigger:enter', this.handler);
```

### Entity (`entities/Entity.ts`)

**Responsabilidades:**
- Classe base abstrata para todas as entidades
- Define estrutura básica (posição e tamanho)
- Força implementação de `update()` e `render()`

**Propriedades:**
- `x`, `y`: Posição da entidade
- `width`, `height`: Dimensões da entidade

**Métodos abstratos:**
- `update(delta)`: Atualização lógica a cada frame
- `render()`: Renderização visual

### Scene (`engine/Scene.ts`)

**Responsabilidades:**
- Classe abstrata base para todas as cenas
- Fornece acesso ao Game e sistemas
- Métodos auxiliares para verificar estado do jogo

**Métodos auxiliares:**
- `isStatus(status)`: Verifica se o jogo está em um estado específico
- `isPaused()`: Verifica se o jogo está pausado
- `isPlaying()`: Verifica se o jogo está em gameplay
- `isMenu()`: Verifica se está no menu

**Métodos abstratos:**
- `onEnter()`: Chamado quando a cena é ativada
- `onExit()`: Chamado quando a cena é desativada
- `update(delta)`: Atualização lógica (sempre chamado, mesmo quando pausado)
- `render()`: Renderização visual (sempre chamado, mesmo quando pausado)

### PhysicsBody (`physics/PhysicsBody.ts`)

**Classe abstrata para entidades físicas:**
- `vx?`: Velocidade horizontal (opcional, apenas para entidades móveis)
- `vy?`: Velocidade vertical (opcional, apenas para entidades móveis)
- `colliderType`: Tipo de collider (`ColliderType.SOLID` ou `ColliderType.TRIGGER`) - **propriedade abstrata, deve ser implementada**
- `onCollision?(other)`: Callback opcional chamado quando há colisão entre dois SOLID
- `onTrigger?(other)`: Callback opcional chamado quando um TRIGGER detecta sobreposição

**Nota:** 
- Entidades estáticas podem implementar `Partial<PhysicsBody>` e definir apenas `colliderType`
- Entidades móveis devem implementar `PhysicsBody` completo incluindo `vx` e `vy`
- Como é uma classe abstrata, você pode estender ou implementar parcialmente usando `Partial<PhysicsBody>`

### ColliderType (`physics/ColliderType.ts`)

**Enum que define tipos de collider:**
- `ColliderType.SOLID`: Bloqueia movimento e resolve colisão fisicamente
- `ColliderType.TRIGGER`: Detecta sobreposição sem bloquear movimento

## 🎮 Estado Atual do Projeto

### ✅ Implementado

- ✅ Arquitetura base de sistemas e cenas
- ✅ Game loop com delta time
- ✅ Sistema de input (teclado e mouse)
- ✅ Sistema de mouse com detecção de cliques e posição
- ✅ Sistema de física com detecção e resolução de colisões (AABB)
- ✅ Sistema de renderização centralizado
- ✅ Sistema de câmera que segue entidades
- ✅ Transformação de câmera aplicada ao mundo (UI fixa na tela)
- ✅ Sistema de entidades (Entity, Player, Wall, Door)
- ✅ Sistema de colliders: SOLID (bloqueia movimento) e TRIGGER (detecta sem bloquear)
- ✅ Sistema de eventos (EventBus) para comunicação entre componentes
- ✅ Sistema de tile map com camadas visuais e de colisão
- ✅ Integração de tile map com sistema de física (colisões com tiles)
- ✅ Renderização de tile map otimizada (apenas tiles visíveis)
- ✅ Otimização de física: ignora colisões entre objetos estáticos
- ✅ Renderização Canvas 2D básica (texto e retângulos)
- ✅ Sistema de áudio com música de fundo e efeitos sonoros
- ✅ Controle de volume separado para música e SFX
- ✅ Pausar e retomar música de fundo
- ✅ Cena de menu principal (MainMenuScene)
- ✅ Cena de gameplay (Level01Scene) com movimento de player e colisões com tile map
- ✅ Movimento de player com WASD e normalização de vetor
- ✅ Colisões entre player e tiles do mapa
- ✅ Eventos de trigger para mudança de cena
- ✅ Sistema de coleta de itens (comida) com pontuação
- ✅ Hot reload em desenvolvimento
- ✅ Build separado para main e renderer processes

### 🚧 Em Desenvolvimento / Planejado
- ⏳ Sistema de assets/sprites
- ⏳ Mais cenas de jogo
- ⏳ Sistema de componentes mais robusto
- ⏳ Sistema de partículas
- ⏳ Sistema de animação

## 📝 Notas Técnicas

### Separação Main/Renderer

O projeto usa dois processos do Electron:
- **Main Process** (`src/main/`): Gerencia a janela e processos do sistema
- **Renderer Process** (`src/renderer/`): Contém o código do jogo

### Build System

- **Main**: Compilado com `tsc` (TypeScript Compiler)
- **Renderer**: Compilado com `esbuild` (bundle ESM para browser)
- **HTML**: Copiado manualmente para `dist/renderer/`

### Hot Reload

O sistema de hot reload funciona através de:
1. `tsc -w`: Recompila TypeScript automaticamente
2. `esbuild --watch`: Recompila renderer automaticamente
3. `chokidar`: Monitora e copia HTML
4. `fs.watch` no Electron: Detecta mudanças e recarrega a janela

## 🤝 Contribuindo

Este é um projeto em desenvolvimento. Sinta-se à vontade para:
- Adicionar novas funcionalidades
- Melhorar a documentação
- Reportar bugs
- Sugerir melhorias

## 📄 Licença

ISC
