# ---------- Stage 1 : build (Node 22 Alpine) ----------
FROM node:22-alpine AS build

WORKDIR /app

# package-lock.json est copie avec package.json pour que `npm ci`
# puisse etre mis en cache et ne soit rejoue que si les deps changent.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build


# ---------- Stage 2 : runtime (Nginx Alpine) ----------
FROM nginx:alpine

# Configuration Nginx pour une SPA React/Vite + React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Artefact de build Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
