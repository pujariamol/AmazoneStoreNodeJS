var mysqlController = require("../modules/mysqlController");
var utility = require("../modules/utility");

function index(req,res){
	res.render('addCategory',{
		username : req.session.userName
	});
}

function add(req,res){
	var content = {};
	
	var sql = "INSERT INTO category(NAME) VALUES ('"+ req.param('name')+"')";
	mysqlController.executeQuery(sql, function(err, results) {
		console.log("add ==== "+JSON.stringify(results));
		if (err) {
			console.log("Error occured while inserting category = " + err.message);
			res.statusCode = 400;
			content['status'] = "error";
			content['message'] = "ERROR occurred while adding new category!";
		} else {
			utility.addCategoryToCache(results.insertId,req.param('name'));
			content['status'] = "success";
			content['message'] = "Category added successfully";
			res.statusCode = 200;
		}
		res.send(content);
	});
}

exports.index = index;
exports.add = add;