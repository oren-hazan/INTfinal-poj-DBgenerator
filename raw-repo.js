const connectedKnex = require("./knex-connector");

function getRawResult(raw_query) {
    return connectedKnex.raw(raw_query);
}

module.exports = { getRawResult }