var express = require('express');
var router = express.Router();

module.exports = router;


// =========================================================
// =
// =   SET UP MONGODB AND MONGOOSE
// =

// MongoDB is a JavaScript-oriented database.
// http://docs.mongodb.org/manual/core/crud-introduction/

// --> In Cloud9, you need to start MongoDB before running your app by typing 
// ./mongod 
// at the terminal ("bash" window). But you only need to do that once per workspace. 
// MongoDB should run forever after that.

// Mongoose makes it easy to access MongoDB using a pattern of "models".
// http://mongoosejs.com

// Use Mongoose to connect to the MongoDB database. We'll call our
// database "networks". It will be created automatically if it doesn't already exist.

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || ('mongodb://' + process.env.IP + '/networks'));




// =========================================================
// =
// =   DEFINE OUR DATA MODELS
// =

// Define the data structure of a Text Item models (tables)
// Allowed data types (Number, String, Date...): http://mongoosejs.com/docs/schematypes.html


var Textitem = mongoose.model('Textitem', {
  entry: {type: String, required: true},
  length:{type: Number, required: false},
  longwords:{type: String, required: false},
});


var Textitem2 = mongoose.model('Textitem2', {
  entry: {type: String, required: true},
  length:{type: Number, required: false},
  longwords:{type: String, required: false},
});


// =========================================================
// =   TEXT PROCESSING 


var inputlengthcalc = function(input){
  var inputlength = input.length;
  return inputlength;
  
};


// input text to words array
var inputwords = function(input){
  // using regex to get the individual words out of the inpur string: http://codereview.stackexchange.com/questions/65049/finding-longest-word-in-a-string
  var textwords = input.replace(/[^A-Za-z\s]/g, "").split(" ");
  return textwords;
};


var longwords = function(input){
  var textwords = inputwords(input);
  var wordsofcertainlength =[]; // in this case we're using five, we could do this in setup
  
  for (var i = 0; i < textwords.length; i++ ){
    var texttomeasure = textwords[i];
    if (texttomeasure.length > 6) {
    wordsofcertainlength.push(texttomeasure);
    }
  }
 
  var wordsofcertainlength = wordsofcertainlength.reverse().join(" ");
  
  return wordsofcertainlength.toString();
  
};

  
  
// HOME PAGE
//
router.get('/', function(request, response, toss) {
  
  
  // When the server receives a request for "/", this code runs

  // Find all the records in the database
  Textitem.find(function(err, textitems) {
    // This code will run once the database find is complete.
    // textitems will contain a list (array) of all the textitems that were found.

    // If there's an error, tell Express to do its default behavior, which is show the error page.
    if (err) return toss(err);
    
    // The list of textitems will be passed to the template.
    // Any additional variables can be passed in a similar way (response.locals.foo = bar;)
    response.locals.textitems = textitems;
      
    // catch(err) {
    //   return toss(err);
    // }
    
    response.locals.layout = 'layout';
  
  // Render the "home" template (located in the "views" folder).
    response.render('home');

  });
 
});



// SOLO PAGE
//
router.get('/solo', function(request, response, toss) {
  
  // When the server receives a request for "/solo", this code runs
  
// Textitem2.collection.drop();

  // Find all the records in the database
  Textitem2.find(function(err, textitems) {
    // This code will run once the database find is complete.
    // textitems will contain a list (array) of all the textitems that were found.

    // If there's an error, tell Express to do its default behavior, which is show the error page.
    if (err) return toss(err);
    
    // The list of textitems will be passed to the template.
    // Any additional variables can be passed in a similar way (response.locals.foo = bar;)
    response.locals.textitems = textitems;
    
    // catch(err) {
    //   return toss(err);
    // }
    
    response.locals.layout = 'layout';
  
  // Render the "home" template (located in the "views" folder).
    response.render('solo');

  });
  
});


