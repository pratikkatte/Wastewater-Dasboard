FROM node:22 AS build

WORKDIR /app

# copy taxonium_data_handling
COPY taxonium_data_handling ./taxonium_data_handling

# copy taxonium_component
COPY taxonium_component ./taxonium_component

# Backend Setup
COPY taxonium_backend ./taxonium_backend
WORKDIR /app/taxonium_backend
RUN yarn install

# Frontend Setup
COPY dashboard /app/dashboard
WORKDIR /app/dashboard
RUN yarn run preinstall && yarn install && yarn build


# Production image
FROM nginx:alpine

RUN apk add --no-cache nodejs yarn

# Copy built frontend
COPY --from=build /app/dashboard/dist /usr/share/nginx/html
    
# Copy nginx config
COPY nginx/nginx-react.conf /etc/nginx/conf.d/default.conf
    
# Copy backend
COPY --from=build /app/taxonium_backend /taxonium_backend

WORKDIR /app

# Expose backend and frontend ports
EXPOSE 8080 5173

WORKDIR /taxonium_backend

ENV DATA_FILE=/data/taxonium.jsonl
ENV NODE_MEMORY_LIMIT=4096


# Expose NGINX port
EXPOSE 80

# Start both backend and NGINX
# CMD node server.js --port 8080 --data_file $DATA_FILE & nginx -g "daemon off;"
CMD ["sh", "-c", "node --max-old-space-size=$NODE_MEMORY_LIMIT server.js --port 8080 --data_file $DATA_FILE & nginx -g 'daemon off;'"]
