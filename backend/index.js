const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Expense Management API is running!" });
});

// --- API ENDPOINTS WILL GO HERE ---

// 1. Employee: Submit a new expense
app.post("/expenses", (req, res) => {
    const { employee_id, category, description, amount, currency, date } = req.body;
    const sql = `INSERT INTO Expenses (employee_id, category, description, amount, currency, date, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')`;
    const params = [employee_id, category, description, amount, currency, date];
    
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, ...req.body, status: 'pending' }
        });
    });
});

// 2. Employee: View their expense history
app.get("/expenses/employee/:id", (req, res) => {
    const sql = "SELECT * FROM Expenses WHERE employee_id = ?";
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.json({ "message": "success", "data": rows });
    });
});

// 3. Manager: View expenses waiting for their approval
app.get("/expenses/manager/:managerId", (req, res) => {
    const sql = `
        SELECT E.*, U.name as employee_name 
        FROM Expenses E
        JOIN Users U ON E.employee_id = U.id
        WHERE E.status = 'pending' AND E.employee_id IN (SELECT id FROM Users WHERE manager_id = ?)
    `;
    db.all(sql, [req.params.managerId], (err, rows) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.json({ "message": "success", "data": rows });
    });
});

// 4. Manager: Approve or Reject an expense
app.put("/expenses/:id/status", (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending_finance'].includes(status)) {
        return res.status(400).json({ "error": "Invalid status value." });
    }
    const sql = `UPDATE Expenses SET status = ? WHERE id = ?`;
    db.run(sql, [status, req.params.id], function(err) {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.json({ "message": "success", "changes": this.changes });
    });
});

// --- NEW LOGIN ENDPOINT ---
app.post("/login", (req, res) => {
    const { userId } = req.body;
    const sql = "SELECT * FROM Users WHERE id = ?";
    db.get(sql, [userId], (err, user) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        if (user) {
            res.json({ "message": "success", "data": user });
        } else {
            res.status(404).json({ "error": "User not found" });
        }
    });
});

// --- NEW FINANCE ENDPOINT ---
app.get("/expenses/finance", async (req, res) => {
    const sql = `
        SELECT E.*, U.name as employee_name 
        FROM Expenses E
        JOIN Users U ON E.employee_id = U.id
        WHERE E.status = 'pending_finance'
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.json({ "message": "success", "data": rows });
    });
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});