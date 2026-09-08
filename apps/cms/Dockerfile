FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/cms/package.json apps/cms/package.json
RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
WORKDIR /workspace
COPY apps/cms apps/cms
RUN pnpm --filter cms build

FROM base AS runner
WORKDIR /app/apps/cms
ENV NODE_ENV=production

COPY --from=builder /workspace/apps/cms ./
RUN mkdir -p .tmp public/uploads

EXPOSE 1337
CMD ["pnpm", "start"]
FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/cms/package.json apps/cms/package.json
RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
WORKDIR /workspace
COPY apps/cms apps/cms
RUN pnpm --filter cms build

FROM base AS runner
WORKDIR /app/apps/cms
ENV NODE_ENV=production

COPY --from=builder /workspace/apps/cms ./
RUN mkdir -p .tmp public/uploads

EXPOSE 1337
CMD ["pnpm", "start"]
