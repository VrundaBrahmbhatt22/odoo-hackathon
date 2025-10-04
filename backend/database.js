const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "db.sqlite";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                role TEXT,
                manager_id INTEGER,
                FOREIGN KEY (manager_id) REFERENCES Users(id)
            )`, (err) => {
                if (err) console.error("Error creating Users table", err);
                else {
                    console.log("Users table is ready.");
                    seedUsers();
                }
            });

        db.run(`
            CREATE TABLE IF NOT EXISTS Expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER,
                category TEXT,
                description TEXT,
                amount REAL,
                currency TEXT,
                date TEXT,
                status TEXT,
                FOREIGN KEY (employee_id) REFERENCES Users(id)
            )`, (err) => {
                if (err) console.error("Error creating Expenses table", err);
                else console.log("Expenses table is ready.");
            });
    });
}

function seedUsers() {
    const checkSql = `SELECT COUNT(*) as count FROM Users`;
    db.get(checkSql, [], (err, row) => {
        if (row.count === 0) {
            console.log("Seeding users...");
            const insertSql = `INSERT INTO Users (id, name, role, manager_id) VALUES (?, ?, ?, ?)`;
            db.run(insertSql, [1, 'Alice (Manager)', 'manager', null]);
            db.run(insertSql, [2, 'Bob (Employee)', 'employee', 1]);
            db.run(insertSql, [3, 'Charlie (Employee)', 'employee', 1]);
        } else {
            console.log("Users already seeded.");
        }
    });
}

module.exports = db;