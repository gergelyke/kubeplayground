FROM node:latest
EXPOSE 8080
COPY server.js .
COPY version .
# COPY healthchecks healthchecks
COPY node_modules node_modules

# TODO: Test with npm start instead
# Must use exec form otherwise node will not get SIGTERM!
CMD ["node",  "--trace_gc", "server.js"]

# DO NOT USE SHELL FORM!
# CMD node --trace_gc server.js