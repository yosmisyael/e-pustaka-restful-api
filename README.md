# E-Pustaka
Final project for web programming workshop course, 2nd semester IT EEPIS

## Install
1. clone this repo
```bash
git clone https://github.com/yosmisyael/e-pustaka-restful-api.git
```
2. install all deps 
```bash
npm install
```
3. run db migration 
```bash
npx prisma db push
npx prisma migrate dev
```
4. build app
```bash
npm run build
```
5. add env and configure it
```bash
cp .env.example .env
```
6. run app
```bash
npm run start
```
