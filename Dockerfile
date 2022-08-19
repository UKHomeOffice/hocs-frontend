FROM node:16-alpine

WORKDIR /app

COPY --chown=node:node ./scripts/run.sh ./
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./package-lock.json ./
COPY --chown=node:node ./build ./build
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./server ./server
COPY --chown=node:node ./index.js ./
COPY --chown=node:node ./node_modules ./node_modules

USER 1000

CMD ["sh", "/app/run.sh"]
