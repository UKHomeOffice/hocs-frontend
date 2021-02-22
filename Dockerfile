FROM node:14.15.4-alpine

ENV USER node
ENV USER_ID 1000
ENV GROUP node
ENV NAME hocs-frontend

RUN mkdir -p /tmp && \
    chown -R ${USER}:${GROUP} /tmp

WORKDIR /tmp
COPY . /tmp
RUN npm --loglevel warn install --development --no-optional
RUN npm test
RUN npm run build-prod

RUN mkdir -p /app && \
    chown -R ${USER}:${GROUP} /app

WORKDIR /app
COPY . /app
RUN cp -a /tmp/build /app/build
RUN npm  --loglevel warn install --production --no-optional

USER ${USER_ID}

EXPOSE 8080

CMD npm start
