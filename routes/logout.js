/**
 * New node file
 */

function index(req,res){
	req.session.userName = "Guest";
	req.session.cartCount = 0;
	res.redirect("/");
}

exports.index = index;