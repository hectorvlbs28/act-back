FROM node:20-alpine

WORKDIR /app

COPY shared/ /shared/

COPY api-gateway/package.json api-gateway/yarn.lock ./

ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; \
    then yarn install --frozen-lockfile; \
    else yarn install --frozen-lockfile --production; \
    fi

COPY api-gateway/src/ ./src/

ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

CMD ["node", "src/index.js"]