const searchHelper = (searchKey, query, req) => {
    if (req.query.search) {
        return query.where({
            [searchKey]: {
                $regex: req.query.search,
                $options: 'i' // case insensitive
            }
        })

    }
    return query;
}

const populateHelper = (query, population) => {
    return query.populate(population);
}

const questionSortHelper = (query, req) => {

    const sortKey = req.query.sortBy;
    if (sortKey === 'most-answered') { // en çok cevaplanan soruları getir
        return query.sort('-answerCount');
    } else if (sortKey === 'most-liked') { // en çok beğenilen soruları getir
        return query.sort('-likeCount');
    } else {
        return query.sort('-createdAt');
    }
}

const paginationHelper = async (model, query, req) => {
    const page = parseInt(req.query.page) || 1; // eğer page yoksa 1. sayfayı göster
    const limit = parseInt(req.query.limit) || 5; // eğer limit yoksa 5 veri göster

    const startIndex = (page - 1) * limit; // start index : sayfa 1 ise 0, sayfa 2 ise 5, sayfa 3 ise 10
    const endIndex = page * limit; // end index : sayfa 1 ise 5, sayfa 2 ise 10, sayfa 3 ise 15

    const pagination = {};
    const total = await model.countDocuments(); // toplam veri sayısı
    if (startIndex > 0) { // eğer 1. sayfada değilsek, önceki sayfaya geçebiliriz
        pagination.previous = { 
            page: page - 1,
            limit: limit
        }
    }
    console.log("total: " + total)
    console.log("endIndex: " + endIndex)
    if (endIndex < total) { // eğer end index toplam veri sayısından küçükse, sonraki sayfaya geçebiliriz
        pagination.next = { // sonraki sayfaya geçebiliriz
            page: page + 1,
            limit: limit
        }
    }
    query = query.skip(startIndex).limit(limit);
    return {
        query: query,
        pagination: pagination
    }
}


module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
}