var mysql = require('mysql');
var connectionPool = new Array();
var connectionPoolSize = 10;

function connect() {
	connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		port : '3306',
		database : 'amazon273'
	});
}
connect();
//createConnection();

function createConnection() {
	for (var i = 0; i < connectionPoolSize; i++) {
		var connection = mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'root',
			port : '3306',
			database : 'amazon273'
		});
		connectionPool.push(connection);
	}
}

function getConnection(callBack) {
	if (connectionPool.length == 0) {
		while(connectionPool.length > 0){
			callBack();
		}
	} else {
		connection = connectionPool.pop();
	}
	return connection;
}

function returnConnection(connection) {
	console.log("return Connection");
	connectionPool.push(connection);
	console.log("connectionPool length " + connectionPool.length);
}

function executeQuery(sql, callBack) {
	//var connection = getConnection(function(){
		connection.query(sql,callBack);
	//	returnConnection(connection);
	//});
}

exports.connect = connect;
exports.executeQuery = executeQuery;
