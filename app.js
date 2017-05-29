let express  = require('express'),
  bodyParser = require('body-parser'),
  mongoose   = require('mongoose')
  app        = express();

//APP CONFIG
mongoose.connect('mongodb://localhost/blog_rest');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

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


app.listen(3000, function() {
  console.log('The BLOG is runnin on PORT 3000');
});