FROM node:20

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3000"]