FROM quay.io/ukhomeofficedigital/nodejs-base:v8.9.4

WORKDIR /tmp
COPY . /tmp
RUN npm --loglevel warn install --development --no-optional
RUN npm run build-prod

WORKDIR /app
COPY . /app
RUN cp -a /tmp/build /app/build
RUN npm  --loglevel warn install --production --no-optional

USER nodejs

EXPOSE 8080

CMD npm start
