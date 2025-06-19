ORM used TypeORM w/ reflect-metadata

# Install a database driver:

npm install mysql --save (you can install mysql2 instead as well)
npm install pg --save
npm install sqlite3 --save
npm install mssql --save
npm install sql.js --save

# To make the Oracle driver work, you need to follow the installation instructions from their site.

npm install oracledb --save

# for SAP Hana

npm i @sap/hana-client
npm i hdb-pool

# for MongoDB (experimental)

npm install mongodb --save

#user.json vscode config
"js/ts.implicitProjectConfig.checkJs": true,

Required

Node JS 21
NPM
Docker Desktop

### DOCKER SETUP

Follows https://docs.docker.com/guides/nodejs/containerize/ to setup docker

# run the application detached from the terminal:

    <!-- Builds, (re)creates, starts, and attaches to containers for a service.
    The docker compose up command aggregates the output of each container -->
    docker compose up --build -d
    OR
    docker build . (just builds the image)

# to stop the application:

     docker compose down OR cntrl + C in terminal

# PgAdmin Access

    To use pgAdmin to access to the postgres container, you have to run this project locally. it cannot be accessed when running externally.
    Local password - postgres123
    Local Email - admin@example.com
