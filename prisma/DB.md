```bash
npm install @prisma/client
npm install -D prisma
```

Init
```bash
npx prisma init --datasource-provider sqlite
```

Example Prisma 
```js
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

run migrations
```shell
npx prisma migrate dev --name init
```

Prisma Client (the TypeScript ORM) needs to be regenerated if schema changes:
```bash
npx prisma generate
```