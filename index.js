var express = require('express');  // include express 
var app = express();               // creating app 
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');     // require body-parser for get form data 
var md5 = require('md5');                    // require for conver md5
var session = require('express-session');    // require for session 
var port = process.env.PORT || 5000 ;        // setting port 
var con = require('./mysql');
var form = require('express-form');          // express-form is required for form validation 
var field = form.field;                      // geting form fields 
var flash = require('express-flash');        // sending flash messages to rendering page 


//set view engine ejs as default for express application 
app.set('view engine', 'ejs');

//set path to static url for express 
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

router.use(session({secret: '1234567890QWERTY', resave: true, saveUninitialized: true }));

app.use('/admin', require('./admin.js'));

// Render page useing ejs templating 

router.get('/', function (req, res) {
	res.render('pages/login', {
		messages : req.flash('error')
	});
});



router.post('/admin-login',

	form(
			field("email").trim().required().isEmail(),
			field("password").trim().required()
		),

		function (req, res) {

		if(!req.form.isValid) 
		{
			req.flash('error', req.form.errors);
			res.redirect('/');
		}
		else
		{
		var email = req.body.email ;
		var password  = md5(req.body.password);

		// select query for mysql
		con.query('SELECT * FROM admin WHERE email = ? AND password = ?', [email, password], function (err, result) {
			if(result.length)
			{
				req.session.email = result[0].email;
				req.session.role  = 'admin';
				res.redirect('/admin/dashboard/?stauts=loginsuccess');
			}
			else
			{
				req.flash('error', 'Please fill correct email and password');
				res.redirect('/');
			}
	});
	}
	
});


/* -- Assigning port to node application --*/
var server = app.listen(port, function () {
    console.log('Node server is running..');
});

app.use('/', router);
module.exports = router;

   