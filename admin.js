	var express = require('express');
var app = express();
var mysql = require('mysql');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var con = require('./mysql');
var md5= require('md5');
var form = require('express-form');
var field = form.field;
var flash = require('express-flash');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

router.use(session({secret: '1234567890QWERTY', resave: true, saveUninitialized: true }));


/*-------- Authencation check section ------ */

var auth = function(req, res, next, email) {
    if (req.session.email) { 
    	return next(); 
    }
    else { 
        res.redirect('/'); 
    }
};


/* ----------- Logout section -------------------------*/
router.get('/logout', function (req, res) {
	req.session.destroy();
    res.redirect('/?status:logoutSucessfully');
	
});

/* ------------ Dashboard section (after login)--------- */
router.get('/dashboard', auth, function (req, res) {
	res.render('pages/dashboard');
});

router.get('/user-list', auth, function (req, res) {
	con.query('SELECT * FROM admin', function (err, rows) {
			if(rows.length)
			res.render("pages/user_list", {
				items: rows
			});
	});
});

router.get('/add-user', auth, function (req, res) {
	res.render('pages/form', {
		messages : req.flash('error')
	});
});

router.post('/submit-user',

	form(
			field('fname').trim().required(),
			field('lname').trim().required(),
			field('mobile').trim().required(),
			field('email').trim().required().isEmail(),
			field('password').trim().required()
		),

	function (req, res) {

		if(!req.form.isValid)
		{
			req.flash('error', req.form.errors);
			res.redirect('/add-user');
		}
		else
		{
			var fname = req.body.fname;
			var lname = req.body.lname;
			var mobile = req.body.mobile;
			var email = req.body.email;
			var password = md5(req.body.password);
		}
	
	
	
});

/* ------------------- End section ----------------------*/

module.exports = router 