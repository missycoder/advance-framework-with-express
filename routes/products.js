const express = require('express');
const router = express.Router();

// require in the model
<<<<<<< HEAD
<<<<<<< HEAD
const { Product } = require('../models');
const { createProductForm} = require()

router.get('/', async function(req,res){
    // use the Product model to get all the products
    const products = await Product.collection().fetch();
    // products.toJSON() convert the table rows into JSON data format
    res.render('products/index', {
        products: products.toJSON()
    } );
=======
const { Product, Category, Tag } = require('../models');
const { createProductForm, bootstrapField, createSearchForm } = require('../forms');
const dataLayer = require('../dal/products')

router.get('/', async function (req, res) {

    // get all the categories
    const allCategories = await dataLayer.getAllCategories();
    allCategories.unshift([0, '----------']);

    // get all the tags 
    const allTags = await Tag.fetchAll().map(t => [t.get('id'), t.get('name')]);

    const searchForm = createSearchForm(allCategories, allTags);
    searchForm.handle(req, {
        'success': async function (form) {
            // SELECT * FROM products
            const queryBuilder = Product.collection();  // create a new query builder
        
            // if the user did fill the name field in the search form
            if (form.data.name) {
                // then append the search for name WHERE clause to the query builder
                // eqv. WHERE name LIKE `%${form.data.name}%`
                queryBuilder.where('name', 'like', "%" + form.data.name + "%");
            }

            if (form.data.min_cost) {
                queryBuilder.where('cost', '>=', form.data.min_cost);
            }

            if (form.data.max_cost) {
                queryBuilder.where('cost', '<=', form.data.max_cost);
            }

            if (form.data.category_id && form.data.category_id != "0") {
                queryBuilder.where('category_id', "=", form.data.category_id);
            }

            if (form.data.tags) {
                queryBuilder.query('join', 'products_tags', 'products.id', 'product_id')
                    .where('tag_id', 'in', form.data.tags.split(','));
            }

            // when we call fetch  on the queryBuilder, then the command
            // is sent to the SQL database
            const products = await queryBuilder.fetch({
                withRelated:['category', 'tags']
            });
            res.render('products/index', {
                products: products.toJSON(),
                searchForm: form.toHTML(bootstrapField)
            });
        },
        'empty': async function (form) {

            // if the user submits an empty search form, then just fetch
            // all the products

            // use the Product model to get all the products
            const products = await dataLayer.getAllProducts();

            // products.toJSON() convert the table rows into JSON data format
            res.render('products/index', {
                products: products.toJSON(),
                searchForm: searchForm.toHTML(bootstrapField)
            });
        },
        'error': async function (form) {

            // if the user's search form has error, let's just send back the form
            res.render('products/index', {
                products: [],
                searchForm: form.toHTML(bootstrapField)
            });
        }
    })


>>>>>>> 64408cb (first commit)
=======
const { Product } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');

router.get('/', async function(req,res){
    // use the Product model to get all the products
    const products = await Product.collection().fetch();
    // products.toJSON() convert the table rows into JSON data format
    res.render('products/index', {
        products: products.toJSON()
    } );
>>>>>>> ecf1a2a (updated 04)
});

router.get('/add-product', function(req,res){
    const productForm = createProductForm();
    res.render('products/create', {
        form: productForm.toHTML(bootstrapField)
    })
});

router.post('/add-product', function(req,res){
    // create the product form object using caolan form
    const productForm = createProductForm();
    // using the form object to handle the request
    productForm.handle(req, {
        'success': async function(form) {
            // the forms has no error
            // to access each field in the submitted form
            // we use form.data.<fieldname>


            // create an instance of the Product model
            // an instance of a product is one row in the corresponding table
            const product = new Product();
            product.set('name', form.data.name)
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            // save the product to the database
            await product.save();

            // same as:
            // INSERT INTO products (name, cost, description)
            // VALUES (${form.data.name}, ${form.data.cost}, ${form.data.description})
            res.redirect("/products/");
        },
        'empty': function(form) {
            // the user submitted an empty form
            res.render('products/create', {
                form: productForm.toHTML(bootstrapField)
            })
        },
        'error': function(form) {
            // the user submitted a form with error
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/update-product/:productId', async function(req,res){
    const productId = req.params.productId;
    
    // fetch the product that we want to update
    // emulate: SELECT * from products WHERE id = ${productId}
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true
    });

    // create the product form
    const productForm = createProductForm();

    // prefill the form with values from the product 
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
});

router.post('/update-product/:productId', async function(req,res){
    // 1. create the form object
    const productForm = createProductForm();

    // 2. use the form object to handle the request
    productForm.handle(req, {
        'success':async function(form) {
            // find the product that the user want to modify
            const product = await Product.where({
                'id': req.params.productId
            }).fetch({
                require: true  // make sure the product actually exists
            });

            // if every key in form.data is one column in a product row,
            // we can use the following shortcut:
            product.set(form.data);
            await product.save();
            res.redirect('/products/')
        },
        'empty': function(form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        },
        'error': function(form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/delete-product/:productId', async function(req,res){
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });

    res.render('products/delete', {
        product: product.toJSON()
    })

})

router.post('/delete-product/:productId', async function(req,res){
    // get the product which we want to delete
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });

    await product.destroy();
    res.redirect('/products');


})

// export
module.exports = router;