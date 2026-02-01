const express = require("express");
const router = express.Router();
const card = require('../models/card_model');
const card_account = require('../models/card_account_model');
const account = require("../models/account_model");
var validateFields = require('../middleware/validateFields');
var authenticateToken = require('../middleware/auth');

const post_required_fields = ['idcard', 'pin']
const put_required_fields = ['idcard']

router.get('/', function(request, response) {
    card.getAll(function(err,result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        }

        response.json(result);
    });
});

router.get('/:idcard', function(request, response) {
    card.getOne(request.params.idcard, function(err,result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        }

        response.json(result);
    });
});

router.post('/', validateFields(post_required_fields), function(request,response) {
    card.add(request.body, function(err,result){
        if (err) {
            var error_message = err;
            var status_code = 500;
            if (err.errno === 1062) {
                status_code = 400;
                error_message = 'Ei voi luoda korttia samalla ID:llä kuin toinen kortti.';
            } 
            return response.status(status_code).json({ status_code: response.statusCode, message: error_message }); 
        }
        
        response.json(result);
    });
});

router.put('/:idcard', validateFields(put_required_fields), function(request,response) {
    card.update(request.body, request.params.idcard, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Korttia ei löytynyt.' })
        }
        
        response.json(result);
    });
});

router.delete('/:idcard', function(request,response) {
    card.delete(request.params.idcard, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Korttia ei löytynyt.' })
        }
        
        response.json(result);
    });
});

router.get('/:idcard/accounts', authenticateToken, function(request, response) {
    const idcard = request.params.idcard;
    // Haetaan kortti ja tarkistetaan sen olemassa olo
    card.getOne(idcard, function(err, result) {
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.length === 0) {
            return response.status(404).json({ message: "Antamaasi korttia ei ole olemassa." });
        }
        // Haetaan kortilla olevat tilit
        card_account.getCardAccounts(idcard, function(err, result){
            if (err) {
                return response.status(500).json({ status_code: response.statusCode, message: err });
            } else if (result.length === 0) {
                // Jos korttiin ei ole liitetty tilejä, palautetaan tyhjä lista
                return response.json([]);
            }

            // Käydään tilit läpi ja tallennetaan taulukkoon
            let accounts = [];
            let count = 0;
            for (const card_account of result) {
                account.getOne(card_account.account_id, function(err, accountResult){
                    if (err) {
                        return response.status(500).json({ status_code: response.statusCode, message: err });
                    }

                    // Tallennetaan tili kerrallaan taulukkoon
                    accounts.push(accountResult[0]);
                    count++;

                    // Kunnes tilit käyty läpi, palautetaan ne
                    if (count === result.length) {
                        return response.json(accounts);
                    }
                });
            }
        });
    });
});

module.exports = router;
