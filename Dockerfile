FROM node:18-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

# Create app directory
WORKDIR /dist

# Install app dependencies
COPY package*.json ./

RUN npm ci

# Copy app source code
COPY app ./app
COPY public ./public
COPY lib ./lib
COPY db ./db
COPY .env.local ./.env.local
COPY components ./components
COPY next.config.mjs .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.mjs .
COPY mockdata.js .

# Build static assets
RUN npm run build

# Step 2. Production image, copy all the files and run next
FROM base AS runner

# Create app directory
WORKDIR /dist

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=builder /dist/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /dist/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /dist/.next/static ./.next/static

CMD [ "node", "server.js" ]

