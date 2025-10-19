# Custom Dropdown Component

A fully accessible, keyboard-navigable **custom dropdown** built with **React + TypeScript + Vite + SCSS Modules**.
No external UI libraries.

---

## Tech Stack

- React 19 + TypeScript
- SCSS Modules
- Vite
- Vitest + Testing Library (unit tests)

---

## Features

- Custom placeholder
- Dynamic options
- Closes on outside click
- Keyboard navigation:
  - navigate by ↑ ↓
  - open/close by Enter, Whitespace, Esc and Tab (lost focus)
- Disabled state
- Scroll for long lists (7+ items by default)
- Optional custom `renderOption` prop

---

## Run Locally

```bash
npm i
npm run dev
```

## Run tests

```bash
npm run test
# or with coverage
npm run test -- --coverage
```

---

## Time Spent

| Task                        |       Time |
| --------------------------- | ---------: |
| Component development       |     ~3.5 h |
| Refactoring & accessibility |       ~1 h |
| Unit tests (Vitest + RTL)   |       ~1 h |
| README & cleanup            |     ~0.5 h |
| Deploy                      |     ~0.5 h |
| **Total**                   | **~6.5 h** |
