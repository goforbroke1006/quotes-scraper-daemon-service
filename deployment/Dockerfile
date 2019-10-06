FROM node:11

WORKDIR /code

COPY ./ /code/
RUN npm run build

ENTRYPOINT [ "node", "/code/dist/index.js" ] 
