# Etapa de construção
FROM node:18 as build

# Instalar ferramentas necessárias
RUN apt-get update && apt-get install -y \
    lsb-release \
    gcc \
    make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Definir variáveis de ambiente
ENV NIXPACKS_PATH=/app/node_modules/.bin:$NIXPACKS_PATH

# Copiar arquivos para o contêiner
COPY . /app/.

# Instalar dependências
RUN --mount=type=cache,id=s/59b197b6-f382-4a46-be1b-3e2f62995e8a-/root/local/share/pnpm/store/v3,target=/root/.local/share/pnpm/store/v3 \
    pnpm i --frozen-lockfile

# Etapa de build
RUN pnpm run build

# Etapa final
FROM node:18 as final

WORKDIR /app

# Copiar arquivos necessários da etapa de construção
COPY --from=build /app /app
COPY --from=build /app/node_modules /app/node_modules

# Definir comando de inicialização
CMD ["pnpm", "run", "start"]
