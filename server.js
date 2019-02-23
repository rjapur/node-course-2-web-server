const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//process.env.PORT is for heroku, otherwise use port 3000
const port = process.env.PORT || 3000;

//creates an express app
var app = express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine', 'hbs');

//custom middleware and its only argument is a function
//we can use middleware to see if someone is log message to the screen or resend a request
//next exists to tell when we're done (or else the handler, for example, won't execute if we don't run next())
//it only executes after you visit the browser
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//use function takes the middleware function you want to use
//static takes the absolute path of teh folder you want to serve and you access through file.html
app.use(express.static(__dirname+'/public')); //middleware
//it was placed elsewhere to make sure maintenance will override all pages

//first argument is name, and second the function
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//routes handlers
//handler for http get call with two arguments, url and function to run - what send back to who made the call
//req stores a lot of information about the request coming in, headers, body
//res has methods so you can repsond the call
app.get('/', (req, res) => {
  //send() sends data back from server to client
  // res.send('<h1>Hello Express</h1>');
  // res.send({
  //   name: 'RJ',
  //   likes: [
  //     'Cats',
  //     'Movies'
  //   ]
  // });
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hi'
  })
});

//register new routes /projects
//create new template /include header, footer and welcomeMessage
//add new link to projects pages

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
    message: 'You are in the projects page'
  })
})

app.get('/about', (req, res) => {
  // res.send('About Page');
  //render let render the any template you have with the current view engine
  //just put the file name inside views folder
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to access the page'
  })
});

//binds the applictaion to a port and it accessed through the browser
//listen take two arguments, port and function to execute once the server is up
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
