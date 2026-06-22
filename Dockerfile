FROM nginx:alpine

# Copiamos tus archivos modulares del frontend
COPY index.html /usr/share/nginx/html/
COPY auth.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Forzamos a Nginx a escuchar en el puerto dinámico asignado por Spaceship
CMD ["sh", "-c", "sed -i 's/listen[[:space:]]*80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