// GROUP PAGE
//
router.get('/group', function(request, response, toss) {
  
  
  // Textitem.collection.drop();
  
  // When the server receives a request for "/group", this code runs

  // Find all the records in the database
  Textitem.find(function(err, textitems) {
    // This code will run once the database find is complete.
    // textitems will contain a list (array) of all the textitems that were found.

    // If there's an error, tell Express to do its default behavior, which is show the error page.
    if (err) return toss(err);
    
    // The list of textitems will be passed to the template.
    // Any additional variables can be passed in a similar way (response.locals.foo = bar;)
    response.locals.textitems = textitems;
    
    // catch(err) {
    //   return toss(err);
    // }
    
    response.locals.layout = 'layout';
  
  // Render the "group" template (located in the "views" folder).
    response.render('group');

  });
  
});





// CREATE 1 PAGE - GROUP

router.get('/create1', function(request, response, toss) {
  
  // When the server receives a request for "/create1", this code runs
  
  response.locals.layout = 'layout';

  // Make a new Textitem in memory, with the parameters that come from the URL 
  // ?width=25&height=25&top=25&left=25&color=#ff0000
  // and store it in the entry variable
  
  var textitem = new Textitem({
    entry: request.query.entry,
    length: inputlengthcalc(request.query.entry),
    longwords: longwords(request.query.entry),
    author: request.query.author,
    
  });
  
  // Now save it to the database
  textitem.save(function(err) {
    // This code runs once the database save is complete

    // An err here can be due to validations
    if (err) return toss(err);

  });
 
  
   // Otherwise render a "thank you" page
    response.locals.textitem = textitem;
    
    response.redirect('/group');
    // to send the user straight to the homepage after saving
  
});




// CREATE 2 PAGE - SOLO

router.get('/create2', function(request, response, toss) {
  
  // When the server receives a request for "/create2", this code runs
  
  response.locals.layout = 'layout';

  // Make a new Textitem in memory, with the parameters that come from the URL 
  // ?width=25&height=25&top=25&left=25&color=#ff0000
  // and store it in the entry variable
  
  var textitem = new Textitem2({
    entry: request.query.entry,
    length: inputlengthcalc(request.query.entry),
    longwords: longwords(request.query.entry),
    author: request.query.author,
    
  });
  
  // Now save it to the database
  textitem.save(function(err) {
    // This code runs once the database save is complete

    // An err here can be due to validations
    if (err) return toss(err);

  });
 
  
   // Otherwise render a "thank you" page
    response.locals.textitem = textitem;
    
    response.redirect('/solo');
    // to send the user straight to the homepage after saving
  
});



// SHOW PAGE
// /show?id=54e2058e85b156d10b064ca0
// Shows a _single_ item

router.get('/show', function(request, response, toss) {
  
  // When the server receives a request for "/show", this code runs
  
  // Find a Textitem with this id
  Textitem.findOne({_id: request.query.id}, function(err, textitem) {
    // This code will run once the database find is complete.
    // phrase will contain the found phrase.
    // err will contain errors if any (for example, no such record).

    if (err) return toss(err);
    
    var inputlength = inputlengthcalc(textitem.entry);
    console.log(inputlength);
    
    var longwordsinentry = textitem.longwords;
    
    response.locals.textitem = textitem;
    response.locals.inputlength = inputlength;
    response.locals.longwordsinentry = longwordsinentry;
    response.locals.layout = 'layout';
    response.render('show');
    
  });
  
});



// NEW PAGE
// /new

router.get('/new', function(request, response) {

  // When the server receives a request for "/new", this code runs
  // Just render a basic HTML page with a form. We don't need to pass any variables.

  response.locals.layout = 'layout';
  response.render('new');
  
  // Please see views/new.hbs for additional comments
  
});






// router.get('/delete', function(request, response, toss) {
  
//   // When the server receives a request for "/delete", this code runs
  
//   response.locals.layout = 'layout';
  
//   var deleteid = request.query.id; 
  
//   console.log(deleteid);
  
//   var deleteitem = Textitem.find({ id:deleteid });

  
//   // Now delete it to the database
//   Textitem.find({ _id:deleteid }).remove(function(err) {
//     // This code runs once the database save is complete

//     // An err here can be due to validations
//     if (err) return toss(err);
    
//     // Alternatively we could just do
//     response.redirect('/');
//     // to send the user straight to the homepage after saving the new shape

//   });
// });



// ABOUT PAGE
// /about

router.get('/about', function(request, response) {

  // When the server receives a request for "/about", this code runs

  response.locals.layout = 'layout';
  response.render('about');
  
});