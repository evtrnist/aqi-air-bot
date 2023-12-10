# Базовый образ для всех стадий
FROM node:18 AS base

# Установка рабочего каталога
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# dev
FROM base AS development

# Определение переменных окружения, специфичных для разработки (если нужно)
# ENV SOME_DEV_ENV_VARIABLE=value

CMD ["npm", "run", "start:dev"]

# test
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
