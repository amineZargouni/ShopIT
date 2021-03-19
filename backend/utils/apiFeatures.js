class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                //pattern fel name
                $regex: this.queryStr.keyword,
                // i case mayhemesh maj or not
                $options: 'i'
            }
        } : {}
        console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        //console.log(queryCopy);
        //removing field from the query el:element
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);
        //console.log(queryCopy);
        //advance filter for price,ratings ect
        let queryStr = JSON.stringify(queryCopy)
        //adding $ to gt gte .. for mongo
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        //console.log(queryStr);

        //

        this.query = this.query.find(JSON.parse(queryStr));
        return this;

    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        //products to skip for, exp 30 products, 10 per page,current page is 2
        // so skip 10*(2-1) = skip 10 products
        const skip = resPerPage * (currentPage-1);
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;

    }
}

module.exports = APIFeatures;