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
- **Sistema de física**: Detecção e resolução de colisões entre entidades
- **Sistema de renderização**: Renderização centralizada de entidades
- **Sistema de entidades**: Arquitetura baseada em entidades com componentes
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
│       │   └── System.ts        # Interface para sistemas
│       │
│       ├── systems/              # Sistemas do jogo
│       │   ├── InputSystem.ts   # Sistema de input (teclado e mouse)
│       │   ├── PhysicsSystem.ts # Sistema de física e colisões
│       │   └── RenderSystem.ts  # Sistema de renderização
│       │
│       ├── entities/             # Entidades do jogo
│       │   ├── Entity.ts        # Classe base abstrata para entidades
│       │   ├── Player.ts        # Entidade do jogador
│       │   └── Wall.ts          # Entidade de parede
│       │
│       ├── physics/              # Sistema de física
│       │   └── PhysicsBody.ts   # Interface para corpos físicos
│       │
│       ├── input/                # Gerenciamento de input
│       │   ├── InputState.ts    # Estado das teclas pressionadas
│       │   ├── MouseState.ts    # Estado do mouse (posição e botões)
│       │   ├── InputAction.ts   # Enum de ações do jogo
│       │   ├── ActionInput.ts   # Sistema de ações baseado em bindings
│       │   └── DefaultInputBindings.ts # Bindings padrão de teclas
│       │
│       ├── rendering/            # Renderização
│       │   └── CanvasRenderer.ts # Renderizador Canvas 2D
│       │
│       └── scenes/               # Cenas do jogo
│           ├── MainMenuScene.ts # Cena do menu principal
│           └── Level01Scene.ts  # Cena de gameplay nível 01
│
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

- **Gerenciamento de estado**: STOPPED, RUNNING, PAUSED
- **Sistemas**: Registra e gerencia sistemas do jogo
- **Cenas**: Controla a cena atual e transições
- **Ciclo de atualização**: Orquestra update() e render()

**Fluxo de atualização:**
```
1. Scene.update(delta)    → Lógica da cena (input, atualização de entidades)
2. Scene.render()          → Renderização (usa RenderSystem)
3. Systems.onUpdate(delta)  → Processamento de sistemas
   - InputSystem: clearPressed(), clearReleased(), clearAllClicks()
   - PhysicsSystem: Detecção e resolução de colisões
   - RenderSystem: Não faz nada (renderização é feita pela cena)
```

#### 3. **Sistema de Cenas (`Scene.ts`)**

Classe abstrata para diferentes estados do jogo:

- **onEnter()**: Chamado quando a cena é ativada
- **onExit()**: Chamado quando a cena é desativada
- **update(delta)**: Atualização lógica a cada frame
- **render()**: Renderização visual
- **renderer**: Propriedade protegida com acesso ao CanvasRenderer
- **game**: Referência opcional ao Game para acessar sistemas

**Exemplo de uso:**
```typescript
class MainMenuScene extends Scene {
    constructor(renderer: CanvasRenderer) {
        super();
        this.renderer = renderer;
    }
    
    onEnter() { /* Setup inicial */ }
    update(delta) { /* Lógica do menu */ }
    render() { /* Desenhar menu */ }
    onExit() { /* Cleanup */ }
}
```

#### 4. **Sistema de Sistemas (`System.ts`)**

Interface para componentes modulares:

- **onInit()**: Inicialização (opcional)
- **onUpdate(delta)**: Atualização a cada frame
- **onDestroy()**: Cleanup (opcional)

**Sistemas disponíveis:**
- `InputSystem`: Captura eventos de teclado e mouse
- `PhysicsSystem`: Detecta e resolve colisões entre entidades
- `RenderSystem`: Gerencia renderização centralizada de entidades

#### 5. **Sistema de Input**

**InputSystem (`InputSystem.ts`)**:
- Registra listeners de teclado e mouse
- Atualiza o estado das teclas e do mouse
- Limpa estados temporários após cada frame (mantém estados 'held')
- Gerencia transições de estado: pressed → held → released
- Fornece acesso a ações do jogo através de `ActionInput`

**InputState (`InputState.ts`)**:
- Armazena o estado das teclas (pressed, released, held)
- Métodos para verificar estado: `isPressed()`, `isReleased()`, `isHeld()`
- Métodos de limpeza seletiva: `clearPressed()`, `clearReleased()`, `clear()`

