# Use a imagem oficial do Node.js
FROM node:18

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos de dependências do projeto para o contêiner
COPY package.json yarn.lock ./

# Instale as dependências do projeto usando Yarn
RUN yarn install

# Copie todos os arquivos do projeto para o contêiner
COPY . .

# Execute o build do projeto
RUN yarn build

# Defina o comando para iniciar o servidor
CMD ["node", "dist/server.js"]
