const express = require('express')
const app = express()

const mongodb = require('mongodb')
const mongoclient = mongodb.MongoClient;

const cors = require('cors')


const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const URL = 'mongodb+srv://raja:raja123@servicebookingapp.uvyzllo.mongodb.net/?retryWrites=true&w=majority'


app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

function authenicate(req, res, next) {
    if (req.headers.authorization) {
        let decode = jwt.verify(req.headers.authorization, "loginsecretkey");
        if (decode) {
            next();
        } else {
            res.status(401).json({ message: 'unauthorized' });
        }
        
    } else {
        res.status(401).json({ message: 'unauthorized' });

    }
}


app.post('/bookingdetail', async (req, res) => {
    try {
        let connection = await mongoclient.connect(URL)
        let db = connection.db("service-customer")
        await db.collection("booking").insertOne(req.body)
        await connection.close();
        res.json(customer)
    } catch (error) {
        res.json(error)
        console.log(error)
    }
})



app.get('/bookingdetail', authenicate, async (req, res) => {

    try {
        let connection = await mongoclient.connect(URL)
        let db = connection.db("service-customer")
        let customer = await db.collection("booking").find().toArray()
        await connection.close();
        res.json(customer)

    } catch (error) {
        res.json(error)
        console.log(error)
    }

})

app.post('/customer-register', async (req, res) => {
    try {
        let connection = await mongoclient.connect(URL);
        let db = connection.db('service-customer');
        let salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
        await db.collection('users').insertOne(req.body);
        await connection.close();
        res.json({ message: 'User Created' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.post('/customer-login', async (req, res) => {
    try {
        let connection = await mongoclient.connect(URL);
        let db = connection.db('service-customer');
        let user = await db.collection('users').findOne({ email: req.body.email });
        if (user) {
            let compare = bcrypt.compareSync(req.body.password, user.password);
            if (compare) {
                let token = jwt.sign({ email: user.email, id: user._id }, "loginsecretkey");
                res.json({ token, message: "login successfully"});
            } else {
                res.status(500).json({ message: "credientials does not match" })
            }
        } else {
            res.status(401).json({ message: "credientials does not match" })
        }

    } catch (error) {
        
        res.status(500).json({ message: "something went wrong" });
        console.log(error);
    }
})


app.post('/service-detail', async (req, res) => {
    try {
        let connection = await mongoclient.connect(URL)
        let db = connection.db("service-admin")
        await db.collection("product").insertOne(req.body)
        await connection.close();
        res.json()
    } catch (error) {
        res.json(error)
        console.log(error)
    }
})

app.get('/servicedetail', authenicate, async (req, res) => {

    try {
        let connection = await mongoclient.connect(URL)
        let db = connection.db("service-admin")
        let product = await db.collection("product").find().toArray()
        await connection.close();
        res.json(product)

    } catch (error) {
        res.json(error)
        console.log(error)
    }

})


app.post('/admin-register', async (req, res) => {
    try {
        let connection = await mongoclient.connect(URL);
        let db = connection.db('service-admin');
        let salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
        await db.collection('users').insertOne(req.body);
        await connection.close();
        res.json({ message: 'User Created' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.post('/admin-login', async (req, res) => {
    try {
        let connection = await mongoclient.connect(URL);
        let db = connection.db('service-admin');
        let user = await db.collection('users').findOne({ adminId: req.body.adminId });
        if (user) {
            let compare = bcrypt.compareSync(req.body.password, user.password);
            if (compare) {
                let token = jwt.sign({ adminId: user.adminId, id: user._id }, "loginsecretkey");
                res.json({ token, message: "login successfully" });
            } else {
                res.status(500).json({ message: "credientials does not match" })
            }
        } else {
            res.status(401).json({ message: "credientials does not match" })
        }

    } catch (error) {

        res.status(500).json({ message: "something went wrong" });
        console.log(error);
    }
})

app.listen(process.env.PORT || 3001);