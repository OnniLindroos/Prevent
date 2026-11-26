# PREVENT image: builds the Next.js app and runs it as a small standalone server.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S prevent && adduser -S prevent -G prevent
COPY --from=build /app/public ./public
COPY --from=build --chown=prevent:prevent /app/.next/standalone ./
COPY --from=build --chown=prevent:prevent /app/.next/static ./.next/static
USER prevent
EXPOSE 3000
CMD ["node", "server.js"]
