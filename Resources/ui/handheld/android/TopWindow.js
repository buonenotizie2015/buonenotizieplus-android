function TopWindow(title) {
	var jsonnews = require('services/json'), MasterView = require('ui/common/MasterView'), ArticleWindow = require('ui/common/ArticleWindow');

	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
		navBarHidden : false,
		barColor : '#333',
		barImage : '/images/navbar-bg.png',
		titleImage : '/images/logo-cut.png',
		top : 0,
		left : 0
	});
	
	self.addEventListener('focus', function() {
		flurry.onPageView();
		tracker.trackScreen("Più Votate");
	});
	
	var masterView = new MasterView();
	self.add(masterView);

	masterView.addEventListener('itemSelected', function(e) {
		var articleWindow = new ArticleWindow({
			containingTab : self.containingTab
		});
		self.containingTab.open(articleWindow);
		articleWindow.showArticleDetails(e.itemdata);
	});

	self.refreshTopJSON = function() {
		jsonnews.loadTopJson({
			success : function(data) {
				masterView.refreshTable(data);
			}
		});
	}
	// load initial rss feed
	self.refreshTopJSON();

	return self;
};
module.exports = TopWindow; 