/**
 * Catalog
 */

var mysqlController = require("../modules/mysqlController");

var cacheData = {};


function index(req, res) {
	if (typeof req.session.category == 'undefined') {
		req.session.category = {
			"identifier" : 0,
			"name" : "All Category"
		};
	}
//	var sql = getQuery(req.session.category['identifier']);
//	console.log('sql = ' + sql);
	
	
	
	//console.log("-----------"+req.session.lastLogin);
	var products = fetchProductsByCategory(req.session.category['identifier']);
	var categories = cacheData['categories'];
	req.session.categoryList = categories;
	req.session.categoryList.push({
		"identifier" : 0,
		"name" : "All Category"
	});
	if (typeof req.session.userName == 'undefined') {
		req.session.userName = "Guest";
	}
	if (typeof req.session.cartCount == 'undefined') {
		req.session.cartCount = 0;
	}
	getLastLoginTime(req,res,products);
	/*	try {
		
		mysqlController.executeQuery(sql, function(err, results) {
			if (err) {
				res.statusCode = 400;
				res.send(err);
			} else {
				if (typeof req.session.userName == 'undefined') {
					req.session.userName = "Guest";
				}
				if (typeof req.session.cartCount == 'undefined') {
					req.session.cartCount = 0;
				}
				console.log("sql products ==== "+ JSON.stringify(results));
				getCategoryList(req, res, results);
			}
		});
	} catch (err) {

	}*/
}

function useCache(categoryId){
	
	var jsonArray = utility.fetchProductsByCategory(categoryId);
	console.log(categoryId + " -------  " +jsonArray.length +"------"+JSON.stringify(jsonArray));
}

function getCategoryList(req, res, products) {
	var value = {};
	
	var sql = "select identifier,name from category";
	console.log("getCategoryList");
	try {
		mysqlController.executeQuery(sql, function(err, results) {
			req.session.categoryList = results;
			req.session.categoryList.push({
				"identifier" : 0,
				"name" : "All Category"
			});
			console.log("inside get category");
			if (err) {
				console.log("Error retreiving category list :" + err.message);
			} else {
				res.render('catalog', {
					products : products,
					username : req.session.userName,
					count : req.session.cartCount,
					categories : results,
					lastLoginTime: req.session.lastLogin,
					selectedCategory : req.session.category
				});
			}
		});
	} catch (err) {

	}
}

function getQuery(categoryId) {
	var sql;
	if (categoryId == 0) {
		sql = "select IDENTIFIER,PRODUCT_NAME,BRAND,DESCRIPTION,PRICE,QUANTITY from product";
	} else {
		sql = "select IDENTIFIER,PRODUCT_NAME,BRAND,DESCRIPTION,PRICE,QUANTITY from product where category_id = "
				+ categoryId;
	}
	return sql;
}


function getLastLoginTime(req,res,products) {
	var productJSON = {};
	if(typeof req.session.userId == 'undefined'){
		req.session.userId =9;
	}
	var sql = "select LAST_LOGIN_TIME from user where identifier = " + req.session.userId;
	
	mysqlController.executeQuery(sql, function(err, results) {
		if (err) {
			console.log("Error : " + err.message);
		} else {
			req.session.lastLogin = results[0].LAST_LOGIN_TIME;
			res.render('catalog', {
				products : products,
				username : req.session.userName,
				count : req.session.cartCount,
				lastLoginTime : req.session.lastLogin,
				categories : req.session.categoryList,
				selectedCategory : req.session.category
			});
		}
	});
}


function cacheProduct() {
	var productJSON = {};
	var sql = "select IDENTIFIER,PRODUCT_NAME,BRAND,DESCRIPTION,PRICE,QUANTITY,CATEGORY_ID from product";
	mysqlController.executeQuery(sql, function(err, results) {
		if (err) {
			console.log("Error : " + err.message);
		} else {
			cacheData.product = results;
			console.log(JSON.stringify(cacheData.product));
			console.log("Product caching completed");
		}
	});
}



function fetchProductsByCategory(categoryId) {
	var data = new Array(0);
	if (categoryId == 0) {
		data = cacheData['product'];
	} else {
		var j = 0;
		for (var i = 0; i < cacheData['product'].length; i++) {
			if (cacheData['product'][i].CATEGORY_ID == categoryId) {
				data.push(cacheData['product'][i]);
				j++;
			}
		}
	}
	return data;
}

function cacheCategories() {
	var content = {};
	var sql = "select identifier,name from category";
	var categoryJSON = {};
	mysqlController.executeQuery(sql, function(err, results) {
		if (err) {
			console.log("Error : " + err.message);
		} else {

			cacheData.categories = results;
			console.log("Category caching completed");
		}
	});
}



function cacheCatalogData(){
	cacheCategories();
	cacheProduct();
}


exports.index = index;
exports.cacheCatalogData =cacheCatalogData;