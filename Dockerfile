FROM repo.bigdata.local/nginx:1.16.0-alpine

LABEL MAINTAINER NAMNT96
ENV http_proxy=http://proxy.hcm.fpt.vn:80
ENV https_proxy=http://proxy.hcm.fpt.vn:80
ENV no_proxy=127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,repo.bigdata.local,.cluster.local,*.local,172.27.11.210,172.27.11.211,172.27.11.230,172.27.11.231,172.24.178.0/24

RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/conf.d/default.conf

COPY build /usr/share/nginx/html  
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD [ "nginx", "-g","daemon off;" ]

