# incode_backend

Склонировать оба репозитория, скачать все зависимости, поместить оба репозитория в одну папку.
После чего напечатать :

npm init -y
npm i -S concurrently

Добавить в package.json:
"scripts": {
    "start": "concurrently \"cd incode_backend &&  npm run dev\" \"cd incode_front && npm start\""
  }
