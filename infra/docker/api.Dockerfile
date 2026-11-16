# syntax=docker/dockerfile:1.7
# Salaam API — multi-stage build. Context: repository root.
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH CI=true
RUN corepack enable
WORKDIR /repo

# 1) Dependencies (cached while lockfile is unchanged)
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/domain/package.json packages/domain/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @salaam/api...

# 2) Build TypeScript
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/domain packages/domain
COPY apps/api apps/api
RUN pnpm --filter @salaam/domain build && pnpm --filter @salaam/api build

# 3) Clean production-only dependency tree (no compilers, test tools or CLIs)
FROM base AS prod-deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/domain/package.json packages/domain/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter @salaam/api...

# 4) Runtime: compiled JS + production node_modules, non-root
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=prod-deps --chown=node:node /repo/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/packages/domain/package.json ./packages/domain/package.json
COPY --from=build --chown=node:node /repo/packages/domain/dist ./packages/domain/dist
COPY --from=prod-deps --chown=node:node /repo/packages/domain/node_modules ./packages/domain/node_modules
COPY --from=build --chown=node:node /repo/apps/api/package.json ./apps/api/package.json
COPY --from=prod-deps --chown=node:node /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=node:node /repo/apps/api/dist ./apps/api/dist
COPY --from=build --chown=node:node /repo/apps/api/drizzle ./apps/api/drizzle
WORKDIR /repo/apps/api
USER node
EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.API_PORT||4000)+'/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Migrations run in the separate one-shot `migrate` service (compose.yaml), not on every start.
CMD ["node", "dist/main.js"]