**MouseState (`MouseState.ts`)**:
- Rastreia posição do mouse (x, y) relativa ao canvas
- Gerencia estado dos botões do mouse (0=esquerdo, 1=meio, 2=direito)
- Detecta cliques com posição: `wasClicked()`, `getClickPosition()`
- Limpeza de estados de clique: `clearClick()`, `clearAllClicks()`

**Sistema de Ações (`ActionInput.ts`)**:
- Abstrai teclas físicas em ações do jogo (ex: MOVE_UP, JUMP, ATTACK)
- Permite múltiplas teclas para a mesma ação (ex: WASD ou setas)
- Facilita remapeamento de controles
- Métodos: `isPressed(action)`, `isHeld(action)`, `isReleased(action)`

**InputAction (`InputAction.ts`)**:
- Enum com todas as ações disponíveis no jogo:
  - `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT`
  - `JUMP`, `ATTACK`

**DefaultInputBindings (`DefaultInputBindings.ts`)**:
- Mapeamento padrão de ações para teclas:
  - `MOVE_UP`: 'w', 'ArrowUp'
  - `MOVE_DOWN`: 's', 'ArrowDown'
  - `MOVE_LEFT`: 'a', 'ArrowLeft'
  - `MOVE_RIGHT`: 'd', 'ArrowRight'
  - `JUMP`: ' ' (espaço)
  - `ATTACK`: 'Mouse0' (botão esquerdo do mouse)

**Uso com Sistema de Ações (Recomendado):**
```typescript
const inputSystem = this.game?.getSystems(InputSystem);
const actions = inputSystem?.getActions();

// Usar ações ao invés de teclas diretamente
if (actions?.isPressed(InputAction.JUMP)) {
    // Pular
}
if (actions?.isHeld(InputAction.MOVE_UP)) {
    // Mover para cima (funciona com 'w' ou 'ArrowUp')
}
if (actions?.isHeld(InputAction.ATTACK)) {
    // Atacar
}
```

**Uso com InputState (Acesso direto a teclas):**
```typescript
const inputSystem = this.game?.getSystems(InputSystem);
const input = inputSystem?.getState();
const mouse = inputSystem?.getMouseState();

// Teclado direto
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
- Implementa `PhysicsBody` (vx, vy, solid)
- Movimento com WASD
- Normalização de vetor para movimento diagonal consistente

**Wall (`entities/Wall.ts`)**:
- Entidade estática (parede)
- Implementa `Partial<PhysicsBody>` (apenas `solid`)
- Não se move, apenas bloqueia outras entidades

#### 7. **Sistema de Física**

**PhysicsSystem (`systems/PhysicsSystem.ts`)**:
- Gerencia detecção e resolução de colisões
- Usa AABB (Axis-Aligned Bounding Box) para detecção
- Resolve colisões movendo entidades para fora da sobreposição
- Processa apenas entidades com `solid: true`

**PhysicsBody (`physics/PhysicsBody.ts`)**:
- Interface para entidades físicas
- Propriedades: `vx`, `vy` (velocidade), `solid` (se é sólido)

**Métodos principais:**
- `registerEntity(entity)`: Registra entidade para processamento de física
- `unregisterEntity(entity)`: Remove entidade
- `clearEntities()`: Limpa todas as entidades

#### 8. **Sistema de Renderização**

**RenderSystem (`systems/RenderSystem.ts`)**:
- Centraliza a renderização de todas as entidades
- Mantém ordem de renderização (primeiro registrado renderiza primeiro)
- Gerencia cor de fundo do canvas

**Métodos principais:**
- `registerEntity(entity)`: Registra entidade para renderização
- `unregisterEntity(entity)`: Remove entidade
- `render()`: Limpa canvas e renderiza todas as entidades
- `renderEntities()`: Renderiza apenas entidades (sem limpar)
- `setBackgroundColor(color)`: Define cor de fundo
- `setRenderer(renderer)`: Define o CanvasRenderer

#### 9. **Canvas Renderer (`CanvasRenderer.ts`)**

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
- Movimento usando sistema de ações (MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT)
- Suporta múltiplas teclas: WASD ou setas do teclado
- Normalização de vetor de movimento para velocidade consistente em diagonais
- Movimento baseado em delta time (200 pixels/segundo)
- Player inicializado no centro da tela
- Parede cinza que bloqueia o movimento do player
- Sistema de física detecta e resolve colisões automaticamente
- Sistema de renderização centralizado gerencia a ordem de renderização

### Criando uma Nova Cena

1. Crie um arquivo em `src/renderer/scenes/`:

```typescript
import { Scene } from "../engine/Scene";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { InputSystem } from "../systems/InputSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { Player } from "../entities/Player";
import { Wall } from "../entities/Wall";
import { InputAction } from "../input/InputAction";

