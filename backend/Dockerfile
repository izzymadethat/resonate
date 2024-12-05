# Trying a debian-based image
FROM node:18.20.4-slim
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]