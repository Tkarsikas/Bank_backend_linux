const express = require("express");
const router = express.Router();
const account = require('../models/account_model');
const card = require('../models/card_model');
const card_account = require('../models/card_account_model');
const validateFields = require('../middleware/validateFields');

const required_fields = ['idcard', 'idaccount']

router.post('/accounttocard', validateFields(required_fields), function(request,response){
    const idcard = request.body.idcard;
    const idAccountToAdd = request.body.idaccount;

    // Tarkistetaan kortin olemassaolo
    card.getOne(idcard, function(err, result) {
        if (err) {
            console.log('Tietokantavirhe: ', err);
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.length === 0) {
            return response.status(404).json({ message: "Antamaasi korttia ei ole olemassa." });
        }
        
        // Tarkistetaan tilin olemassaolo
        account.getOne(idAccountToAdd, function(err, result) {
            if (err) {
                return response.status(500).json({ status_code: response.statusCode, message: err });
            } else if (result.length === 0) {
                return response.status(404).json({message:"Antamaasi tilia ei olemassa."});
            }

            const addingAccountType = result[0].account_type;

            // Tarkistetaan kortin nykyiset tilit
            card_account.getCardAccounts(idcard, function(err, accounts) {
                if (err) {
                    return response.status(500).json({ status_code: response.statusCode, message: err });
                }

                // Kortilla ei ole vielä tilejä
                if (accounts.length === 0) {
                    card_account.addAccountToCard(idcard,idAccountToAdd);
                    return response.json({message: "Tili lisatty onnistuneesti."})
                }

                // Kortilla on jo kaksi tiliä
                if (accounts.length > 1) {
                    return response.status(409).json({ message: "Kortilla on jo DEBIT ja CREDIT tilit." });
                }

                // Kortilla on yksi tili -> tarkistetaan tyyppi
                const accountid = accounts[0].account_id;

                account.getOne(accountid, function(err, result) {
                    if (err) {
                        return response.status(500).json({ status_code: response.statusCode, message: err });
                    }

                    const existAccountType = result[0].account_type;

                    // Verrataan tilien tyyppejä
                    if (existAccountType === addingAccountType) {
                        return response.status(409).json({ message: "Kortilla on jo lisättävän tyypin tili." });
                    } else {
                        card_account.addAccountToCard(idcard, idAccountToAdd);
                        return response.json({ message: "Tili ja kortti liitetty onnistuneesti." });
                    }
                });
            });
        });
    });
});

router.delete('/removeaccountfromcard', validateFields(required_fields), function (request, response) {
    const idcard = request.body.idcard;
    const idAccountToRemove = request.body.idaccount;

    // Tarkistetaan kortin olemassaolo
    card.getOne(idcard, function (err, result) {
        if (err) {
            console.log('Tietokantavirhe:', err);
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.length === 0) {
            return response.status(404).json({ message: "Antamaasi korttia ei olemassa. " });
        }

        // Tarkistetaan tilin olemassaolo
        account.getOne(idAccountToRemove, function (err, result) {
            if (err) {
                return response.status(500).json({ status_code: response.statusCode, message: err });
            } else if (result.length === 0) {
                return response.status(404).json({ message: "Antamaasi tilia ei olemassa. " });
            }


            // Haetaan kortin nykyiset tilit
            card_account.getCardAccounts(idcard, function (err, accounts) {
                if (err) {
                    return response.status(500).json({ status_code: response.statusCode, message: err });
                } else if (accounts.length === 0) {
                    return response.status(400).json({ message: "Annetulla kortilla ei ole tilejä." }); 
                }

                // Käydään tilit läpi, vastaako poistettava kortilla olevia
                for (const account of accounts) {
                    if (account.account_id == idAccountToRemove) {

                        const idcard_account = account.idcard_account;
                        // Poistetaan annettu tili kortilta, jos sellainen löyty
                        return card_account.deleteAccountFromCard(idcard_account, function(err, result){
                            if (err) {
                                return response.status(500).json({ status_code: response.statusCode, message: err });
                            } else {
                                return response.json({
                                    success: true,
                                    message: "Tilin ja kortin liitos poistettu.",
                                    idcard: idcard,
                                    deletedAccount: idAccountToRemove
                                })
                            }
                        });
                    }
                }
                // Jos kortilla ei ole kyseistä tiliä
                return response.status(404).json({ message: "Annetulla kortilla ei ole kyseistä tiliä." });
            });
        });
    });
});



module.exports = router;