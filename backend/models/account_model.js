const db = require('../database')

const account = {
    getAll:function(callback) {
        return db.query('SELECT * FROM account', callback);
    },
    getOne:function(idaccount, callback) {
        return db.query('SELECT * FROM account WHERE idaccount=?', [idaccount], callback);
    },
    add:function(account, callback) {
        return db.query(
            'INSERT INTO account (idaccount, balance, account_type, credit_limit, idowner) VALUES (?,?,?,?,?)', 
            [account.idaccount, account.balance, account.account_type, account.credit_limit, account.idowner],
            callback
        );
    },
    update:function(account, idaccount, callback) {
        return db.query(
            'UPDATE account SET idaccount=IFNULL(?, idaccount), balance=IFNULL(?, balance), account_type=IFNULL(?, account_type), credit_limit=IFNULL(?, credit_limit), idowner=IFNULL(?, idowner) WHERE idaccount=?', 
            [account.idaccount, account.balance, account.account_type, account.credit_limit, account.idowner, idaccount],
            callback
        );
    },
    delete:function(idaccount, callback) {
        return db.query('DELETE FROM account WHERE idaccount=?', [idaccount], callback);
    },
}

module.exports=account;