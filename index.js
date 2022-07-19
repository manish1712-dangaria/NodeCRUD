const mysql= require('mysql');
const express = require('express');
var app =express();
const bodyparser =require('body-parser');

app.use(bodyparser.json());

var mysqlConnection=mysql.createConnection({
    host: "127.0.0.1",
    port:"3306",
    user: "root",
    password: "123456",
    database: "employee",
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err){
    console.log('DB connection successful');
    }else{
        console.log('Error in Db connection:'+JSON.stringify(err));
    }
});

app.listen(3000,()=>console.log('Express server is running.........'));

//ALL EMPLOYESS DETAILS
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//ONE EMPLOYEE DETAILS
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @email = ?; \
    CALL usersAddOrEdit(@id,@name,@email);";
    mysqlConnection.query(sql, [emp.id, emp.name, emp.email], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].id);
            });
        else
            console.log(err);
    })
});

//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @email = ?; \
    CALL usersAddOrEdit(@id,@name,@email);";
    mysqlConnection.query(sql, [emp.id, emp.name, emp.email], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});