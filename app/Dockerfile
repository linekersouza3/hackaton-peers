FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
# Corrige CVEs do OpenSSL/Alpine (ex.: CVE-2026-45447 em libcrypto3/libssl3)
RUN apk upgrade --no-cache \
  && rm -rf /usr/local/lib/node_modules/npm \
            /usr/local/bin/npm \
            /usr/local/bin/npx \
            /usr/local/lib/node_modules/corepack \
            /usr/local/bin/corepack \
            /opt/yarn* \
  || true

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./

EXPOSE 3000
USER node
CMD ["node", "server.js"]
