FROM nginx:alpine

# 1. Creamos la configuración interna de Nginx directamente para que no dependa de archivos externos
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    server_name localhost; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page   500 502 503 504  /50x.html; \
    location = /50x.html { \
        root   /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 2. Copiamos tus archivos modulares de la interfaz del frontend
COPY index.html /usr/share/nginx/html/
COPY auth.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# 3. Modificamos el puerto al vuelo para adaptarlo a la variable dinámica ($PORT) de Spaceship
CMD ["sh", "-c", "sed -i 's/listen[[:space:]]*80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
