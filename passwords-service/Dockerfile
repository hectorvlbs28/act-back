FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --development

COPY src/ ./src/

ENV NODE_ENV=development

EXPOSE 3003

CMD ["node", "src/index.js"]