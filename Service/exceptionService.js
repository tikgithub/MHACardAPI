require('dotenv').config();

exports.sendError = (res)=>{
    res.status(503);
    res.send({"Message":"Server error, Please contact LVB Card center " + process.env.SUPPORT_CENTER_TEL,"Status":503});
}