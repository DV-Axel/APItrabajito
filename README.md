


1. Requisitos previos
   - Node.js >= 18
   - npm >= 9
   - PostgreSQL >= 17
   - TablePlus (opcional, para gestionar la base visualmente)


2. Instalar PostgreSQL
   - Descargarlo: https://www.postgresql.org/download/windows/
   - Ejecutar el instalador:
      - Ususario: postgres
      - Contraseña: elegir una y anotarla
      - Puerto: 5432 (por defecto)
      - Finalizar la instalación y asegurar que el servicio PostgreSQL está corriendo


3. Crear la base de datos para el proyecto y conectarse
   - Usando la consola:
      & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432
   - y dentro de psql:
      CREATE DATABASE trabajito_db;
      \q
   - Esto crea la base de datos "trabajito_db"

   Usando TablePlus
   - Crear una nueva conexión PostreSQL:
      - Host: localhost
      - Port: 5432
      - User: postgres
      - Password: la que configuraste
      - Database: trabajito_db


4. Clonar el repositorio:
   - git clone <URL_DEL_REPO>
   - cd <CARPETA_DEL_REPO>
   - Instalar dependencias: npm install
   - Crear el archivo .env en la raiz del proyecto
      - DATABASE_URL:postgresql://postgres:TU_CONTRASEÑA@localhost:5432/trabajito_db?schema=public
      - PORT:3000


5. Aplicar migraciones existentes
   Como el esquema ya fue creado por el repositorio, no es necesario generar nuevas migraciones.
   - npx prisma generate  --> genera el cliente de Prisma para conectarse a la base de datos.
   - npx prisma migrate deploy  --> aplica las migraciones existentes en la base de datos.

   ALTERNATIVA
   Si quieres hacer tu migración, borrar la carpeta "migrations":  prisma/migrations y ejecutar:
   - npx prisma generate
   - npx prisma migrate dev --name-init


6. Levantar el backend
   - npm run dev   --> deberia conectarse automaticamente a trabajito_db


7. Verificar tablas y datos
   - Abrir TablePlus --> refrescar "trabajito_db" --> deberia aparecer las tablas creadas por las migraciones.
