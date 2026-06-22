# 1. Usamos la imagen oficial de Nginx sobre Alpine
FROM nginx:alpine

# 2. Copiamos todos los archivos del frontend al directorio por defecto
COPY index.html /usr/share/nginx/html/
COPY auth.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# 3. Reescribimos la configuración para usar la variable $PORT de manera nativa sin romper el shell
CMD echo "listen ${PORT:-80};" > /etc/nginx/default_port.conf && \
    sed -i 's/listen[[:space:]]*80;/include \/etc\/nginx\/default_port.conf;/g' /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
