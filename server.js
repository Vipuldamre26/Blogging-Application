const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const { dbConnection } = require('./connection');
const userRoute = require('./routes/user');
const blogRoute  = require('./routes/blog')
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');

const PORT = process.env.PORT || 8000;

const app = express();


// connection 

dbConnection('mongodb://127.0.0.1:27017/blog-app')
.then(() => console.log('MongoDB connected'));




// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))



// Middlewares 

app.set(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));


// Routes 

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
})


app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));

