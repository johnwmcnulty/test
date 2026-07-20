# BuilderIQ (Clean) — imported design prototype

Imported from the claude.ai/design project `c6fc617f-36c7-48fa-abd7-8126ecb77c48`
(`builderiq/BuilderIQ (Clean).html` plus every file it depends on, byte-for-byte).

This is a self-contained React prototype that compiles its JSX in the browser with
Babel standalone (React 18 UMD from unpkg). It must be served statically **without**
any build-tool transformation of the `.jsx` files — which is why it lives under
`public/`, where Vite serves files verbatim.

## Run it

```sh
npm run dev            # then open http://localhost:3000/builderiq/BuilderIQ%20(Clean).html
# or, with no toolchain:
python3 -m http.server -d public 8000
```

Entry points:

- `BuilderIQ (Clean).html` — the builder app (Builder / Field toggle, all screens)
- `BuilderIQ Client (Clean).html` — the homeowner "send-out" portal
- `BuilderIQ Sub (Clean).html` — the subcontractor "send-out" portal

The "(Clean)" build starts with blank sample data (empty states + onboarding) and
persists everything you create to `localStorage` under a `clean:`-namespaced key.

## Layout

- `public/styles.css`, `public/tokens/`, `public/components/app/` — Sandow design-system
  tokens the prototype layers on (referenced as `../styles.css` from `builderiq/`)
- `public/builderiq/hifi-*.jsx` — one file per builder-app screen
- `public/builderiq/client-*.jsx`, `sub-app*.jsx` — the two send-out portals
- `tweaks-panel.jsx`, `image-slot.js`, `hifi-launch.jsx`, `hifi-print.jsx` — shared
  prototype infrastructure (tweaks panel, image drop slots, onboarding/toasts, PDF sheet)

Requires internet access at runtime for the React/Babel CDN scripts and Google Fonts.
