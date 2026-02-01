const db = require('../database');

const customer={
    getAll:function(callback){
        return db.query("SELECT * FROM customer", callback);
    },
    getOne:function(idcustomer, callback){
        return db.query("SELECT * FROM customer where idcustomer=?", [idcustomer], callback);
    },
    add:function(customer, callback){
        return db.query("INSERT INTO customer (fname, lname, street_address, city) VALUES (?,?,?,?)", 
            [customer.fname, customer.lname, customer.street_address, customer.city], 
            callback
        );
    },
    update:function(customer, idcustomer, callback){
        return db.query(
            "UPDATE customer SET fname=IFNULL(?, fname), lname=IFNULL(?, lname), street_address=IFNULL(?, street_address), city=IFNULL(?, city) where idcustomer=?", 
            [customer.fname, customer.lname, customer.street_address, customer.city, idcustomer], 
            callback
        );
    },
    delete:function(idcustomer, callback){
        return db.query("DELETE FROM customer WHERE idcustomer=?", [idcustomer], callback);
    },
};

module.exports=customer;