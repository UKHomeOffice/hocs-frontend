FROM node:14-alpine as base

USER 0

RUN apk add --no-cache dumb-init

RUN addgroup -S group_hocs && adduser -S -u 10000 user_hocs -G group_hocs -h /app

FROM base as builder-server

WORKDIR /app

COPY ./package.json ./package.json

COPY ./package-lock.json ./package-lock.json

USER 10000

RUN npm --loglevel warn ci --production --no-optional

FROM base as builder-client

WORKDIR /app

COPY . .

USER 10000

RUN npm --loglevel warn ci && npm run build-prod

FROM base AS production

WORKDIR /app

USER 10000

COPY --from=builder-client --chown=user_hocs:group_hocs /app/build ./build/
COPY --from=builder-server --chown=user_hocs:group_hocs /app/node_modules ./node_modules
COPY --chown=user_hocs:group_hocs ./package.json ./package.json
COPY --chown=user_hocs:group_hocs ./package-lock.json ./package-lock.json
COPY --chown=user_hocs:group_hocs ./src ./src
COPY --chown=user_hocs:group_hocs ./server ./server
COPY --chown=user_hocs:group_hocs ./index.js ./index.js

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--max-http-header-size 80000" , "index.js"]
