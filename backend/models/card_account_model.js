const db = require('../database');

const card_account = {
    getCardAccounts:function(idcard, callback){
        return db.query("SELECT * FROM card_account WHERE card_id=?",[idcard], callback);
    },
    addAccountToCard:function(idcard, idaccount, callback) {
        return db.query("INSERT INTO card_account (card_id, account_id) VALUES (?,?)",[idcard,idaccount], callback);
    },
    deleteAccountFromCard:function(idcard_account, callback) {
        return db.query("DELETE FROM card_account WHERE idcard_account=?",[idcard_account], callback);
    }
}

module.exports = card_account;