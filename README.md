# Range Slider

Custom range slider component with Next.js, React 19, and TypeScript.

## Tecnologías

- **Next.js 16** - Framework React
- **React 19** - UI library
- **TypeScript 5** - Tipado estático
- **Jest + Testing Library** - Testing
- **Playwright** - E2E testing
- **Biome** - Linting y formato

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Desarrollo (http://localhost:8080)
npm run dev

# Tests
npm test

# Build
npm run build
npm start

# E2E tests
npm run e2e
```

## Características

- Slider personalizado con dos handles (min/max)
- Arrastrar con mouse
- Editar valores haciendo click
- Navegación completa por teclado (ARIA)
- 30 tests unitarios + tests E2E

## Estructura

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   └── exercise1/            # Demo del slider
├── components/
│   └── Range/
│       ├── Range.tsx         # Componente principal
│       ├── components/       # Sub-componentes
│       ├── hooks/            # Custom hooks
│       └── context/          # Context API
└── services/
    └── rangeService.ts       # Mock HTTP service
```

## Navegación con teclado

- `←/→` o `↓/↑`: Cambiar valor ±1
- `Home/End`: Ir a min/max
- `Page Up/Down`: Cambiar valor ±10
