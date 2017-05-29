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


app.listen(3000, function() {
  console.log('The BLOG is runnin on PORT 3000');
});