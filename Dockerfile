FROM node:14-alpine as builder

USER 0

COPY . .

RUN npm --loglevel warn ci --production=false --no-optional && npm run build-prod

FROM node:14-alpine

USER 0

RUN addgroup -S group_hocs && adduser -S -u 10000 user_hocs -G group_hocs -h /app

RUN apk add --no-cache dumb-init

USER 10000

WORKDIR /app

COPY --from=builder --chown=user_hocs:group_hocs . .

RUN npm --loglevel warn ci --production --no-optional

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "--max-http-header-size=80000" , "index.js"]
