const express = require ('express');
const router = express.Router();
const account_customer = require ('../models/account_customer_model');
const validateFields = require ('../middleware/validateFields');

const required_fields = ['customer_id', 'account_id'];

router.get('/', function(request, response) {
    account_customer.getAll(function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        }

        response.json(result);
    })
});

router.get('/:idaccount_customer', function(request, response) {
    account_customer.getOne(request.params.idaccount_customer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        }

        response.json(result);
    })
});

router.post('/', validateFields(required_fields), function(request, response) {
    account_customer.add(request.body, function(err, result){
        if (err) {
            var error_message = err;
            var status_code = 500;
            if (err.errno === 1452) {
                status_code = 404; 
                error_message = 'Asiakasta tai tiliä ei ole olemassa.';
            }
            return response.status(status_code).json({ status_code: response.statusCode, message: error_message }); 
        }
        
        response.json(result);
    })
});

router.put('/:idaccount_customer', validateFields(required_fields), function(request,response) {
    account_customer.update(request.body, request.params.idaccount_customer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Account_customeria ei löytynyt.' })
        }
        
        response.json(result);    
    })
});

router.patch('/:idaccount_customer', function(request, response) {
    account_customer.update(request.body, request.params.idaccount_customer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Account_customeria ei löytynyt.' })
        }
        
        response.json(result);    
    })
});

router.delete('/:idaccount_customer', function(request, response) {
    account_customer.delete(request.params.idaccount_customer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Account_customeria ei löytynyt.' })
        }
        
        response.json(result);  
    })
});

router.get('/:idaccount/accountdata', function(request, response) {
    account_customer.accountData(request.params.idaccount, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result[0].length === 0) {
            return response.status(404).json({ status_code: response.statusCode, message: 'Tilitietoja ei löytynyt.' });
        }

        response.json(result[0]);
    })
});

router.get('/:idcustomer/customerdata', function(request, response) {
    const idcustomer = parseInt(request.params.idcustomer);
    account_customer.customerData(idcustomer, function(err, result){
        if(err){
            return response.status(500).json({status_code: response.statusCode, message: err });
        } else if (result[0].length === 0) {
            return response.status(404).json({ status_code: response.statusCode, message: 'Asiakkaan tietoja ei löytynyt.' });
        }

        response.json(result[0]);
    })
});

module.exports=router;