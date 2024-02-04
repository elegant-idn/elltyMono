FROM public.ecr.aws/nginx/nginx:alpine

RUN rm -f /etc/nginx/conf.d/*
ADD nginx.conf /etc/nginx/nginx.conf
CMD nginx -g "daemon off;"
