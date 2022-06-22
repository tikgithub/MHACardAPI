var express = require('express');
var router = express.Router();
var mssql = require('../db/mssql');

//send simple data
router.get('/printinfo/:doc_id', function (req, res, next) {
    var con = new mssql.Request();
    let doc_id = req.params.doc_id;
    con.input("doc_id", doc_id);
    con.query(`select 
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
    p.Photo
    from printinglist p inner join Document d on p.doc_id = d.id and d.doc_number = @doc_id `, function (err, result) {
        if (err) console.log(err);
        var data = (JSON.stringify(result.recordset))
        res.send(data);
    });

});


module.exports = router;