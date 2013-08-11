function StreamWindow(title) {
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
		self.refreshJSON();
		
    	flurry.onPageView();
    	tracker.trackScreen("Stream");
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
	
	var pageView = 0;
	
	masterView.addEventListener('loadMoreArticles', function(e) {
		pageView++;
		jsonnews.loadArticles({
			success : function(data) {
				masterView.moreArticles(data);
			}
		}, pageView);
	});


	self.refreshJSON = function() {
		pageView = 0;
		jsonnews.loadArticles({
			success : function(data) {
				masterView.refreshTable(data);
			}
		}, pageView);
	}
	
	//BANNER PUBBLICITARIO
	var separator = Ti.UI.createView({
        width:'100%',
        height:2,
        backgroundColor:'#00aeef',
        bottom:50,
    });
   	var banner = Titanium.UI.createWebView({
   		url:'http://www.buonenotizie.it/adv/android/banner-android.html',
   		width:"100%",
   		height:50,
   		left:0,
   		bottom:0
   	});
   	var closeBannerButton = Ti.UI.createButton({
       title:'X',
       color:"#444",
       width:30,
       height:30,
       bottom:41,
       right:0,
       style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
       backgroundColor:"#ccc"
   	});
 	
	closeBannerButton.addEventListener('click',function(e){
    	banner.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT, opacity:0, duration:500});
    	closeBannerButton.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT, opacity:0, duration:500});
    	separator.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT, opacity:0, duration:500});
    	
 		tracker.trackEvent({
			category : "banner",
			action : "action",
			label : "close",
			value : 1
		});
		flurry.logEvent('banner', {what: "close"});   	
	});
	
	self.add(separator);
	self.add(banner);
	self.add(closeBannerButton);

	// load initial rss feed
	self.refreshJSON();
	
	
	return self;
};
module.exports = StreamWindow;
