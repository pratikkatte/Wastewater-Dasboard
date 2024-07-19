# Use an official node runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files

COPY package*.json ./ 

# Install the app dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose port 5173 (default port for Vite)
EXPOSE 5173

# Run the Vite app
CMD ["yarn", "run", "dev", "--", "--host"]