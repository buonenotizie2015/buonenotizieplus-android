// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});

// import module
var ExygySocialShare = require("com.exygy.socialshare");

// new button
var facebookShareButton = Titanium.UI.createButton({
	title: "Share on Facebook",
	top: "15dp",
	width: "80%",
	height: "40dp"
});

// when clicked, share url on Facebook
facebookShareButton.addEventListener("click", function(){
	ExygySocialShare.share({
		provider: "facebook",
		url: "http://exygy.com"
	});
});

//add button to window
win.add(facebookShareButton);

//open window
win.open();