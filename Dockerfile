FROM quay.io/ukhomeofficedigital/nodejs-base:v8

ENV USER user_hocs_frontend
ENV USER_ID 1000
ENV GROUP group_hocs_frontend

RUN groupadd -r ${GROUP} && \
    useradd -r -u ${USER_ID} -g ${GROUP} ${USER} -d /app && \
    mkdir -p /app && \
    chown -R ${USER}:${GROUP} /app

WORKDIR /tmp
COPY . /tmp
RUN npm --loglevel warn install --development --no-optional
RUN npm run build-prod

WORKDIR /app
COPY . /app
RUN cp -a /tmp/build /app/build
RUN npm  --loglevel warn install --production --no-optional

USER ${USER_ID}

EXPOSE 8080

CMD npm start
