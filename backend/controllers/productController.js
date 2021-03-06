
const Product = require('../models/product');
const mongoose = require('mongoose');

const ErrorHandler = require('../utils/errorHandler')

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

//create new product /api/v1/admin/product/new

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
   
    //setting the user who posted a product
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})



//get all products /api/v1/products

exports.getProducts = async (req, res, next) => {

    const resPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search().filter().pagination(resPerPage);

    //const products = await Product.find()
    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
}


//get product by id /api/v1/product/:id 604a4b4ee1f3b337c48e8d7b
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

    //if id is valid for mongodb replaced by catchErrors 
    //if (mongoose.isValidObjectId(req.params.id)) {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    return res.status(200).json({
        success: true,
        product
    })



})


//update a product  /api/v1/admin/product


exports.updateProduct = catchAsyncErrors(async (req, res, next) => {


    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    };


    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    return res.status(200).json({
        success: true,
        message: 'Product updated',
        product
    });

})

//delete product /api/v1/admin/product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {



    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    };

    await product.remove();
    return res.status(200).json({
        success: true,
        message: 'Product deleted',

    });



})





