FROM node:14-alpine as base

FROM base as builder-server

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm --loglevel warn ci --production --no-optional

FROM builder-server as builder-client

COPY . .

RUN npm --loglevel warn ci && npm run build-prod

FROM base AS production

RUN addgroup -S group_hocs && adduser -S -u 10000 user_hocs -G group_hocs -h /app

WORKDIR /app

COPY --from=builder-client --chown=user_hocs:group_hocs ./scripts/run.sh ./
COPY --from=builder-client --chown=user_hocs:group_hocs ./package.json ./
COPY --from=builder-client --chown=user_hocs:group_hocs ./package-lock.json ./
COPY --from=builder-client --chown=user_hocs:group_hocs ./build ./build
COPY --from=builder-client --chown=user_hocs:group_hocs ./src ./src
COPY --from=builder-client --chown=user_hocs:group_hocs ./server ./server
COPY --from=builder-client --chown=user_hocs:group_hocs ./index.js ./
COPY --from=builder-server --chown=user_hocs:group_hocs ./node_modules ./node_modules

USER 10000

CMD ["sh", "/app/run.sh"]
