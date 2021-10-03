var express = require('express');
var router = express.Router();
var db = require('../config/db')

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.query("select * from transaction_details t inner join transaction_type p on t.t_type=p.t_type", function (err, result) {
        res.send(result)
    })
});
router.get('/single/:id', function (req, res, next) {
    db.query("select * from transaction_details t inner join transaction_type p on t.t_type=p.t_type and t_id=?", [req.params.id], function (err, result) {
        res.send(result)
    })
});

router.get('/transactiontype',function(req,res){
    db.query("select * from transaction_type",function(err,result){
        if(err) throw err
        res.send(result)
    })
})

router.get('/previoustransaction/:id/:from/:to', function (req, res, next) {
    
    db.query("select * from transaction_details t inner join transaction_type p on t.t_type=p.t_type and acc_no=? and t_date between ? and ?", [req.params.id,req.params.from,req.params.to], function (err, result) {
        res.send(result)
    })
});

router.get('/onestransaction/:id', function (req, res, next) {
    
    db.query("select * from transaction_details t inner join transaction_type p on t.t_type=p.t_type and acc_no=? ", [req.params.id], function (err, result) {
        res.send(result)
    })
});

 

router.post('/', function (req, res) {
    data = req.body;
    db.query("select * from account_details where acc_no=?",[data.acc_no],function(err,result){
        if(result.length!=0){
            db.query("insert into transaction_details values (?,?,?,?,curdate(),?)", [null, data.t_type,data.acc_no,data.amount,data.benef_acc_no], function (err, result) {
                if (err) throw err
                if(data.t_type=='w'){
                    db.query("update account_details set acc_balance=acc_balance-? where acc_no=?",[data.amount,data.acc_no],function(err){
                        if(err)throw err
                    })
                }
                if(data.t_type=='d'){
                    db.query("update account_details set acc_balance=acc_balance+? where acc_no=?",[data.amount,data.acc_no],function(err){
                        if(err)throw err
                    })
                }
                if(data.t_type=='t'){
                    db.query("update account_details set acc_balance=acc_balance-? where acc_no=?",[data.amount,data.acc_no],function(err){
                        if(err)throw err
                    })
                    db.query("update account_details set acc_balance=acc_balance+? where acc_no=?",[data.amount,data.benef_acc_no],function(err){
                        if(err)throw err
                    })
                }
                res.send({message:"transaction successful"})
            })
        }
        else{
            res.send({message:"invalid account number"})
        }
    })
    
})

router.put('/:id',function(req,res){
    data=req.body;
    db.query("update transaction_details set amount=?,benf_acc_no=? where t_id=?",[data.amount,data.benef_acc_no,req.params.id],function(err){
        if(err)throw err
        res.send("updated")
    })
})

router.delete('/:id',function(req,res){
    db.query("delete from transaction_details where t_id=?",[req.params.id],function(err){
        if(err)throw err
        res.end("deleted")
    })
})

module.exports = router;