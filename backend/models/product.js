const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        //trim removes space el zeyda
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 charachers']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product price cannot exceed 5 charachers'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0.0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }

    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptop',
                'Accessories',
                'Headphones',
                'Food',
                'clothes'
            ],
            message: 'Please select correct category for the product'
        },
    },

    seller: {
        type: String,
        required: [true, 'please enter product seller']
    },

    stock:{
        type:Number,
        required:[true,'Please enter product stock'],
        maxLenght:[5,'Product Stocks cannot exceed 5'],
        default: 0
    },

    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true

        },
        comment:{
            type:String,
            required:true
        }

    }],
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Product', productSchema);