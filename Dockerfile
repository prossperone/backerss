# 1. Usamos una imagen base oficial de Nginx corriendo sobre Alpine Linux (Rápida y ultra-ligera)
FROM nginx:alpine

# 2. Copiamos todos nuestros archivos modulares del frontend al directorio donde Nginx sirve contenido
COPY index.html /usr/share/nginx/html/
COPY auth.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# 3. Configuramos Nginx para que escuche en el puerto dinámico que Spaceship le asigne mediante variables de entorno ($PORT)
CMD ["sh", "-c", "sed -i 's/listen[[:space:]]*80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
