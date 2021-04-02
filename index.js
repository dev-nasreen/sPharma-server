const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port =process.env.PORT || 5500
const MongoClient = require('mongodb').MongoClient;
const  ObjectId  = require('mongodb').ObjectID;
const { connect, ObjectID } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9pkjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


client.connect(err => {
    const productsCollection = client.db("sPharma").collection("products");
    const ordersCollection = client.db("sPharma").collection("orders");
   
    app.post('/addProduct', (req, res) =>{
      const newProduct = req.body;
      productsCollection.insertOne(newProduct)
      .then(result =>{
        res.send(result.insertedCount > 0);
      })
    })
    app.post('/addOrder', (req, res) =>{
      const orderedPd = req.body;
      ordersCollection.insertOne(orderedPd)
      .then(result =>{
        res.send(result.insertedCount > 0);
        console.log(result.insertedCount)
      })
    })

    //call orders on UI
    app.get('/orders', (req, res) =>{
      //console.log(req.query.email);
      ordersCollection.find({email: req.query.email})
      .toArray((err, documents) =>{
        res.send(documents)
      })
    })


    //call products on UI 
    app.get('/products', (req, res) =>{
      productsCollection.find()
      .toArray((err, products) =>{
        res.send(products)
      })
    })

    app.get('/singleProduct/:id', (req, res) =>{
      productsCollection.find({_id: ObjectID(req.params.id)})
      .toArray((err, products) =>{
        res.send(products)
      })
    })

  app.delete('/delete/:id',(req, res)=>{
    const id =req.params.id;
    productsCollection.deleteOne({_id: ObjectId(id)})
    .then(result =>{
      if(result.deletedCount > 0){
        res.send(!!result.deletedCount)
      }
    })

  })







  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)