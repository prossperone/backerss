FROM nginx:alpine

# Copiamos tus archivos modulares del frontend
COPY index.html /usr/share/nginx/html/
COPY auth.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Exponemos el puerto dinámico de Hyperlift
CMD ["sh", "-c", "sed -i \"s/listen 80;/listen ${PORT:-8080};/g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
