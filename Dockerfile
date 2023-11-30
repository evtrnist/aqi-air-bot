# Используем официальный образ Node.js в качестве базового образа
FROM node:16

# Устанавливаем директорию приложения в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в директорию приложения
COPY package*.json ./

# Устанавливаем зависимости приложения
RUN npm install

# Копируем исходный код приложения в директорию приложения
COPY . .

# EXPOSE указывает порт, на котором приложение слушает
EXPOSE 3000

# Собираем TypeScript код в JavaScript
RUN npm run build

# Определяем команду для запуска приложения
CMD ["npm", "run", "start:prod"]
