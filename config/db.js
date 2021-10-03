var mysql=require('mysql')

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'welcome@123',
    database:'bank'
})

connection.connect(function(err){
    if(err) throw err
    console.log("connection success")
})

module.exports=connection;