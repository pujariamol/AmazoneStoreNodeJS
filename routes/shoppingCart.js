/**
 * Shopping cart
 */

var mysqlController = require("../modules/mysqlController");
var utility = require("../modules/utility");

function index(req, res) {
	var sql = "select p.IDENTIFIER,p.PRODUCT_NAME, p.BRAND, p.DESCRIPTION, p.PRICE, s.ORDERED_QUANTITY "
			+ "from shopping_cart s,product p where s.USER_ID = "
			+ req.session.userId
			+ " and s.PRODUCT_ID = p.IDENTIFIER and s.ORDER_STATUS = 'Pending'";
	console.log(sql);
	mysqlController.executeQuery(sql, function(err, results) {
		if (req.session.userName == "") {
			req.session.userName = "Guest";
		}
		req.session.cartCount = results.length;
		var totalAmount = 0;
		for (var i = 0; i < results.length; i++) {
			console.log(results[i].PRICE);
			totalAmount += results[i].PRICE * results[i].ORDERED_QUANTITY;
		}
		res.render('shoppingCart', {
			products : results,
			username : req.session.userName,
			total : totalAmount,
			count : req.session.cartCount,
			categories : req.session.categoryList,
			selectedCategory : req.session.category
		});
	});

}

function add(req, res) {
	console.log(req.param('productId') + " Add to shopping cart");
	var content = {};

	var sql = "INSERT INTO SHOPPING_CART(USER_ID, PRODUCT_ID, ORDERED_QUANTITY, ORDER_STATUS) VALUES ("
			+ req.session.userId
			+ ","
			+ req.param('productId')
			+ ","
			+ req.param('quantity') + ", 'Pending')";
	console.log(sql);
	try {
		mysqlController
				.executeQuery(
						sql,
						function(err, results) {
							if (err) {
								console.log("ERROR In insert: " + err.message);
								content['status'] = "error";
								content['message'] = "ERROR occurred while adding to shopping cart!";
								res.statusCode = 500;
							} else {
								content['status'] = "success";
								content['message'] = "Product Added To Cart Successfully!!";
								maintainProductCount(req.param('productId'),
										req.param('quantity'));
								res.statusCode = 200;

							}
							res.send(content);
						});
	} catch (e) {
		res.statusCode = 500;
		console.log("ERROR In insert: " + e.message);
		res.send("Error while adding to shopping cart");

	}

}

function remove(req, res) {
	console.log("Remove from shopping cart");
	var content = {};
	var sql = "update SHOPPING_CART set ORDER_STATUS = 'deleted' where USER_ID = "
			+ req.session.userId
			+ " and PRODUCT_ID = "
			+ req.param('productId');
	console.log(sql);
	try {
		mysqlController
				.executeQuery(
						sql,
						function(err, results) {
							if (err) {
								console.log("ERROR In insert: " + err.message);
								content['status'] = "error";
								content['message'] = "ERROR occurred while adding to shopping cart!";
								res.statusCode = 500;
							} else {
								content['status'] = "success";
								content['message'] = "Item removed from cart successfully!!";
								res.statusCode = 200;
							}
							res.send(content);
						});
	} catch (e) {
		res.statusCode = 500;
		console.log("ERROR In insert: " + e.message);
		res.send("Error while adding to shopping cart");

	}
}

function pay(req, res) {
	var content = {};
	var sql = "update SHOPPING_CART set ORDER_STATUS = 'delivered' where USER_ID = "
			+ req.session.userId;
	console.log(sql);
	try {
		mysqlController
				.executeQuery(
						sql,
						function(err, results) {
							if (err) {
								console.log("ERROR In insert: " + err.message);
								content['status'] = "error";
								content['message'] = "ERROR occurred while adding to shopping cart!";
								res.statusCode = 500;
							} else {
								content['status'] = "success";
								content['message'] = "Transaction completed. The product will be delivered within 5-6 business days";
								res.statusCode = 200;
								req.session.cartCount = 0;
							}
							res.send(content);
						});
	} catch (e) {
		res.statusCode = 500;
		console.log("ERROR In insert: " + e.message);
		res.send("Error while adding to shopping cart");

	}
}

/*
 * function getCartList(userId) { var sql = "select * from shopping_cart where
 * user_id = " + userId; return mysqlController.executeQuery(sql, function(err,
 * results) { }); }
 */

function maintainProductCount(productId, quantity) {
	var sql = "update PRODUCT set QUANTITY = QUANTITY - " + quantity;
	try {
		mysqlController.executeQuery(sql, function(err, results) {
			if (err) {
				console.log("ERROR In insert: " + err.message);
			} else {
				utility.updateProductQuantity(productId,quantity);
				console.log("Product Quantity Updated");
			}
		});
	} catch (e) {
		console.log("ERROR In insert: " + e.message);
	}

}

exports.index = index;
exports.add = add;
exports.remove = remove;
exports.pay = pay;