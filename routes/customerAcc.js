var express = require('express');
var router = express.Router();
var db = require('../config/db')

router.get('/customer', function (req, res) {
    db.query("select * from customer_details", function (err, result) {
        if (err) throw err
        res.send(result)
    })
})

router.get('/customer/:id', function (req, res) {
    db.query("select * from customer_details where cust_id=?", [req.params.id], function (err, result) {
        if (err) throw err
        res.send(result)
    })
})

router.get('/account', function (req, res, next) {
    db.query("select c.cust_id,c.cust_name,c.place,c.phone,c.mail,a.acc_no,t.account_type,a.acc_balance,a.acc_status,b.ifsc_code,n.bank_name,b.branch from customer_details c inner join account_details a on c.cust_id=a.cust_id inner join account_type t on a.acc_typeid=t.account_typeid inner join bank_details b on a.b_id=b.b_id inner join bank_name n on b.bank_nameid=n.bank_nameid ", function (err, result) {
        res.send(result)
    })
});

router.get('/account/:id', function (req, res, next) {
    db.query("select c.cust_id,c.cust_name,c.place,c.phone,c.mail,a.acc_no,t.account_type,a.acc_balance,a.acc_status,b.ifsc_code,n.bank_name,b.branch from customer_details c inner join account_details a on c.cust_id=a.cust_id and c.cust_id=? inner join account_type t on a.acc_typeid=t.account_typeid inner join bank_details b on a.b_id=b.b_id inner join bank_name n on b.bank_nameid=n.bank_nameid ", [req.params.id], function (err, result) {
        res.send(result)
    })
});

router.get('/accounttype',function(req,res){
    db.query("select * from account_type",function(err,result){
        res.send(result)
    })
})

router.post('/newcustomer', function (req, res) {
    data = req.body;
    db.query("insert into customer_details values (?,?,?,?,?,?)", [null, data.cust_name, data.place, data.phone, data.mail,data.password], function (err, result) {
        
        if (err) throw err
        db.query("select * from customer_details order by cust_id desc limit 1", function (err, result) {
            db.query("insert into account_details values (?,?,?,?,?,?)", [null, result[0].cust_id, data.acc_typeid, data.acc_balance, data.b_id, data.acc_status], function (err, result) {
                if (err) throw err
            })
        })
        res.send({ message: "success" })
        
    })
})

router.post('/oldcustomer/:id', function (req, res) {
    data = req.body;
    db.query("select * from customer_details where cust_id=? ", [req.params.id], function (err, result) {
        if (result.length != 0) {
            db.query("insert into account_details values (?,?,?,?,?,?)", [null, req.params.id, data.acc_typeid, 0, data.b_id,1], function (err, result) {
                if (err) throw err
                res.send({ message: "success" })
            })
        }
        else {
            res.send({ message: "coustomer does not exist" })
        }
    })

})

router.put('/:id', function (req, res) {
    data = req.body;
    console.log("hello",req.body)
    db.query("update customer_details set cust_name=?,place=?,phone=?,mail=?,password=? where cust_id=?", [data.cust_name, data.place, data.phone, data.mail,data.password, req.params.id], function (err) {
        try {
            if (err) throw err
            res.send({ message: "updated successfully" })
        }
        catch {
            res.status(500).send({ message: "failure" })
        }
    })

})


router.delete('/customer/:id', function (req, res) {
    db.query("delete from customer_details where cust_id=?", [req.params.id], function (err) {
        if (err) throw err
        res.send({ message: "deleted" })
    })
})

router.delete('/account/:id/:accno', function (req, res) {
    db.query("delete from account_details where cust_id=? and acc_no=?", [req.params.id, req.params.accno], function (err) {
        if (err) throw err
        res.send({ message: "deleted" })
    })
})

module.exports = router;