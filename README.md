


1. Instalar dependencia: 
   npm install

2. Crear el archivo .env en la raíz del proyecto con el siguiente contenido:

   DATABASE_URL=postgresql://trabajito:trabajito@localhost:5433/trabajito_db
   
   PORT=3000


4. Usar la imagen de Docker para PostgreSQL

   - En terminal, ejecutar: docker load -i app.tar    (el app.tar se lo paso yo)
   - Verificar que la imagen se haya cargado correctamente: docker images
   - Luego, ejecutar en la carpeta del proyecto: docker-compose up -d
   - Para verificar que el contenedor esté corriendo: docker ps
   - Aqui se creará la carpeta Postgres automaticamente en la raiz


5. Crear la base de datos y las tablas:

   - Ejecutar: npx prisma migrate dev --name init
   - Esto creará la base de datos y las tablas necesarias según el esquema definido en schema.prisma.


6. Iniciar el servidor:
   npm run dev

7. TablePlus, para verificar la base de datos: Crear una nueva conexión con los siguientes datos:
   - Host: localhost
   - Port: 5433   (este lo puede cambiar en el docker-compose.yml)
   - User: trabajito
   - Password: trabajito
   - Database: trabajito_db

8. Probar la API:
   - Usar Postman o cualquier otra herramienta para hacer solicitudes HTTP a la API.
   - La API estará disponible en http://localhost:3000 (o el puerto que hayas configurado en el archivo .env).
