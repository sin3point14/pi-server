'use strict'
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

/**********************/
//var routes = require('./routes/index');

var app = express();

var sockIO = require('socket.io')();
app.sockIO = sockIO;

var client = null

// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/***************************************/
//app.use('/', routes);
/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	console.log("dev mode on")
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message
	});
});
*/
function web3api(candidate, uid){
	/********DUMMY CODE********/
	return true
}

sockIO.on('connection', function (socket) {
	client = socket
	console.log('socket connection');
	socket.on('disconnect', function () {
		resetClient()
	})
	socket.on('vote', function (candidate) {
		console.log("Vote Received")
		if(verified){
			if(web3api(candidate, aadhaar.uid)) {
				client.emit('success')
			}
			else {
				client.emit('error', 'web3api error')
			}
		}
		else {
			client.emit('error', 'client not verified')
		}
	})
})

//var app = express.app();
var xmlparser = require('xml2js').parseString;

var fingerprint = null
var aadhaar = null
var verified = false

function resetClient() {
	console.log("Resetting Client socket")
	fingerprint = null
	client = null
	aadhaar = null
	verified = false
}

function getCandidateList(pc) {
	console.log("Generating Candidate List")
	/********DUMMY CODE********/
	var list = []
	list.push({
		id: 42,
		party: 'Nazi',
		link: 'https://i.imgur.com/d0YO8I3.png',
		name:'Pewdiepie',
		party_local: 'नाजी',
		name_local:'पीयूडीपाई'
	})
	list.push({
		id: 69,
		party: 'Democratic',
		link: 'https://i.imgur.com/d0YO8I3.png',
		name:'BlACK Donald trump',
		party_local: 'डेमोक्रेटिक',
		name_local:'ब्लेक डोनाल्ड ट्रम्प'
	})
	list.push({
		id: 420,
		party: 'INDEPENDENT',
		link: 'https://i.imgur.com/d0YO8I3.png',
		name:'Saladass',
		party_local: 'स्वतंत्र',
		name_local:'सैलेडैस',
	})
	return list
}

function verify() {
	console.log("Verify")
	/********DUMMY VALUES********/
	if(true && true) { 
		client.emit('verified')
		let list = getCandidateList(aadhaar.pc)
		if(client != null) {
			client.emit('candidateList', list)
			verified = true
		}
		else {
			resetClient()
		}
	}
	else {
		client.emit('veriFailed')
		resetClient()
	}
}

app.post('/qr', function (req, res, next) {
	console.log("QR Post")
	if (client != null) {
		if (aadhaar == null) {
			xmlparser(req.body.text, function (err, result) {
				console.log(JSON.stringify(result.PrintLetterBarcodeData.$.uid))
				aadhaar = result.PrintLetterBarcodeData.$
			})
			res.render('error', { message: "SUCCESS: QR Stored" })
			client.emit('qr', aadhaar)
		}
		else {
			res.render('error', { message: "ERROR: QR Already Stored" })
		}
		if (fingerprint != null && aadhaar != null)
			verify()
	}
	else {
		res.render('error', { message: "ERROR: No client connection" })
		resetClient()
	}
})

app.post('/fingerprint', function (req, res, next) {
	console.log("Fingerpring Post")
	if (client != null) {
		if (fingerprint == null) {
			fingerprint = req.body.fingerprint
			res.render('error', { message: "SUCCESS: Fingerprint Stored" })
			client.emit('fingerprint')
		}
		else {
			res.render('error', { message: "ERROR: Fingerprint Already Stored" })
		}
		if (fingerprint != null && aadhaar != null)
			verify()
	}
	else {
		res.render('error', { message: "ERROR: No client connection" })
		resetClient()
	}
})

app.get('/', function (req, res, next) {
	console.log("Root Get")
	if (client == null)
		res.render('index', { title: 'form bharo' })
	else
		res.render('error', { message: 'EVM already connected' })
})

module.exports = app;
