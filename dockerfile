FROM hub.agcs.agetic.gob.bo/dockerhub-proxy/library/node:16 AS build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .

USER node
RUN npm set registry https://registry.agcs.agetic.gob.bo/
RUN npm set strict-ssl false
RUN npm ci
RUN npm run build 

FROM hub.agcs.agetic.gob.bo/dockerhub-proxy/library/nginx:1.23-alpine AS release
RUN mkdir /app
COPY  --from=build /home/node/app/dist /app
COPY .gitlab/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
