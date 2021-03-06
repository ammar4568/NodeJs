const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    // console.log(req.body);
    title = req.body.title;
    imageUrl = req.body.imageUrl;
    description = req.body.description;
    price = req.body.price;

    req.user.createProduct({ // On one to many relation sequelize adds this magic method to user object
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price
    })
    .then(() => {
        res.redirect('/admin/products')
    }).catch(err => {
        console.log(err)
    })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    req.user.getProducts({where: { id: prodId }})
    // Product.findByPk(prodId)
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    Product.findByPk(prodId)
    .then(product => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.description = description;
        product.price = price;
        return product.save();
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err)) 
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
    req.user
    .getProducts()
    // Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            })
        })
        .catch(err => {
            console.log('err');
        })
}