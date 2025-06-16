const jwt = require('jsonwebtoken');

function verifytoken(req,res,next){

    const token=req.header('Authorization');
    if(!token){
        return res.status(401).send({
            error:'Access Denied'
        })
    }
    try{
        const decode=jwt.verify(token,'yourSecretKey');
        console.log(decode);
        req.userId=decode.userId
        next();
    }
    catch(err){
        return res.status(401).send({error:"Access Denied"})
    }
}
module.exports=verifytoken


// pooja
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRiYWRkZDkxMGZiNDhhY2NiMDEwMmEiLCJpYXQiOjE3NDk3OTc0OTgsImV4cCI6MTc0OTgwMTA5OH0.AWhifhPV-XjxdNLXSgrbp9kQxzgplVw_abypblkxTSM

// sudeep
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRiYzJjMzk2OTYyOGMzZDA0ZDQxMjgiLCJpYXQiOjE3NDk3OTc2MjgsImV4cCI6MTc0OTgwMTIyOH0.Fjbu-czjg043eMkFoKOJs2MmDrwbGE3Tn57tzA1EfAA