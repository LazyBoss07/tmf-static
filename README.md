# tmf-static — TrackMyFund static assets (CDN mirror)

Public mirror of browser-served static files for TrackMyFund.
Do not edit here — run `node scripts/sync-static-cdn.js` from the main repo.

## CDN usage

- Latest (dev): `https://cdn.jsdelivr.net/gh/LazyBoss07/tmf-static@main`
- Pinned (prod, immutable): `https://cdn.jsdelivr.net/gh/LazyBoss07/tmf-static@<tag>`

Example:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/LazyBoss07/tmf-static@main/shared/styles.css" />
<script src="https://cdn.jsdelivr.net/gh/LazyBoss07/tmf-static@main/shared/kinetics.js" defer></script>
```

Assets here are exactly what the app already serves at `/shared/*` and `/components/*`.

## Files
- `shared/styles.css`
- `shared/animations.css`
- `shared/kinetics.css`
- `shared/kinetics.js`
- `shared/theme.js`
- `components/nav.js`
- `components/footer.js`
- `components/loader.js`
- `components/notification.js`
- `shared/assets/icon.svg`
- `shared/assets/icon_transparent.svg`
- `shared/assets/icon_dark_background.svg`
- `shared/assets/favicon.svg`
- `shared/assets/favicons.svg`
- `shared/assets/faviicon.png`
- `favicon.svg`
