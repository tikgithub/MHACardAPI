var express = require('express');
var router = express.Router();
var mssql = require('../db/mssql');
require('dotenv').config();
var authMiddleware = require('../Service/authMiddleware');
//response print data 
router.get('/:doc_id', authMiddleware.AuthenAPI,function (req, res, next) {
    var con = new mssql.Request();
    let doc_id = req.params.doc_id;
    con.input("doc_id", doc_id);
    con.query(`
    SELECT 
    p.Id,
    p.IdEmployee as EmpId, 
    Upper(LEFT(p.EnLname,1)) + Lower(Substring(p.EnLname,2, Len(p.EnLname))) as Firstname, 
    Upper(p.EnLName) as Lastname,
    p.Sex,
    convert(varchar,p.dob,103) as DOB,
    convert(varchar,p.datepermanent,103) as DatePermanent,
    p.social_card_number as SocialCardNumber,
    convert(varchar,p.issue_date,103) as IssueDate,
    p.atm_number as CardNumber,
    p.Photo,
    p.print_status as PrintState
    FROM printinglist p inner join Document d on p.doc_id = d.id and d.doc_number = @doc_id 
    WHERE d.print_status='COMPLETED' and p.card_status='GENERATED_OK' and p.atm_number!='' `, function (err, result) {
        if (err){
            res.status(503);
            res.send({"Message":"Server error, Please contact LVB Card center " + process.env.SUPPORT_CENTER_TEL,"Status":503});
            console.log(err);
        } 
        var data = (result.recordset)
        res.send({'PrintCards':data});
    });

});


module.exports = router;