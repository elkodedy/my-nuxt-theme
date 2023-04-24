@echo off

echo [START]

echo.
@REM echo "[PNPM GENERATE]"
@REM pnpm generate

echo.
echo [RENAME]
echo "<portal.ts>TO<portal.global.ts>"
ren "portal.ts" "portal.global.ts"

echo.
echo [GIT] "git add, commit(update), and push"
git add .
git commit -am "update"
git push

echo.
echo [RENAME]
echo "<portal.global.ts>TO<portal.ts>"
ren "portal.global.ts" "portal.ts"

echo.
echo [END]

pause
