const db = require('../database');
const bcrypt = require('bcryptjs');

const card = {
    getAll:function(callback){
        return db.query("SELECT * FROM card", callback);
    },
    getOne:function(idcard, callback){
        return db.query("SELECT * FROM card WHERE idcard=?",[idcard],callback);
    },
    add:function(card, callback){
        bcrypt.hash(card.pin,10,function(err, hashedpin){
            return db.query("INSERT INTO card (idcard,pin) VALUES(?,?)",[card.idcard,hashedpin],callback);
        });
    },
    delete:function(idcard, callback){
        return db.query("DELETE FROM card WHERE idcard=?",[idcard], callback);
    },
    update:function(card, newCardId, callback) {
        return db.query("UPDATE card SET idcard=? WHERE idcard=?",[card.idcard,newCardId], callback);
    },
    addOneLogin:function(idcard, callback) {
        return db.query("UPDATE card SET login_attempts = login_attempts + 1 WHERE idcard = ?",[idcard],callback);
    },
    resetLoginAmount:function(idcard, callback) {
        return db.query("UPDATE card SET login_attempts=? WHERE idcard=?",[0,idcard],callback);
    },
}

module.exports = card;