# Используйте официальный образ Node.js как базовый образ
FROM node:16

# Установите рабочий каталог внутри контейнера
WORKDIR /usr/src/app

# Копируйте файлы package.json и package-lock.json (или yarn.lock, если используете yarn)
COPY package*.json ./

# Установите зависимости проекта
RUN npm install

# Копируйте исходный код приложения в контейнер
COPY . .

# Скомпилируйте TypeScript
RUN npm run build

# Откройте порт 3000 для доступа к вашему приложению
EXPOSE 3000

# Определите команду для запуска вашего приложения
CMD ["npm", "run", "start:prod"]
