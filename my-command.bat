@echo off

echo [START]

@REM echo "[PNPM GENERATE]"
@REM pnpm generate

echo "[RENAME <portal.ts> TO <portal.global.ts> ]"
ren "portal.ts" "portal.global.ts"

echo "git add, commit(update), and push"
git add .
git commit -am "update"
git push

echo "[RENAME <portal.global.ts> TO <portal.ts> ]"
ren "portal.global.ts" "portal.ts"


echo "[[[[END]]]]"

pause
