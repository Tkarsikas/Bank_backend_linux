const db = require('../database');

const transaction={
    getAccountTransactions:function(idaccount, callback){
        return db.query("SELECT * FROM transaction where idaccount=?", [idaccount], callback);
    },
    getOne:function(idtransaction, callback){
        return db.query("SELECT * FROM transaction where idtransaction=?", [idtransaction], callback);
    },
    add:function(transaction, callback){
        return db.query(
            'INSERT INTO transaction (idaccount, amount, date, description) VALUES (?,?,?,?)',
            [transaction.idaccount, transaction.amount, transaction.date, transaction.description],
            callback
        );
    },
    update:function(transaction, idtransaction, callback){
        return db.query(
            'UPDATE transaction SET idaccount=IFNULL(?, idaccount), amount=IFNULL(?, amount), date=IFNULL(?, date), description=IFNULL(?, description) WHERE idtransaction=?',
            [transaction.idaccount, transaction.amount, transaction.date, transaction.description, idtransaction],
            callback
        );
    },
    delete:function(idtransaction, callback){
        return db.query('DELETE FROM transaction WHERE idtransaction=?', [idtransaction], callback);
    }
};

module.exports=transaction;