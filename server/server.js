var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname))

var dbUrl= 'mongodb+srv://ash:1234@nodeproject.fn22d.mongodb.net/test?retryWrites=true&w=majority'
var Product = mongoose.model('product', {
    product: {
        productid: Number,
        category: String,
        price: String,
        name: String,
        instock: Boolean
    },
    id : Number
});

//get products from the db
app.get('/product/get/', async (req, res) => {
    var products = {};
    var data = await Product.find({});
    data.forEach((value) => {
        products[value.id] = value.product;
    });
    res.send(products);
});
//add product to db
app.post('/product/create/', async (req, res) => {
    try{
        var product = new Product(req.body);
        await product.save();
        console.log("Added the new product successfully!");
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
    }
});
 //update product
app.put('/product/update/:id', async (req, res) => {
    try{
        var reqestId = req.params.id;
        console.log(req.body)
        await Product.findOneAndUpdate({id: reqestId}, req.body);
        res.sendStatus(200);   
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
 //delete product
app.delete('/product/delete/:id', async (req, res) => {
    var reqestId = req.params.id;
    await Product.findOneAndDelete({id: reqestId});
    res.sendStatus(200);
});

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if(error) {console.log('MongoDB database connection', error)}
    else{console.log('MongoDB database connection successful')}
  })
 
var server = app.listen(3000, () => {
    console.log('Server is listening on the port', server.address().port)
})
 
