/**
 * New node file
 */
var mysqlController = require("../modules/mysqlController");

var cacheData = new Array();

function doDataCache() {
	cacheCategories();
	cacheProduct();
	// cacheProducts();
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
			console.log("================================================="
					+ JSON.stringify(cacheData.categories));
			console.log("Category caching completed");
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

function fetchProduct(productId) {
	var products = cacheData['products'].productId;
	console.log(JSON.stringify(products));
}

function fetchCategories() {
	return cacheData['categories'];
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

function addCategoryToCache(id, name) {
	cacheData['categories'].push({
		"identifier" : id,
		"name" : name
	});
}

function addProductToCache(id, productName, brandName, description, price,
		inStock, categoryId) {
	cacheData['product'].push({
		"IDENTIFIER" : id,
		"PRODUCT_NAME" : productName,
		"BRAND" : brandName,
		"DESCRIPTION" : description,
		"PRICE" : price,
		"QUANTITY" : inStock,
		"CATEGORY_ID" : categoryId
	});
}

function updateProductQuantity(id, quantity) {
	for (var i = 0; i < cacheData['product'].length; i++) {
		if (cacheData['product'][i].IDENTIFIER == id) {
			cacheData['product'][i].QUANTITY = quantity;
			break;
		}
	}
}

exports.doDataCache = doDataCache;
exports.fetchProductsByCategory = fetchProductsByCategory;
exports.updateProductQuantity = updateProductQuantity;
exports.fetchCategories = fetchCategories;
exports.addCategoryToCache = addCategoryToCache;
exports.addProductToCache = addProductToCache;
