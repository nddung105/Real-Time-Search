// Inlude module and package
const module_elastic = require("./module_elastic.js");

const express = require("express");
const app = express();

const path = require("path")
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.set("port", process.env.PORT || 8080);

app.use(express.static(path.join(__dirname,"public")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.sendFile('template.html', {
     root: path.join( __dirname, 'views' )
   });
})

app.get('/search', function (req, res){
  // declare the query object to search elastic search and return only 200 results from the first result found. 
  // also match any data where the name is like the query string sent in
  let body = {
    query: {
      match: {
          text: {
				  query: req.query['q']
		  }
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  module_elastic.query_data("message_edge",body)
  .then(results => {
    res.send(results.hits.hits);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

})

app.listen(app.get('port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});
