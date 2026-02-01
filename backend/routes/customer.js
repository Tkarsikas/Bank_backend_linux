const express = require ('express');
const router = express.Router();
const customer = require('../models/customer_model');
const  validateFields = require('../middleware/validateFields');

const required_fields = ['fname', 'lname', 'street_address', 'city'];

router.get('/', function(request, response){
    customer.getAll(function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        }

        response.json(result);
    })
});

router.get('/:idcustomer', function(request, response){
    customer.getOne(request.params.idcustomer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        }

        response.json(result);
    })
});

router.post('/', validateFields(required_fields), function(request, response){
    customer.add(request.body, function(err, result){
        if (err) {
            return response.status(status_code).json({ status_code: response.statusCode, message: error_message }); 
        }

        response.json(result);
    })
});

router.put('/:idcustomer', validateFields(required_fields), function(request, response){
    customer.update(request.body, request.params.idcustomer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Asiakasta ei löytynyt.' })
        }
        
        response.json(result);
    })
});

router.patch('/:idcustomer', function(request, response){
    customer.update(request.body, request.params.idcustomer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Asiakasta ei löytynyt.' })
        }
        
        response.json(result);
    })
});

router.delete('/:idcustomer', function(request, response){
    customer.delete(request.params.idcustomer, function(err, result){
        if (err) {
            return response.status(500).json({ status_code: response.statusCode, message: err });
        } else if (result.affectedRows === 0) {
            return response.status(404).json({ message: 'Asiakasta ei löytynyt.' })
        }
        
        response.json(result);
    })
});

module.exports=router;