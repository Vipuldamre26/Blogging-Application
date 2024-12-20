const { Router } = require('express');
const multer = require('multer');
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

// external library multer for storing files like .png .jpg .pdf etc 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage })



router.get('/add-new', (req, res) => {

  return res.render('addBlog', {
    user: req.user,
  })
})



router.get('/:id', async (req, res) => {

  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

    return res.render('blog', {
      user: req.user,
      blog,
      comments,
    })

  }
  catch(error) {
    console.log(error);
    
    res.json({
      success: false,
      message: "Something error happeneddddddddddddddd",
    })
  }
})



router.post('/comment/:blogId', async (req, res) => {

  try {
    const content = req.body.content;

    if (!content) {
      return res.redirect(`/blog/${req.params.blogId}?error=Comment content is required`);
    }
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogId}`)
  }
  catch {
    res.json({
      success: false,
      message: "Something error happened",
    })
  }

})


router.post('/', upload.single('coverImage'), async (req, res) => {

  const { title, body } = req.body;
  try {

    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`
    })

    return res.redirect(`/blog/${blog._id}`);

  }
  catch {
    res.json({
      success: false,
      message: "Something error happened",
    })
  }
})



module.exports = router;
