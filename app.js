/*******************************************************************************
 * Module dependencies.
 ******************************************************************************/

var express = require('express');
var routes = require('./routes/');
var signIn = require('./routes/signIn');
var signUp = require('./routes/signUp');
var catalog = require('./routes/catalog');
var logout = require('./routes/logout');
var shoppingCart = require('./routes/shoppingCart');
var product = require('./routes/product');
var category = require('./routes/category');
var http = require('http');
var path = require('path');

/** ************************************************************************** */

/** ******************************Configuration Starts************************* */
var app = express();
app.use(express.cookieParser());
app.use(express.session({
	secret : '1234567890QWERTY'
}));
app.set('port', process.env.PORT || 3030);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function() {
	catalog.cacheCatalogData();
	console.log('Express server listening on port ' + app.get('port'));
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/** ******************************Configure ends******************************* */

/** ******************************Routes Start********************************* */
/*
app.all('*', function(req, res, next) {
	console.log("-----"+req.session.userName);
	if (typeof req.session.userName != 'undefined') {
		res.send(200);
		next();
	}else{
		res.redirect("/");
		next();
	}
});*/

app.get('/', signIn.index);
app.get('/signIn', signIn.index);
app.get('/signUp', signUp.index);
app.get('/catalog', catalog.index);
app.get('/catalog/category/:identifier/:name', catalog.index);
app.get('/addProduct', product.index);
app.get('/addCategory', category.index);
app.get('/shoppingCart', shoppingCart.index);
app.get('/logout', logout.index);

app.post('/signIn/login', signIn.login);
app.post('/signUp/add', signUp.add);
app.post('/shoppingCart/add/:productId/:quantity', shoppingCart.add);
app.post('/shoppingCart/remove/:productId',shoppingCart.remove);
app.post('/shoppingCart/pay',shoppingCart.pay);
app.post('/category/add/:name',category.add);
app.post('/product/add',product.add);
//app.post('/categoryList', catalog.categoryList);

/** ******************************Routes Ends********************************* */

