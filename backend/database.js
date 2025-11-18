const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./guilds.db', (err) => {
if (err) {
console.error("Erro ao abrir o banco de dados", err.message);
} else {
console.log("Conectado ao banco de dados SQLite.");
db.serialize(() => {
// Tabela para as Guildas
db.run(CREATE TABLE IF NOT EXISTS guilds ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, owner_id TEXT NOT NULL, points INTEGER DEFAULT 0 ));
code
Code
// Tabela para os Membros das Guildas
        db.run(`CREATE TABLE IF NOT EXISTS members (
            user_id TEXT NOT NULL,
            guild_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, guild_id),
            FOREIGN KEY (guild_id) REFERENCES guilds(id)
        )`);
        console.log("Tabelas verificadas/criadas com sucesso.");
    });
}
});
module.exports = db;