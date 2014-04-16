/**
 * common javascript for client side validation and calls
 */

var jsonInput = {};
var cartCounter = 0;
var notificationClassName = {
	'error' : 'alert alert-danger',
	'info' : 'alert alert-info',
	'warning' : 'alert alert-warning',
	'success' : 'alert alert-success'
};

function ajaxCall(url, method) {
	var result = "";
	$.ajax({
		url : "/" + url,
		type : method,
		async : false,
		success : function(data) {
			result = data;
		}
	});
	return result;
}

function login() {
	if (validateLogin()) {
		var url = "signIn/login?" + $.param(jsonInput);
		var content = ajaxCall(url, "post");
		if (typeof content.redirect == 'string') {
			window.location = content.redirect;
		}
		$("#notification").html(content);
		clearJSON();
	}
}

function validateLogin() {
	var flag = true;
	if (typeof jsonInput['emailId'] == 'undefined'
			|| typeof jsonInput['password'] == 'undefined'
			|| jsonInput['emailId'] == "" || jsonInput['password'] == "") {
		flag = false;
		showNotification({
			'status' : 'info',
			'message' : 'Please enter credential!!'
		});
	}
	return flag;
}

function signUp() {
	if (validate()) {
		var url = "signUp/add?" + $.param(jsonInput);
		var content = ajaxCall(url, "post");
		showNotification(content);
		// $("#notification").html(content);
		clearJSON();
	}
}

function validate() {
	var flag = false;
	if (validatePassword() && validateEmail()) {
		flag = true;
	}
	return flag;
}

function validatePassword() {
	var flag = true;
	if ($("#pwd").val() != $("#confirmPwd").val()) {
		showNotification({
			'status' : 'info',
			'message' : 'Passwords do not match!!'
		});
		flag = false;
	}
	return flag;
}

function validateEmail() {
	var flag = true;
	var emailId = $("#emailId").val();
	var atpos = emailId.indexOf("@");
	var dotpos = emailId.lastIndexOf(".");
	if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailId.length) {
		showNotification({
			'status' : 'info',
			'message' : 'Not a valid e-mail address'
		});
		flag = false;
	}
	return flag;
}

/*
 * function signIn() { var emailId = $('#emailId').val(); var pass =
 * $('#password').val();
 * 
 * if (emailId == "" || pass == "") { $("#notifi").html("Please enter
 * credentials"); } else { var url = "login/" + emailId + "/" + pass; var val =
 * ajaxCall(url, "post"); if (typeof val.url != 'undefined') {
 * window.location.href = val.url; } else { $("#notifi").html(val.error); } } }
 */

function addToCart(productId) {
	incrementCartCounter();
	var url = "shoppingCart/add/" + productId + "/"
			+ $("#" + productId + "QuantityTxt").val();
	showNotification(ajaxCall(url, "post"));
}

function removeFromCart(productId) {
	decrementCartCounter();
	var url = "shoppingCart/remove/" + productId;
	showNotification(ajaxCall(url, "post"));
	$("#" + productId).hide(500);

}

function checkout() {
	window.location.href = "/shoppingCart";
}

function makePayment() {
	if ($("#cardNumber").val().match(/^\d{16}$/)) {
		var content = ajaxCall("shoppingCart/pay", 'post');
		showNotification(content);
	} else {
		showNotification({
			"status" : "error",
			"message" : "Invalid card number"
		});
	}
	// alert('\d{10}$/'.test($("#cardNumber").val()));

}

function addCategory(){
	var url = "category/add/"+ $("#categoryName").val();
	showNotification(ajaxCall(url, 'post'));
}

function addProduct(){
	var url = "product/add?" + $.param(jsonInput);
	alert(url);
	showNotification(ajaxCall(url,'post'));
}

// this will add the key and values to the JSON
// entered by the user
function addToJSON(obj) {
	jsonInput[obj.id] = obj.value;
}

function clearJSON() {
	jsonInput = {};
}

function showNotification(content) {
	$("#notification").attr('class', notificationClassName[content.status]);
	$("#notification").html(content.message);
}

function incrementCartCounter() {
	cartCounter++;
	$('#cartItemCount').html(cartCounter);
}

function decrementCartCounter() {
	cartCounter--;
	$('#cartItemCount').html(cartCounter);
}

function dropdownHandling(obj){
	window.location = '/catalog/category/'+obj.id+'/'+ $(obj).html();
}

