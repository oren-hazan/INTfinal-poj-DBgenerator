const config = require("config");
const db_connect = config.get("db");

//############# conecting PostgreSQL ###############

const connectedKnex = require("knex")({
    client: db_connect.client,
    version: db_connect.version,
    connection: {
      host : db_connect.connection.host,
      user : db_connect.connection.user,
      password : db_connect.connection.password,
      database : db_connect.connection.database
    }
  });

module.exports = connectedKnex;