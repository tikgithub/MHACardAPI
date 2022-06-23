var mssql = require('../db/mssql');


//Function for getting document detail by doc_number
exports.getDocumentByDocumentNumber = function (docnumber) {
    let con = new mssql.Request();
    con.input("docnumber", docnumber);
    return new Promise((resolve, reject) => {
        con.query("select * from Document where doc_number = @docnumber ", (err, res) => {
            if (err) return reject(err);
            resolve(res.recordset);
        })
    })
}

//Function for updateing card detail PRINTING OR SUCCESS
exports.updaetCardPrintingStatus = function (doc_id, card_id,status) {
    let con = new mssql.Request();
   
    return new Promise((resolve, reject) => {
        con.input("doc_id", doc_id);
        con.input("status", status);
        con.input("card_id",card_id);   

        con.query("update PrintingList set print_status = @status where id = @card_id and doc_id =@doc_id ",(err,res)=>{
            if(err) return reject(err);
            resolve(res);
        });
        
    });
}