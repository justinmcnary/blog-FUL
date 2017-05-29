let expressSanitizer = require('express-sanitizer'),//eliminates script tags
    methodOverride   = require('method-override'), //fakes put route for html
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose')
    express          = require('express'),
    app              = express();

//APP CONFIG
mongoose.connect('mongodb://localhost/blog_rest');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//MONGOOSE/MODEL CONFIG
let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
let Blog = mongoose.model('Blog', blogSchema);

// RESTFUL ROUTES
//INDEX
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log(err);
    } else{
      res.render('index', {blogs: blogs});
    }
  });
});

//NEW ROUTE
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if(err) {
      res.render('new');
    } else{
      res.redirect('/blogs');
    }
  })
})

//SHOW
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err){
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: foundBlog});
    }
  });
});

//EDIT
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect('/blogs');
    } else{
      res.render('edit', {blog: foundBlog});
    }
  });
});

//UPDATE
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err) {
      res.redirect('/blogs');
    } else{
      res.redirect(`/blogs/${req.params.id}`)
    }
  })
});

//DESTROY
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect('/blogs');
    } else{
      res.redirect('/blogs');
    }
  })
});

app.listen(3000, function() {
  console.log('The BLOG is runnin on PORT 3000');
});