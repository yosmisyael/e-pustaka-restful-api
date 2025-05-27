# Halo Fajar

## Install
1. clone this repo
2. install deps 
```shell
npm install
```
3. run db migration 
```shell
npx prisma db push
npx prisma migrate dev
```
4. build app
```shell
npm run build
```
5. add env and configure it
```shell
cp .env.example .env
```
6. run app
```shell
npm run start
```