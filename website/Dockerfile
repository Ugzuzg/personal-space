# syntax=docker/dockerfile:1.7-labs

# =============================================================================
# BASE STAGE
# Output: Common env vars and `tini` entrypoint app
FROM node:24-alpine AS base

ENV NODE_ENV=production
ENV TMPDIR=/tmp/personal-space
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"

RUN mkdir -p $TMPDIR && chown node:node -R $TMPDIR && chmod -R 775 $TMPDIR

RUN corepack enable
RUN apk add --no-cache tini && \
  apk --no-cache add ca-certificates && update-ca-certificates

WORKDIR /app


# =============================================================================
# MANIFESTS STAGE
# Output: A set of files that pnpm can use to install dependencies, with all non-essential fields removed
FROM base AS manifests
WORKDIR /usr/src
RUN apk add --no-cache jq
COPY --link --chmod=0755 <<'EOF' /bin/slim-manifest
#!/bin/sh
CONTENTS=$(jq 'pick(
    .name, .version, .private, .packageManager, .engines, .bin, .peerDependenciesMeta,
    .dependencies, .devDependencies, .peerDependencies, .optionalDependencies
) | del(.. | nulls)' $1)
echo ${CONTENTS} > $1
EOF
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
COPY --link --parents **/package.json ./
RUN find . -name package.json -exec slim-manifest {} \;


# =============================================================================
# BUILD STAGE
# Output: A stage with the JavaScript files compiled from TypeScript sources
FROM base AS build
WORKDIR /usr/src
COPY --from=manifests /usr/src ./
RUN --mount=type=secret,id=npm,target=/app/.npmrc --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install \
  --prefer-offline \
  --frozen-lockfile \
  --filter=dependency-references \
  --filter=website...
COPY . ./

RUN cd website && pnpm build

# =============================================================================
# RELEASE STAGE
# Output: final stage (compiled code + dependencies) used for actual execution
FROM base AS release

COPY --from=build /usr/src/website/.output ./

USER 1000

EXPOSE 4000

ENTRYPOINT ["tini", "--"]

CMD node ./server/index.mjs
