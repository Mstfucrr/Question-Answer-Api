const asyncErrorWrapper = require('express-async-handler');
const { searchHelper, populateHelper, questionSortHelper, paginationHelper } = require('./queryMiddlewareHelper');

const questionQueryMiddleware = function (model, options) {
    return asyncErrorWrapper(async function (req, res, next) {
        
        // search
        let query = model.find();
        query = searchHelper('title', query, req); // title'a göre arama yap ve query'yi döndür

        // populate
        if (options && options.population) { // eğer options varsa ve options.population varsa
            query = populateHelper(query, options.population); // query'yi populateHelper'a gönder ve dönen değeri query'ye ata
        }

        // sort
        query = questionSortHelper(query, req);
        
        
        let pagination = {};

        // pagination
        // gelen query'i paginationHelper'a gönder ve dönen değeri pagination'a ata
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
}

module.exports = {questionQueryMiddleware};       
    
