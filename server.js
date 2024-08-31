const express = require('express');
const path = require('path');
const { dbConnection } = require('./connection');

const PORT = 8004;

const app = express();


// connection 

dbConnection('mongodb://127.0.0.1:27017/blog-app')
.then(() => console.log('MongoDB connected'));




// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))



// Middlewares 

app.set(express.json());



// Routes 

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));