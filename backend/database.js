const sqlite3 = require('sqlite3').verbose();

// O nome do arquivo do banco de dados. Ele será criado na pasta 'backend'.
const dbFile = './guilds.db';

// Conecta ao banco de dados SQLite. O arquivo será criado se não existir.
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        return console.error("Erro ao abrir o banco de dados:", err.message);
    }
    console.log(`Conectado ao banco de dados SQLite em '${dbFile}'`);
});

// Envolve a criação das tabelas em db.serialize para garantir que rodem em ordem
db.serialize(() => {
    // Tabela para as Guildas
    // Usa crases (`) para permitir que a string ocupe várias linhas
    db.run(`
        CREATE TABLE IF NOT EXISTS guilds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            owner_id TEXT NOT NULL,
            points INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) return console.error("Erro ao criar tabela 'guilds':", err.message);
        console.log("Tabela 'guilds' verificada/criada com sucesso.");
    });

    // Tabela para os Membros das Guildas
    db.run(`
        CREATE TABLE IF NOT EXISTS members (
            user_id TEXT NOT NULL,
            guild_id INTEGER NOT NULL,
            PRIMARY KEY (user_id),
            FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) return console.error("Erro ao criar tabela 'members':", err.message);
        console.log("Tabela 'members' verificada/criada com sucesso.");
    });
});

module.exports = db;