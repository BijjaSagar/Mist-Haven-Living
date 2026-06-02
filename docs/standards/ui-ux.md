# UI/UX standards (Mist & Haven Living)

Short checklist for public site and admin. Full agent expectations: `Engineering-Standards-Agents.md` (UX Reviewer).

## Four states

Every user-facing surface should handle:

1. **Loading** — route-level `loading.tsx` or skeleton/spinner on actions
2. **Empty** — copy + clear next step (contact, admin seed, etc.)
3. **Error** — route `error.tsx` with retry; forms show what failed and how to fix
4. **Success** — explicit confirmation after save/submit

Shared components: `components/ui/EmptyState.tsx`, `SiteRouteLoading`, `SiteRouteError`, admin equivalents under `components/admin/`.

## Design tokens

Source of truth: [`app/globals.css`](../../app/globals.css)

| Token | Tailwind | Use |
|-------|----------|-----|
| Pearl / oat / sand | `bg-pearl`, `bg-oat`, `bg-sand` | Backgrounds |
| Taupe / muted / ink | `text-taupe`, `text-muted`, `text-ink` | Type |
| Sage | `text-sage-deep`, `bg-sage` | Accents |
| Hairline | `border-hairline` | Dividers |
| Display / body | `font-display`, `font-body` | Headings vs UI copy |

Utilities: `btn-solid`, `btn-ghost`, `py-section-mobile`, `max-w-container`, `bg-paper-texture`.

Do not add new arbitrary hex colors in TSX — extend `:root` in globals if a token is missing.

## Accessibility

- Contrast ≥ 4.5:1 on body text and CTAs
- Tap targets ≥ 44px
- Labels on form fields; `aria-busy` / `aria-live` on loading regions
- Honor `prefers-reduced-motion` (already in globals.css)

## Cursor rule

File-specific guidance: `.cursor/rules/frontend.mdc` (applies to `**/*.tsx`).
