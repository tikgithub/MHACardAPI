var express = require('express');
var router = express.Router();
var mssql = require('../db/mssql');
var exception = require('../Service/exceptionService');
var cardService = require('../Service/cardService');
var authMiddleware = require('../Service/authMiddleware');
require('dotenv').config();
const {
    body,
    validationResult,
    oneOf,
    check
} = require('express-validator');

//main route is /card
router.get('/:id',authMiddleware.AuthenAPI ,function (req, res, next) {
    let con = new mssql.Request();
    let card_id = req.params.id;
    con.input("card_id", card_id)
    con.query(`SELECT 
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
    p.print_status as 'PrintState'
    FROM printinglist p inner join Document d on p.doc_id = d.id
    WHERE d.print_status='COMPLETED' and p.card_status='GENERATED_OK' and p.atm_number!='' and p.id=@card_id`, function (err, result) {
        if (err) {
            res.status(503);
            res.send({
                "Message": "Server error, Please contact LVB Card center " + process.env.SUPPORT_CENTER_TEL,
                "Status": 503
            });
            console.log(err);
        }
        res.status(200);
        res.send({
            'card': result.recordset
        });
    });
});

//Update print status
function updateCardRequire() {
    return [
        body('status').notEmpty().withMessage("var 'status' could not empty"),
        oneOf([check('status').isIn(['PRINTING', 'SUCCESS']).withMessage("Possible values: 'PRINTING', 'SUCCESS'}")]),
        body('document_id').notEmpty().withMessage("var 'document_id' could not empty")
    ];
}
router.put('/:card_id', authMiddleware.AuthenAPI, updateCardRequire(), async (req, res, next) => {
    try {
        //Validator section
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        //End validator section

        //Get the document id from doc number
        let doc_number =await cardService.getDocumentByDocumentNumber(req.body.document_id);
        if(doc_number.length == 0){
            res.status(404);
            res.send({'Message':'Document Number Do Not Exist'});
        }
        //Extract the document id
        let doc_id = doc_number[0].id;
        //Update the printing service
        let result = await cardService.updaetCardPrintingStatus(doc_id, req.params.card_id,req.body.status);
       
        if(result.rowsAffected > 0){
            res.status(200);
            res.send({'Message':'Success'});
        }else{
            res.status(503);
            res.send({"Message":`Not success, Please check Card ID: ${req.params.card_id} may not in Document number: ${req.body.document_id}`});
        }

    } catch (error) {
        console.log(error);
        exception.sendError(res);
    }
});

module.exports = router;