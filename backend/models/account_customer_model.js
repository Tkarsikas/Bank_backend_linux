const db = require('../database');

const account_customer = {
    getAll:function(callback){
        return db.query("SELECT * FROM account_customer", callback);
    },
    getOne:function(idaccount_customer, callback){
        return db.query("SELECT * FROM account_customer WHERE idaccount_customer=?", [idaccount_customer],callback);
    },
    add:function (account_customer, callback) {
        return db.query("INSERT INTO account_customer (customer_id, account_id) VALUES (?, ?)", [account_customer.customer_id, account_customer.account_id], callback);
    },
    update:function(account_customer, account_customerid, callback){
        return db.query("UPDATE account_customer SET customer_id=IFNULL(?,account_customer.customer_id), account_id=IFNULL(?, account_customer.account_id) WHERE idaccount_customer=?", [account_customer.customer_id, account_customer.account_id, account_customerid], callback);
    },
    delete:function(account_customerid, callback){
        return db.query("DELETE FROM account_customer WHERE idaccount_customer=?", [account_customerid], callback);
    },
    //gets all customers referred to single account id
    accountData:function(idaccount, callback){
        return db.query("CALL accountData(?)", [idaccount], callback);
    },
    //gets all accounts referred to single customer id
    customerData:function(idcustomer, callback){
        return db.query("CALL customerData(?)", [idcustomer], callback);
    }
};
//account_customer taulukossa on merkitty käyttäjät joilla on oikeudet tiettyihin tileihin.

module.exports=account_customer;