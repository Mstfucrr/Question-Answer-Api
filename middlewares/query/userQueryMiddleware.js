const asyncErrorWrapper = require('express-async-handler');
const { searchHelper, paginationHelper } = require('./queryMiddlewareHelper');


const userQueryMiddleware = function (model, options) {
    
    return asyncErrorWrapper(async function (req, res, next) {

        // search
        let query = model.find();
        query = searchHelper('name', query, req); // name'e göre arama yap ve query'yi döndür

        // pagination
        // toplam queryinin sayısını bul
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total, query, req);
        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        };
    
    next();
    });
    
};



module.exports = {userQueryMiddleware};
