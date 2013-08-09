//Detail View Component Constructor
function DetailView() {
	var self = Ti.UI.createView();
	var webview = Ti.UI.createWebView({
		top:0,
		bottom:0,
		left:0,
		right:0,
	});
	var webviewTitle = webview.evalJS("document.title");
	self.add(webview);

	self.showArticle = function(url) {
		webview.url = url;
	};
	
	self.getWebviewTitle = function(){
		return webviewTitle;
	}
	
	webview.addEventListener('load', function(e) {
		webviewTitle = webview.evalJS("document.title");
		self.fireEvent('articleLoaded'); 
	});
	
	return self;
}
module.exports = DetailView;
