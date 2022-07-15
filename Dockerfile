FROM alpine:3.14 as builder

USER 0

RUN apk add --no-cache nodejs npm

COPY . .

RUN npm --loglevel warn ci --production=false --no-optional
RUN npm run build-prod
RUN npm --loglevel warn ci --production --no-optional

FROM alpine:3.14

USER 0

RUN addgroup -S group_hocs && adduser -S -u 10000 user_hocs -G group_hocs -h /app

RUN apk add --no-cache nodejs dumb-init

USER 10000

WORKDIR /app

COPY --from=builder --chown=user_hocs:group_hocs . .

CMD ["dumb-init", "node", "index.js"]
