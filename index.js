const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frc6p9l.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const usersCollections=client.db('bistroDB').collection('users')
    const menuCollections=client.db('bistroDB').collection('menu')
    const reviewsCollections=client.db('bistroDB').collection('reviews')
    const cartsCollections=client.db('bistroDB').collection('carts')

    //  users

    app.get('/users', async (req,res)=>{
      const result=await usersCollections.find().toArray()
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const user=req.body;
      const query={email: user.email}
      const existingUser= await usersCollections.findOne(query)
      if(existingUser){
        return res.send({message: 'user already exist'})
      }
      const result = await usersCollections.insertOne(user)
      res.send(result)
    })

    //  menu 
    app.get('/menu', async(req,res)=>{
        const result= await menuCollections.find().toArray()
        res.send(result)
    })
  //  review
    app.get('/review', async(req,res)=>{
        const result= await reviewsCollections.find().toArray()
        res.send(result)
    })

    // carts collections

    app.get('/carts', async(req,res)=>{
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      else{
        const query={ email: email};
        const result = await cartsCollections.find(query).toArray()
        res.send(result)
      }
    })

    app.post('/carts', async(req,res)=>{
      const item = req.body;
      console.log(item)
      const result = await cartsCollections.insertOne(item)
      res.send(result)
    })


    app.delete('/carts/:id', async(req,res)=>{
      const id = req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await cartsCollections.deleteOne(query)
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


app.get('/', (req,res)=>{
    res.send('bistro boss is sitting....')
})

app.listen(port,()=>{
    console.log(`bistro boss is sitting on port ${port}`)
})