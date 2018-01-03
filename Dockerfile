FROM node:latest
EXPOSE 8080
COPY server.js .
COPY version .
CMD node server.js
