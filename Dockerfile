FROM node:16.13 as base

RUN mkdir /app 
WORKDIR /app 

###########

FROM base as yarn-app 

COPY . .
RUN yarn install \
   && yarn build

###########

FROM nginx:1.17-alpine AS web

RUN apk upgrade --update && apk add --no-cache \
    curl \
    bash \
    && rm -f /var/cache/apk/*

RUN rm /etc/nginx/conf.d/default.conf
COPY .docker/nginx.conf /etc/nginx/conf.d
COPY --from=yarn-app /app/dist /usr/share/nginx/html

ARG COMMIT_SHA
ENV COMMIT_SHA="${COMMIT_SHA}"

ARG _PROJECT_NAME
ENV _PROJECT_NAME="${_PROJECT_NAME}"

ARG _PROJECT_PATH
ENV _PROJECT_PATH="${_PROJECT_PATH}"

ARG _COMMIT_NAME
ENV _COMMIT_NAME="${_COMMIT_NAME}"

ARG GITLAB_TOKEN
ENV GITLAB_TOKEN="${GITLAB_TOKEN}"

ARG _PROJECT_ID
ENV _PROJECT_ID="${_PROJECT_ID}"

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
