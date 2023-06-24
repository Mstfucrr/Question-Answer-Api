const asyncErrorWrapper = require('express-async-handler');
const { populateHelper, paginationHelper } = require('./queryMiddlewareHelper');

const answerQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {
        const { id } = req.params; // question id'si
        const arrayName = "answers";

        const total = (await model.findById(id))["answerCount"]; // question'a ait answer sayısını bul

        // pagination
        const paginationResult = await paginationHelper(total, undefined, req); // paginationResult'ı bul 
        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        let queryObject = {};
        // queryObject'e arrayName'i key olarak ekle ve value olarak slice'ı ekle, slice startIndex'ten başlayıp limit kadar veri getiriyor
        queryObject[arrayName] = { $slice: [startIndex, limit] };

        let query = model.find({ _id: id }, queryObject); // question id'sine göre query'yi bul ve queryObject'i ekle, queryObject sayesinde sadece istenilen sayıda veri getirilecek

        // populate
        query = populateHelper(query, options.population); // query'yi populateHelper'a gönder ve dönen değeri query'ye ata

        const queryResults = await query;

        res.queryResults = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResults
        };

        next();
    });
};

module.exports = { answerQueryMiddleware };