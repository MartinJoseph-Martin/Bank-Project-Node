var express = require('express');
var router = express.Router();
var db = require('../config/db')

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.query("select * from bank_details b inner join bank_name n on b.bank_nameid=n.bank_nameid", function (err, result) {
        res.send(result)
    })
});

router.get('/single/:id', function (req, res, next) {
    db.query("select * from bank_details b inner join bank_name n on b.bank_nameid=n.bank_nameid and b_id=?", [req.params.id], function (err, result) {
        res.send(result)
    })
});

router.get('/customers/:id',function(req,res){
    db.query("select * from customer_details c inner join account_details a on a.cust_id=c.cust_id and a.b_id=?",[req.params.id],function(err,result){
        if(err)throw err
        res.send(result)
    })
})

router.get('/totaldeposite/:id',function(req,res){
    db.query("select count(*) total_customers,sum(acc_balance) total_deposite from account_details where b_id=?",[req.params.id],function(err,result){
        if(err)throw err
        res.send(result)
    })
})

router.get('/bankname',function(req,res){
    db.query("select * from bank_name",function(err,result){
        res.send(result)
    })
})

router.post("/newbank",function(req,res){
    var data=req.body;
    db.query("insert into bank_name values(?,?)",[null,data.bank_name],function(err){
        if(err)throw err
        res.send({message:"new bank added"})
    })
})

router.post('/newbranch', function (req, res) {
    data = req.body;
    db.query("insert into bank_details values (?,?,?,?)", [null, data.ifsc_code,data.bank_nameid,data.branch], function (err, result) {
        if (err) throw err
        res.send({message:"new branch added"})
    })
    
})

router.put('/:id',function(req,res){
    data=req.body;
    db.query("update bank_details set ifsc_code=?,bank_nameid=?,branch=? where b_id=?",[data.ifsc_code,data.bank_nameid,data.branch,req.params.id],function(err){
        if(err) throw err
        res.send({message:"branch data updated"})
    })
})



router.delete('/:id',function(req,res){
    db.query("delete from bank_details where b_id=?",[req.params.id],function(err){
        if(err)throw err
        res.end({message:"deleted "})
    })
})

module.exports = router;