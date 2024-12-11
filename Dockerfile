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

# Instale as dependências do projeto usando pnpm
RUN pnpm install --no-frozen-lockfile

# Copie todos os arquivos do projeto para o contêiner
COPY . .

# Adicione um passo para compilar o código C corretamente
RUN cd node_modules/word2vec && make CFLAGS="-lm"

# Execute o build do projeto
RUN pnpm run build

# Defina o comando para iniciar o servidor
CMD ["node", "dist/server.js"]
