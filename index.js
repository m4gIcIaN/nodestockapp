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
function call_basic(finishedAPI, ticker){
	request('https://cloud.iexapis.com/stable/stock/'+ticker+'/quote?token=<token here>', { json: true}, (err, res, body) => {
		if (err) {
			return console.log(err);
		}

		if (res.statusCode > 399) {
			finishedAPI({'status': 'incorrect'});
		}

		if (res.statusCode === 200) {
			// console.log(body);
		 	finishedAPI(body);
		}
	});
}

function call_balance_sheet(ticker){
	request('https://cloud.iexapis.com/stable/stock/'+ticker+'/balance-sheet?<token here>', { json: true}, (err, res, body) => {
		return body;
	});
}

function call_cash_flow(ticker){
	request('https://cloud.iexapis.com/stable/stock/'+ticker+'/cash-flow?<token here>', { json: true}, (err, res, body) => {
		return body;
	});
}
// Set handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// Sets home page get handle
app.get('/', function (req, res) {
	call_basic(function(doneAPI) {
			res.render('home', {
	    		stock: doneAPI
   			});

	}, 'fb');
});

// Sets home page post handle
app.post('/', function (req, res) {
	const balance_sheet = call_balance_sheet(req.body.stock_ticker);
	const cash_flow = call_cash_flow(req.body.stock_ticker);
	call_basic(function(doneAPI) {
		console.log(doneAPI);
		if (doneAPI.status !== 'incorrect') {
			res.render('stock', {
		    	stock: doneAPI,
		    	bal: balance_sheet,
		    	cash: cash_flow
	   		});
		} else {
			res.render('home', {});
		}
	}, req.body.stock_ticker);
});

// Sets about page handle
// app.get('/about.html', function (req, res) {
//     res.render('about');
// });


// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
	console.log('Server listening on port', PORT);
});