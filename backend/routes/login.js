const express = require('express');
const router = express.Router();
const card = require('../models/card_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/:idcard/reset', function(request,response) {
    card.resetLoginAmount(request.params.idcard, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Korttia ei löytynyt.' })
        }

        response.json({
            success: true,
            message: "Kirjautumisyritykset resetoitu.",
            idcard: request.params.idcard
        });
    });
});

router.post('/', function (request, response) {
    if (!request.body.pin || !request.body.idcard) {
        return response.status(400).json({ message: "Idcard tai PIN puuttuu." });
    }

    const pin = request.body.pin;
    const idcard = request.body.idcard;
    card.getOne(idcard, function (err, result) {
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.length === 0) {
            // Tietokannan paluun pituus == 0 -> ID:llä ei korttia
            console.log("Annetulla kortin ID:llä ei löydy korttia.");
            return response.json({ message: "Annetulla kortin ID:llä ei löydy korttia." });
        }

        const dbPin = result[0].pin;
        const login_attempts = result[0].login_attempts;

        // Jos 3 tai enemmän, palautetaan viesti "Tunnus lukittu"
        if (login_attempts > 2) {
            console.log("Liian monta kirjautumisyritystä, tunnus on lukittu.");
            return response.json({ message: "Liian monta kirjautumisyritystä, tunnus on lukittu." });
        }
    
        bcrypt.compare(pin, dbPin, function (err, compareResult) {
            if (err) {
                return response.status(500).json({ status_code: response.statusCode, message: err });
            }
        
            if (compareResult) {
                // HUOM! Jotta sovellus ei kaadu tähän, on .env-tiedostossa oltava MY_TOKEN sijoitettuna
                const token = generateAccessToken(idcard);
            
                // Resetoidaan kirjautmiset onnistuneen kirjautumisen yhteydessä
                card.resetLoginAmount(idcard);
            
                // Palautetaan onnistuneessa kirjautumisessa alla olevat tiedot
                return response.json({
                    success: true,
                    message: "Login OK",
                    idcard: idcard,
                    token: token
                });
            } else {
                // Päivitetään uusi kirjautumisten lukumäärä epäonnistuneessa kirjautumisessa
                card.addOneLogin(idcard);
                return response.json({ message: "Idcard ja PIN eivät täsmää." });
            }
        });
    });
});

function generateAccessToken(idcard) {
    return jwt.sign({idcard}, process.env.MY_TOKEN, {expiresIn: '1800s'});
}

module.exports=router;