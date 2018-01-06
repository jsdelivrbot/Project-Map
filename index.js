var express = require('express');
var app = express();
var router = express.Router;
var request = require("request");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components/underscore'));
app.use(express.static(__dirname + '/bower_components/knockout/dist'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/Index');
});


app.get('/yelpReviews/:id', getYelpReview);
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

function getYelpReview(req, res) {
  var yelpId = req.params.id;
  var yelpBaseurl = "https://api.yelp.com/oauth2/token";
  request.post(yelpBaseurl, {
    form: {
      grant_type: "client_credentials",
      client_id: "iaRX4joOJIg9Da3oMz_raw",
      client_secret: "ZACyDM68ze0l7H0AWWvkfvVyezfWEFSPIOOCCfgywawXjvKudecJE56SwgKFFb02"
    }
  }, function (err, httpResponse, body) {
    if (err) {
      res.json({
        reviews: []
      });
    } else {
      request.get(`https://api.yelp.com/v3/businesses/${yelpId}/reviews`, {
        json: true,
        headers: {
          "Authorization": "Bearer " + JSON.parse(body).access_token
        }
      }, function (err, httpResponse, body) {
        if (err) {
          res.json({
            reviews: []
          });
        } else {
          res.json(body);
        }
      });
    }
  });
}