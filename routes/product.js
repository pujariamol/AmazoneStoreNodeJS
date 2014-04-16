/**
 * Add new product
 */


var mysqlController = require("../modules/mysqlController");
var utility = require("../modules/utility");

function index(req, res) {
	var sql = "select identifier,name from category";
	if(typeof req.session.userName == 'undefined'){
		req.session.userName = "Guest";
	}
	mysqlController.executeQuery(sql, function(err, results) {
		if (err) {
			console.log("Error occured while fetching category list = "
					+ err.message);
			res.statusCode = 400;
			res.send(err);
		} else {
			res.render('addProduct', {
				categories : results,
				username : req.session.userName
			});
		}
	});
}

function add(req, res) {
	var content = {};
	var sql = "INSERT INTO PRODUCT(PRODUCT_NAME,BRAND,DESCRIPTION,PRICE,QUANTITY,CATEGORY_ID) VALUES ('"
			+ req.param('productName')
			+ "','"
			+ req.param('brandName')
			+ "','"
			+ req.param('description')
			+ "',"
			+ req.param('price')
			+ ","
			+ req.param('inStock') + "," + req.param('categoryId') + ")";
	console.log(sql);
	mysqlController.executeQuery(sql, function(err, results) {
		if (err) {
			console.log("Error occured while inserting product = "
					+ err.message);
			res.statusCode = 400;
			content['status'] = "error";
			content['message'] = "ERROR occurred while adding new product!";
		} else {
			res.statusCode = 200;
			content['status'] = "success";
			content['message'] = "Product added successfully";
			utility.addProductToCache(results.insertId,req.param('productName'),req.param('brandName'),req.param('description'),req.param('price'),req.param('inStock'),req.param('categoryId'));
		}
		res.send(content);
	});
}

exports.index = index;
exports.add = add;