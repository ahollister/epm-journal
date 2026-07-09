# Feature folders + domain/ separation

## Problem
UI code, state management, and business logic tend to tangle. When business rules are embedded in components or stores, they become hard to test (require React/Native mocks), hard to reuse, and hard to reason about in isolation.

## Pattern
Three-layer separation with strict dependency direction:

```
features/<name>/     →  domain/   (imports allowed)
features/<name>/     →  features/ (imports forbidden)
domain/              →  nothing   (zero deps)
```

### Layer responsibilities

| Layer | Contains | Depends on |
|-------|----------|------------|
| Feature folder | React components, Zustand store | `domain/` only |
| Zustand store | State, actions, selectors — bridges domain to UI | `domain/` only |
| `domain/` | Pure functions — validators, calculators, state machines | Nothing |

### Why Zustand as bridge
- Components never import `domain/` directly. They go through the store.
- This keeps the component layer "dumb" and the domain layer "pure."
- Stores are colocated with their feature, making it obvious what state a feature owns.

### Testing implications
- Domain functions: plain Jest, no setup. `input → output`.
- Zustand stores: mock-free testing by calling actions and checking state.
- Components: standard React Testing Library with a real store instance.

## Domain modules (current)
- Session state machine
- SMART goal validator
- Skill wheel calculator
- Recording policy engine

## Anti-patterns avoided
- Global monolithic store
- Business logic in `useEffect` or inline in JSX
- Domain functions that import `react` or `react-native`
