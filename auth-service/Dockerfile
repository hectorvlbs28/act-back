FROM node:20-alpine

WORKDIR /app

COPY shared/ /shared/

COPY auth-service/package.json auth-service/yarn.lock ./

ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; \
    then yarn install --frozen-lockfile; \
    else yarn install --frozen-lockfile --production; \
    fi

COPY auth-service/src/ ./src/

ENV NODE_ENV=$NODE_ENV

EXPOSE 3001

CMD ["node", "src/index.js"]