# API-COMP-JUNIOR

npm init
npm install prisma --save-dev
npx prisma init

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"

npx prisma migrate dev --name init 

npm install --save-dev typescript

npm install --save-dev ts-node-dev

tscongif.json
{
  "compilerOptions": {
      "sourceMap": true, // significa que vai gerar um arquivo de mapeamento para o código fonte
      "outDir": "dist", // significa que o código transpilado será gerado na pasta dist
      "strict": true, // significa que o TypeScript vai ser mais rigoroso com o código
      "lib": ["ESNext"], // significa que o TypeScript vai usar as funcionalidades mais recentes do JavaScript
      "esModuleInterop": true // significa que o TypeScript vai usar o sistema de módulos do ES6
  }
}

npm install --save-dev express
npm i --save-dev @types/express

npm i --save-dev @types/bcrypt

npm install jsonwebtoken
npm i --save-dev @types/jsonwebtoken

npm install nodemailer
npm i --save-dev @types/nodemailer

npm install ts-node typescript @types/node --save-dev

npm install bcryptjs
npm i --save-dev @types/bcryptjs

npm run seed
npm run migrate
npx prisma migrate deploy
npx prisma db seed
npx prisma generate

npm i --save-dev jest
npm i --save-dev ts-jest    
npm i --save-dev @types/jest
 npm install jest supertest    
 npm i --save-dev @types/supertest
 npm install -D prisma-dbml-generator   