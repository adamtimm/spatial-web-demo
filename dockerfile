FROM node:10

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./ ./
RUN npm run build
RUN npm install -g serve


EXPOSE 5000
CMD [ "serve", "build"]
