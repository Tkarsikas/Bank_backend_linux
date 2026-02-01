function validateFields(required_fields) {
    return function(request, response, next) { 

        const missing_fields = required_fields.filter(
            field => request.body[field] === undefined
        );

        if (missing_fields.length > 0) {
            return response.status(400).json({ 
                status_code: response.statusCode, 
                message: 'Cannot perform ' + request.method + ' without all required fields.',
                missing_fields: missing_fields
            })
        }

        next();
    }
}

module.exports = validateFields;