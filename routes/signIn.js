/**
 * Handles everything related to signIn page
 */

var mysqlController = require("../modules/mysqlController");
var catalog = require('./catalog');

function index(req, res) {
	res.render('signIn', {});
}

function validate(req, res) {
	var emailId = req.param('emailId');
	var pwd = req.param('password');
	console.log("emailId = " + emailId + " password =" + pwd);
}

function login(req, res) {
	var sql = "select count(*) as count,identifier from user where EMAIL_ID = '"
			+ req.param('emailId') + "' and PWD = '" + req.param('password')
			+ "'";

	console.log(sql);

	mysqlController.executeQuery(sql, function(err, rows, fields) {
		if (err) {
			console.log("ERROR while retreiving: " + err.message);
			res.send("Authentication Failed !!");
		} else if (rows[0].count > 0) {
			req.session.userName = req.param('emailId');
			req.session.userId = rows[0].identifier;
			updateLastLoginTime(req.param('emailId'), req.param('password'));
			res.send({
				redirect : '/catalog'
			});
		} else {
			res.send("Wrong crendentials!!");
		}
	});

}

function updateLastLoginTime(emailId, password) {
	var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	var updateSql = "update user set LAST_LOGIN_TIME = '" + date
			+ "' where EMAIL_ID = '" + emailId + "' and PWD = '" + password
			+ "'";

	console.log("updateSql = " + updateSql);
	mysqlController.executeQuery(updateSql);

}

exports.index = index;
exports.validate = validate;
exports.login = login;
