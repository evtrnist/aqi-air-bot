# Базовый образ для всех стадий
FROM node:16 AS base

# Установка рабочего каталога
WORKDIR /usr/src/app

# Копирование файлов проекта
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода
COPY . .

# Стадия разработки
FROM base AS development
# Определение переменных окружения, специфичных для разработки (если нужно)
# ENV SOME_DEV_ENV_VARIABLE=value
# Запуск в режиме разработки
CMD ["npm", "run", "start:dev"]

# Стадия тестирования
FROM base AS testing
# Запуск тестов (можно определить команду для запуска тестов)
# CMD ["npm", "test"]

# Стадия продакшна
FROM base AS production
# Скомпилируйте TypeScript
RUN npm run build
# Откройте порт 3000
EXPOSE 3000
# Запуск в режиме продакшна
CMD ["npm", "run", "start:prod"]
