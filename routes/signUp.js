/**
 * Handles everything related to signIn page
 */
var mysqlController = require("../modules/mysqlController");

function index(req, res) {
	res.render('signUp', {});
}

// check for existing username
function validateSignUpForm(emailId, callback) {

}

function add(req, res) {
	var content = {};
	// check for duplicate username
	try {
		var sql = "select count(*) as count from user where EMAIL_ID = '"
				+ req.param('emailId') + "'";
		mysqlController
				.executeQuery(
						sql,
						function(err, rows, fields) {
							if (err) {
								content['status'] = 'error';
								content['message'] = 'Error occurred : '
										+ err.message;
								res.send(content);
							} else if (rows[0].count > 0) {
								content['status'] = 'info';
								content['message'] = 'User with same username already exists!!';
								res.send(content);
							} else {
								var sql = "insert into user(email_id,first_name,last_name,pwd) values ('"
										+ req.param("emailId")
										+ "','"
										+ req.param("firstName")
										+ "','"
										+ req.param("lastName")
										+ "','"
										+ req.param("pwd") + "')";

								mysqlController
										.executeQuery(
												sql,
												function(err, results) {
													if (err) {
														console
																.log("ERROR In insert: "
																		+ err.message);
														content['status'] = "error";
														content['message'] = "ERROR occurred while creating an user!";
													} else {
														content['status'] = "success";
														content['message'] = "User Added Successfully!!";
													}
													res.send(content);
												});
							}
						});
	} catch (err) {
		content['status'] = "error";
		content['message'] = "Error Occurred" + err.message;
		res.send(content);
	}
}

function createUser(req, res) {
	console.log("Inside createuser method");
	var content = {};
	var sql = "insert into user(email_id,first_name,last_name,pwd) values ('"
			+ req.param("emailId") + "','" + req.param("firstName") + "','"
			+ req.param("lastName") + "','" + req.param("pwd") + "')";

	mysqlController.executeQuery(sql, function(err, results) {
		if (err) {
			console.log("ERROR In insert: " + err.message);
			content['status'] = "error";
			content['message'] = "ERROR occurred while creating an user!";
		} else {
			content['status'] = "success";
			content['message'] = "User Added Successfully!!";
		}
		res.send(content);
	});
}

exports.index = index;
exports.add = add;