pnpm generate && cp -r .vercel/output/static/* ../coba-multi-command

ren "portal.ts" "portal.global.ts" ;git add . ; git commit -am "update" ; git push; ren "portal.global.ts" "portal.ts"