export class MyScene extends Scene {
    private player: Player;
    private wall: Wall;

    constructor(renderer: CanvasRenderer) {
        super();
        this.renderer = renderer;
        this.player = new Player(renderer);
        this.wall = new Wall(renderer, 200, 200, 100, 20);
    }
    
    onEnter(): void {
        console.log("Cena iniciada");
        
        // Registra entidades nos sistemas
        const physicsSystem = this.game?.getSystems(PhysicsSystem);
        const renderSystem = this.game?.getSystems(RenderSystem);
        
        if (physicsSystem) {
            physicsSystem.registerEntity(this.player);
            physicsSystem.registerEntity(this.wall);
        }
        
        if (renderSystem) {
            renderSystem.registerEntity(this.wall); // Renderiza primeiro
            renderSystem.registerEntity(this.player); // Renderiza por cima
        }
    }
    
    update(delta: number): void {
        // Acessar sistema de ações (recomendado)
        const inputSystem = this.game?.getSystems(InputSystem);
        const actions = inputSystem?.getActions();
        
        // Usar sistema de ações (recomendado)
        if (actions) {
            this.player.actions = actions;
            this.player.update(delta);
        }
        
        // Exemplo de uso direto de ações
        if (actions?.isPressed(InputAction.JUMP)) {
            // Pular
        }
        if (actions?.isHeld(InputAction.MOVE_UP)) {
            // Mover para cima
        }
        
        this.wall.update(delta);
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
            renderSystem.unregisterEntity(this.player);
            renderSystem.unregisterEntity(this.wall);
        }
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

1. Crie um arquivo em `src/renderer/entities/`:

```typescript
import { Entity } from "./Entity";
import { CanvasRenderer } from "../rendering/CanvasRenderer";

export class MyEntity extends Entity {
    constructor(renderer: CanvasRenderer, x: number, y: number) {
        super(x, y, 50, 50); // width, height
    }
    
    update(delta: number): void {
        // Lógica de atualização
    }
    
    render(): void {
        // Renderização usando CanvasRenderer
    }
}
```

2. Use a entidade em uma cena:

```typescript
const entity = new MyEntity(this.renderer, 100, 100);
const physicsSystem = this.game?.getSystems(PhysicsSystem);
const renderSystem = this.game?.getSystems(RenderSystem);

physicsSystem?.registerEntity(entity);
renderSystem?.registerEntity(entity);
```

### Acessando Sistemas de uma Cena

```typescript
// Input System - Sistema de Ações (Recomendado)
const inputSystem = this.game?.getSystems(InputSystem);
const actions = inputSystem?.getActions();

// Usar ações do jogo
if (actions?.isHeld(InputAction.MOVE_UP)) {
    // Mover para cima (funciona com 'w' ou 'ArrowUp')
}
if (actions?.isPressed(InputAction.JUMP)) {
    // Pular
}
if (actions?.isHeld(InputAction.ATTACK)) {
    // Atacar
}

// Input System - Acesso direto a teclas (se necessário)
const inputState = inputSystem?.getState();
const mouseState = inputSystem?.getMouseState();

// Verificar teclado direto
if (inputState?.isHeld('w')) {
    // Mover para cima (apenas 'w')
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

// Render System
const renderSystem = this.game?.getSystems(RenderSystem);
renderSystem?.setBackgroundColor('#000000');
renderSystem?.registerEntity(myEntity);
renderSystem?.render(); // Renderiza todas as entidades
```

## 📚 Componentes Principais

### Game (`engine/Game.ts`)

**Responsabilidades:**
- Gerenciar estado do jogo (STOPPED, RUNNING, PAUSED)
- Coordenar sistemas e cenas
- Controlar o ciclo de atualização

**Métodos principais:**
- `start(scene)`: Inicia o jogo com uma cena inicial
- `setScene(scene)`: Troca de cena
- `pause()` / `resume()`: Controle de pausa
- `stop()`: Finaliza o jogo
- `getSystems<T>(type)`: Obtém um sistema específico

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
- Fornecer sistema de ações baseado em bindings

**Métodos:**
- `getState()`: Retorna o estado atual do input (InputState)
- `getMouseState()`: Retorna o estado atual do mouse (MouseState)
- `getActions()`: Retorna o sistema de ações (ActionInput)

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

### ActionInput (`input/ActionInput.ts`)

**Responsabilidades:**
- Abstrair teclas físicas em ações do jogo
- Permitir múltiplas teclas para a mesma ação
- Facilitar remapeamento de controles

**Métodos:**
- `isPressed(action)`: Verifica se ação foi pressionada neste frame
- `isHeld(action)`: Verifica se ação está sendo mantida
- `isReleased(action)`: Verifica se ação foi solta neste frame

**Vantagens:**
- Código mais legível (usa `MOVE_UP` ao invés de `'w'`)
- Suporta múltiplas teclas por ação automaticamente
- Fácil de remapear controles (mudar apenas os bindings)

### InputAction (`input/InputAction.ts`)

**Enum com ações disponíveis:**
- `MOVE_UP`: Mover para cima
- `MOVE_DOWN`: Mover para baixo
- `MOVE_LEFT`: Mover para esquerda
- `MOVE_RIGHT`: Mover para direita
- `JUMP`: Pular
- `ATTACK`: Atacar

### DefaultInputBindings (`input/DefaultInputBindings.ts`)

**Mapeamento padrão de ações para teclas:**
- Cada ação pode ter múltiplas teclas associadas
- Facilita suporte a diferentes layouts de teclado
- Pode ser customizado para diferentes jogadores

### PhysicsSystem (`systems/PhysicsSystem.ts`)

**Responsabilidades:**
- Detectar colisões entre entidades registradas
- Resolver colisões movendo entidades para fora da sobreposição
- Processar apenas entidades com `solid: true`

**Métodos:**
- `registerEntity(entity)`: Registra entidade para processamento de física
- `unregisterEntity(entity)`: Remove entidade do sistema
- `clearEntities()`: Limpa todas as entidades registradas

**Como funciona:**
- Usa detecção AABB (Axis-Aligned Bounding Box)
- Calcula sobreposição em X e Y
- Move entidade na direção de menor sobreposição
- Zera velocidade (`vx`/`vy`) quando aplicável

### RenderSystem (`systems/RenderSystem.ts`)

**Responsabilidades:**
- Centralizar renderização de entidades
- Gerenciar ordem de renderização
- Controlar cor de fundo do canvas

**Métodos:**
- `registerEntity(entity)`: Registra entidade para renderização
- `unregisterEntity(entity)`: Remove entidade
- `render()`: Limpa canvas e renderiza todas as entidades
- `renderEntities()`: Renderiza apenas entidades (sem limpar canvas)
- `clear()`: Limpa apenas o canvas
- `setBackgroundColor(color)`: Define cor de fundo
- `setRenderer(renderer)`: Define o CanvasRenderer usado

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

### PhysicsBody (`physics/PhysicsBody.ts`)

**Interface para entidades físicas:**
- `vx`: Velocidade horizontal
- `vy`: Velocidade vertical
- `solid`: Se a entidade é sólida (pode colidir)

## 🎮 Estado Atual do Projeto

### ✅ Implementado

- ✅ Arquitetura base de sistemas e cenas
- ✅ Game loop com delta time
- ✅ Sistema de input (teclado e mouse)
- ✅ Sistema de ações baseado em bindings (ActionInput)
- ✅ Suporte a múltiplas teclas por ação
- ✅ Sistema de mouse com detecção de cliques e posição
- ✅ Sistema de física com detecção e resolução de colisões (AABB)
- ✅ Sistema de renderização centralizado
- ✅ Sistema de entidades (Entity, Player, Wall)
- ✅ Renderização Canvas 2D básica (texto e retângulos)
- ✅ Cena de menu principal (MainMenuScene)
- ✅ Cena de gameplay (Level01Scene) com movimento de player e colisões
- ✅ Movimento de player com WASD e normalização de vetor
- ✅ Colisões entre player e paredes
- ✅ Hot reload em desenvolvimento
- ✅ Build separado para main e renderer processes

### 🚧 Em Desenvolvimento / Planejado

- ⏳ Sistema de áudio
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
