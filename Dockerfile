# Actualizacion Forzada del Protocolo Backerss - Rompiendo Cache de Hyperlift
FROM nginx:alpine

# 1. Creamos la configuración interna de Nginx en una sola línea limpia para evitar fallos de sintaxis en el contenedor
RUN printf "server {\n    listen 80;\n    listen [::]:80;\n    server_name localhost;\n    location / {\n        root /usr/share/nginx/html;\n        index index.html index.htm;\n        try_files \$uri \$uri/ /index.html;\n    }\n    error_page 500 502 503 504 /50x.html;\n    location = /50x.html {\n        root /usr/share/nginx/html;\n    }\n}\n" > /etc/nginx/conf.d/default.conf

# 2. Copiamos tus 5 archivos modulares de la interfaz Verde y Oro
COPY index.html /usr/share/nginx/html/
COPY auth.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# 3. Reescribimos el puerto 80 por el puerto dinámico variable ($PORT) que Spaceship exige en tiempo de ejecución
CMD ["sh", "-c", "sed -i 's/listen[[:space:]]*80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
