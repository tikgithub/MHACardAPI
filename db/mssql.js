var mssql = require('mssql');
// config for your database
var config = {
    user: 'sa',
    password: '123456',
    server: '127.0.0.1', 
    database: 'mhacard' ,
    trustServerCertificate: true,
    encrypt: false
};

mssql.connect(config,function(err){
    if(err) console.log(err);
})

module.exports = mssql;