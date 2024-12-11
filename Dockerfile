# Use a imagem oficial do Node.js
FROM node:18

# Instale ferramentas de construção necessárias
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    make

# Instale pnpm globalmente
RUN npm install -g pnpm

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos de dependências do projeto para o contêiner
COPY package.json pnpm-lock.yaml ./

# Script para instalar as dependências e compilar o node-word2vec
RUN echo '#!/bin/sh' > install.sh && \
    echo 'pnpm install --no-frozen-lockfile || {' >> install.sh && \
    echo 'cd node_modules/node-word2vec && \' >> install.sh && \
    echo 'gcc -lm src/word2vec.c -o bin/word2vec -pthread -O3 -march=native -Wall -funroll-loops -Wno-unused-result && \' >> install.sh && \
    echo 'cd ../../ && \' >> install.sh && \
    echo 'pnpm install --no-frozen-lockfile; }' >> install.sh && \
    chmod +x install.sh && ./install.sh

# Copie todos os arquivos do projeto para o contêiner
COPY . .

# Execute o build do projeto
RUN pnpm run build

# Defina o comando para iniciar o servidor
CMD ["node", "dist/server.js"]
