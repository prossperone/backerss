FROM nginx:alpine

# Copiar configuración optimizada para entornos cloud
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos del sitio
COPY index.html /usr/share/nginx/html/
COPY auth.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
