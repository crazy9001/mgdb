const Product = require('../models/product.model');

exports.test = function (req, res) {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
};

exports.product_list = function (req, res) {
    var pageOptions = {
        pageId: req.query.page || 0,
        limit: req.query.limit || 10
    };
    Product.find()
        .select(['name', 'price', 'image', 'description', 'createdAt', 'updatedAt'])
        .skip(pageOptions.pageId*pageOptions.limit)
        .limit(parseInt(pageOptions.limit))
        .sort({
            createdAt: 'desc'
        })
        .then(products => {
            return res.status(200).send({
                message: "Success",
                products: products
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving product."
        });
    });
    
};

exports.product_create = function (req, res) {

    if(!req.body.name) {
        return res.status(400).send({
            message: "Product name can not be empty"
        });
    }

    if(!req.body.price) {
        return res.status(400).send({
            message: "Price product can not be empty"
        });
    }

    let product = new Product(
        {
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description || 'Description product',
        }
    );

    product.save()
        .then(product => {
            return res.status(200).send({
                message: "Save success",
                product: product
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the product."
        });
    });

};

exports.product_details = function (req, res) {
    Product.findById(req.params.id)
        .then(product => {
            if(!product) {
                return res.status(404).send({
                    message: "Product not found"
                });
            }
            res.send(product);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found"
            });
        }
        return res.status(500).send({
            message: "Error retrieving product"
        });
    });
};

exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) return next(err);
        res.send('Product udpated.');
    });
};

exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if(!product) {
                return res.status(404).send({
                    message: "Product not found"
                });
            }
            res.send({message: "Product deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found"
            });
        }
        return res.status(500).send({
            message: "Could not delete product"
        });
    });
};