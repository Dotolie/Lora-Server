// routes/sensing.js

var express = require("express");
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var pool = mysql.createPool(dbconfig);

pool.getConnection(function(err, connection) {
    if(err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
    connection.release();
});

router.get('/', function(req, res) {
    pool.getConnection(function(err, connection) {
        if(!err) {
            var sql = "SELECT * FROM tb_sensors ORDER BY IDX DESC LIMIT 30";
            connection.query( sql, function( err, rows) {
                if( err) console.error( "err=" + err);
        
//                console.log('the row : ', rows);
        
                res.render("contacts/index", {rows:rows?rows:{}});
            });
        }
        connection.release();  
    });
});

router.get("/new", function(req, res) {
    res.render("contacts/new");
});

router.get('/read/:ia', function(req, res) {
    pool.getConnection(function(err, connection) {
        if(!err) {
            var sql = "SELECT * from tb_sensors WHERE IA="+req.params.ia +" LIMIT 30";
            connection.query(sql, function( err, rows) {
                if ( err ) 
                    throw err;
                    
        //        console.log('The solution is: ', rows);
                res.render("contacts/index", {rows:rows?rows:{}});
            });
        }
        connection.release();
    });
});

router.get('/:id', function(req, res) {
    pool.getConnection(function(err, connection) {
        if(!err) {
            var sql = "SELECT * from tb_sensors WHERE IDX="+req.params.id;
            connection.query(sql, function( err, rows) {
                if ( err ) 
                    throw err;
                    
                console.log('The solution is: ', rows);
                res.render("contacts/show", {rows:rows});
            });
        }
        connection.release();
    });
});

router.get('/:id/edit', function(req, res) {
    pool.getConnection(function(err, connection) {
        if(!err) {
            var sql = "SELECT * from tb_sensors WHERE IDX="+req.params.id;
            connection.query(sql, function( err, rows) {
                if ( err ) 
                    throw err;
                    
                res.render("contacts/edit", {rows:rows});
            });
        }
        connection.release();
    });
});


router.post("/new", function(req, res) {
    console.log(req.headers);

    pool.getConnection(function(err, connection) {
        if(!err) {
            var data = [req.body.RSD, req.body.IA, req.body.RSU, req.body.SEQ, req.body.REGDATE,
                 req.body.CO2, req.body.RH, req.body.TEMP, 
                 req.body.PM1P0, req.body.PM2P5, req.body.PM4P0, req.body.PM10P0,
                 req.body.BATT ];
            var sql = "INSERT INTO tb_sensors(IDX, RSd, IA, RSu, SEQ, REGDATE, CO2, RH, TEMP, PM1P0, PM2P5, PM4P0, PM10P0, BATT) \
                        VALUES(null,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            
            connection.query(sql, data, function(err, rows) {
                if( err) {
                    console.error("err="+err);
                    res.writeHead(403,{'Content-Type':'text/html'});
                    res.end('Send Fail');
                }
                else { 
                    console.log("data="+data);
                    res.writeHead(201, {'Content-Type':'text/html'});
                    res.end('<html><meta http-equiv="refresh" content="0; url=./"></meta></html>');
                }
                
            });
        }
        connection.release();
    });
});

module.exports = router;
