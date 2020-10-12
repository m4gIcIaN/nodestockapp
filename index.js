// Stock Market App
const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 5000;

// API KEY pk_759c1cb0a6ca42c999b381c5e92014e3 
// create call api function
function call_api(finishedAPI, ticker){
	request('https://cloud.iexapis.com/stable/stock/'+ticker+'/quote?token=pk_759c1cb0a6ca42c999b381c5e92014e3', { json: true}, (err, res, body) => {
		if (err) {
			return console.log(err);
		}

		if (res.statusCode === 200) {
			// console.log(body);
		 	finishedAPI(body);
		}
	});
}
// Set handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// Sets home page get handle
app.get('/', function (req, res) {
	call_api(function(doneAPI) {
			res.render('home', {
	    	stock: doneAPI
   		});
	}, 'fb');
});

// Sets home page post handle
app.post('/', function (req, res) {
	call_api(function(doneAPI) {
			res.render('home', {
	    	stock: doneAPI,
   		});
	}, req.body.stock_ticker);
});

// Sets about page handle
app.get('/about.html', function (req, res) {
    res.render('about');
});


// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
	console.log('Server listening on port', PORT);
});