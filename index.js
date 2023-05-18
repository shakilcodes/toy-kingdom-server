const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const app = express()
const port = process.env.PORT  || 5010;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.ybsvrsr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const carCollection = client.db('toy-kingdom').collection('collectedCar')

    app.get('/allToys', async(req, res) =>{
        const result = await carCollection.find().toArray();
        res.send(result)
    })

    app.get("/allToys/:id", async(req, res) =>{
        const id = req.params.id
        const quary = {_id: new ObjectId(id)}
        const result = await carCollection.findOne(quary)
        res.send(result)
    })
    
    app.get("/singleToys/:email", async (req, res) => {
      const toys = await carCollection.find({seller_email: req.params.email,}).toArray();
      res.send(toys);
    });
    
    app.post('/postToys', async(req, res)=>{
      const toys = req.body;
      console.log(toys)
      const result = await carCollection.insertOne(toys)
      res.send(result)
    })

    app.put('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true};
      const updateToy = req.body;
      console.log(updateToy);
      const updated = {
          $set: {
            price: updateToy.price,
              quantity: updateToy.quantity,
              description: updateToy.description,
          }
      };
      const result = await carCollection.updateOne(query, updated, options)
      res.send(result);
  })

    app.delete('/allToys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await carCollection.deleteOne(query)
      res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Toy Kingdom running')
})

app.listen(port, () => {
  console.log(`Toy Kingdom listening on port ${port}`)
})