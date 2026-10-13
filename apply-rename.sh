#!/usr/bin/env bash
# Run from the repo root AFTER copying the files from this zip over your project.
set -e
perl -pi -e 's/atelier-noir/clawkie/g' package.json package-lock.json components/CartProvider.tsx
perl -pi -e 's/Atelier Noir/clawkie/g' README.md public/sw.js lib/config.ts
perl -pi -e 's/an-static/ck-static/g' public/sw.js
# bakery is cookies now: Croissant icon -> Cookie icon
perl -pi -e 's/\bCroissant\b/Cookie/g' components/BottomNav.tsx app/dashboard/page.tsx
# outline on the mobile bottom nav to match the header
perl -pi -e 's/pb-safe fixed inset-x-0 bottom-0 /pb-safe fixed inset-x-0 bottom-0 border-t-2 border-ink /' components/BottomNav.tsx
echo "Leftover mentions of the old name:"
grep -rniE "atelier" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude=apply-rename.sh || echo "none"
