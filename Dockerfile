FROM node:20-slim AS BUILDER

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .
FROM node:20-slim AS RUNTIME

ENV TZ=UTC

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    cron \
    tzdata && \
    rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/share/zoneinfo/UTC /etc/localtime && \
    echo "UTC" > /etc/timezone

COPY --from=builder /usr/src/app /usr/src/app

# CRON SETUP
COPY cron/2fa-cron /etc/cron.d/2fa-cron
RUN chmod 0644 /etc/cron.d/2fa-cron && \
    crontab /etc/cron.d/2fa-cron

RUN chmod +x /usr/src/app/scripts/log_2fa_cron.js


RUN mkdir -p /data /cron && chmod 755 /data /cron
VOLUME ["/data", "/cron"]

EXPOSE 8080

CMD cron && node server.js