const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const Bcrypt = require("bcryptjs");
const multer = require("multer");
const Reservation = require('./models/model.reservation.js');
const cors = require("cors");
const port = 5000

//const pusher = require('pusher');

// Create express app
const app = express();
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
    // Parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

const dbConfig = 'mongodb://127.0.0.1:27017/abangDB';
const db = mongoose.connection;

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to dbs.");
}).catch(err => {
    console.log('Cannot connect to dbs.', err);
    process.exit();
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ------------------------------------------------------------

// Import Models

const createUser = require('./controller/accountsUsers.controller.js');

app.post('/accountsUsers', function(req, res) {
    console.log(req.body)
    createUser.create(req, res);
});
app.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    createUser.login(username, password, res)
});

// app.use('/static', express.static(path.join(__dirname, 'uploads')))

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false)
    }
    cb(null, true);
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    },
    fileFilter
})

var upload = multer({ storage: storage })

app.post('/uploadImage', upload.single('file'), (req, res) => {
    //console.log(req)
    res.json({ file: req.file });
});

app.use((err, req, res, next) => {
    if (err.code === "INCORRECT_FILETYPE") {
        res.status(422).json({ error: 'Only images are allowed' });
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: 'Allow file size is 500KB' });
        return;
    }
});


//------------------------- Add Item with image
const createItem = require('./controller/items.controller.js');
app.post('/addItem', (req, res) => {
    createItem.create(req, res)
})

app.get('/getItems', (req, res) => {
    createItem.getAll(req, res)
})


//testing pusher
// const my_pusher = require('./helper/pusher')


// app.post("/reserve", (req, res) => {
//     console.log(req.body);
//     my_pusher.pusher(req.body)
//     res.send("hello")
// })  

//get reservation
app.get('/reservation/get', (req, res) => {
    Reservation.find({}, (err, data) => {
        if (err) return err;
        res.send(data)
    })
})

//add reservation
app.post('/reservation/add', (req, res) => {
    const data = new Reservation({
        reservationID: req.body.reservationID,
        name: req.body.name,
        dateReserved: req.body.dateReserved,
        dateReturned: req.body.dateReturned,
        totalRate: req.body.totalRate,
        status: req.body.status,
    })
    data.save((err, data) => {
        if (err) return err;
        res.send(data)
    })
})

app.post('/reserve',(req, res)=>{
    const data = new Reservation(req.body)
    var io = req.app.get('socketio')
    data.save((err, data) => {
        if (err) return err;
        Reservation.find({}, (err, data) => {
            if (err) return err;
            io.emit('reserveEvent', data)
        })
        
        res.send(data)
    })
})

const server = app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});
const io = require("socket.io")(server);
app.set('socketio', io);

// ------------------------------------------------------------
// listen for requests
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}!`);
// });