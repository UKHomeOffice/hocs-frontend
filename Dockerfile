FROM node:16-alpine as base

FROM base as builder-server

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm --loglevel warn ci --production --no-optional

FROM builder-server as builder-client

COPY . .

RUN npm --loglevel warn ci && npm run build-prod

FROM base AS production

WORKDIR /app

COPY --from=builder-client --chown=node:node ./scripts/run.sh ./
COPY --from=builder-client --chown=node:node ./package.json ./
COPY --from=builder-client --chown=node:node ./package-lock.json ./
COPY --from=builder-client --chown=node:node ./build ./build
COPY --from=builder-client --chown=node:node ./src ./src
COPY --from=builder-client --chown=node:node ./server ./server
COPY --from=builder-client --chown=node:node ./index.js ./
COPY --from=builder-server --chown=node:node ./node_modules ./node_modules

USER 1000

CMD ["sh", "/app/run.sh"]
