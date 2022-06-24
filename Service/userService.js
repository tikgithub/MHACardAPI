var mssql = require('mssql');

exports.findUser = function(email, password){
    let con = new mssql.Request();
    con.input("email",email);
    con.input("password",password);
    return new Promise((resovle, reject)=>{
        con.query("select * from APIUser where email = @email and password= @password",function(err, res){
            if(err) return reject(err);
            resovle(res.recordset);
        });
    });
}