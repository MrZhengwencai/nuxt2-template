FROM registry-vpc.cn-shenzhen.aliyuncs.com/stage_test/alinode:5.13.0-alpine
ARG HOME=/root
ENV TZ=Asia/Shanghai
ARG PATH_TYPE=prod
ENV PATH_TYPE=$PATH_TYPE
WORKDIR /app
COPY alinode.config.json $HOME/app-config.json
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD [ "npx", "pm2-runtime", "start", "pm2.json" ]
