@echo off
echo "START"
ren "portal.ts" "portal.global.ts" 
git add . 
git commit -am "update" 
git push
ren "portal.global.ts" "portal.ts"
echo "END"
pause