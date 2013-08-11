//Detail View Component Constructor
function ArticleWindow() {
	var DetailView = require('ui/common/DetailView');

	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
		barColor : '#333',
		width : 'auto',
		height : 'auto'
	});

	var webview = null;
	var webWindow = Ti.UI.createWindow({
		barColor : '#333',
		activity : {
			onCreateOptionsMenu : function(e) {
				var menuItem = e.menu.add({
					title : 'Reload'
				});
				menuItem.addEventListener('click', function(e) {
					webview.reload();
				});
			}
		}
	});
	var closeWebWin = Titanium.UI.createButton({
		title : 'Close',
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	webWindow.setLeftNavButton(closeWebWin);
	closeWebWin.addEventListener('click', function() {
		webWindow.close();
	});

	var backbutton = Titanium.UI.createButton({
		title : '',
		backgroundImage : '/images/back_home.png',
		width : 25,
		height : 16
	});

	var firstLine = Ti.UI.createView({
		layout : 'horizontal',
		width : 'auto',
		height : 'auto',
		top : 20,
		left : 20,
		right : 20,
	});

	var image = Ti.UI.createImageView({
		width : 0,
		height : 90,
	});
	firstLine.add(image);

	var titleArticle = Ti.UI.createLabel({
		text : '',
		color : '#000',
		font : {
			fontSize : 14,
			fontWeight : 'bold',
			fontFamily : 'Georgia'
		},
		left : 0,
		top : 0,
		right : 0,
		height : 'auto'
	});
	firstLine.add(titleArticle);

	self.add(firstLine);

	var containerArticle = Ti.UI.createView({
		top : 120,
		left : 20,
		right : 20,
		bottom : 40
	});
	self.add(containerArticle);

	var contentArticle = Ti.UI.createLabel({
		text : '',
		textAlign : 'left',
		color : '#000',
		font : {
			fontSize : 14,
			fontFamily : 'Helvetica',
		},
		top : 20,
		left : 0,
		right : 0
	});
	containerArticle.add(contentArticle);

	var readButton = Titanium.UI.createButton({
		title : "Leggi l'articolo completo",
		color:"#444",
		selectedColor:"#444",
		bottom : 50,
		left : 0,
		right : 0,
		font : {
			fontFamily : 'Helvetica',
			/*fontWeight: 'normal',
			 fontSize: 14*/
		},
		width:'100%',
		height:50,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		backgroundColor:"#ddd",
		enabled : true
	});
	readButton.addEventListener('touchstart', function() { 
    	readButton.backgroundColor = '#bbb';
  	});
  	readButton.addEventListener('touchend', function() { 
    	readButton.backgroundColor ='#ddd';
  	}); 
	self.add(readButton);

	var detailView = new DetailView();
	webWindow.add(detailView);

	self.showArticleDetails = function(article, catColor) {

		var loveButton = Titanium.UI.createButton({
			backgroundImage : '/images/buttoncuore_news_articolo.png',
			title : "",
			width : 156,
			height : 40,
			bottom : 5,
			right : 0,
			enabled : true,
			visible : false,
		});
		self.add(loveButton);

		readButton.addEventListener('click', function(e) {
			detailView.showArticle(article.link);
			webWindow.open({
				modal : true
			});

			tracker.trackEvent({
				category : "leggi-tutto",
				action : "open",
				label : article.title,
				value : 1
			});
			flurry.logEvent('read-more', {notizia: article.title});
		});


		webWindow.barColor = article.parentColor ? article.parentColor : '#333';
		self.barColor = article.parentColor ? article.parentColor : '#333';

		self.title = article.parentCategory.toUpperCase() + ' | ' + article.category;
		self.backButtonTitleImage = '/images/home-button.png';

		titleArticle.text = article.title;
		contentArticle.text = article.description;

		link = article.link;

		if (article.image) {
			image.width = 120;
			image.image = article.image;
			titleArticle.left = 10;
			containerArticle.top = (titleArticle.toImage().height > 90) ? (titleArticle.toImage().height + 30) : 120;
		} else {
			image.width = 0;
			image.image = null;
			titleArticle.left = 0;
			containerArticle.top = titleArticle.toImage().height + 30;
		}

		function showRequestResult(e) {
			var s = '';
			if (e.success) {
				s = "SUCCESS";
				if (e.result) {
					s += "; " + e.result;
				}
				if (e.data) {
					s += "; " + e.data;
				}
				if (!e.result && !e.data) {
					s = '"success", but no data from FB.  I am guessing you cancelled the dialog.';
				}
			} else if (e.cancelled) {
				s = "CANCELLED";
			} else {
				s = "FAIL";
				if (e.error) {
					s += "; " + e.error;
				}
			}
			//alert(s);
		}

		var loved = false;

		if (fb.loggedIn) {

			loveButton.visible = true;

			for (var j in article.loves) {
				if (fb.uid === article.loves[j].fb_uid) {
					loveButton.enabled = false;
					loveButton.backgroundImage = '/images/buttoncuore_news_articolo-disabled.png';
					loved = true;
				}
			}
			if (!loved) {
				loveButton.enabled = true;
				loveButton.addEventListener('click', function(e) {
					
					var url = "http://buonenotiziemanager.azurewebsites.net/loves/add";
					var sendData = {};
					sendData.BNsecretkey = 'buone2013';
					sendData.fb_uid = fb.uid;
					sendData.article_id = article.article_id;

					var sendLove = Ti.Network.createHTTPClient({
						onsendstream : function(e) {
							loveButton.enabled = false;
							loveButton.backgroundImage = "/images/buttoncuore_news_articolo-disabled.png";
						},
						onload : function(e) {
							if (this.responseText == 'ok') {
							}
						},
						onerror : function(e) {
							loveButton.enabled = true;
						},
						timeout : 5000
					});
					sendLove.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					sendLove.open("POST", url);
					sendLove.send(sendData);

					tracker.trackEvent({
						category : "love",
						action : "love-schermata-articolo",
						label : article.title,
						value : 1
					});
					flurry.logEvent('love', {where: "love-schermata-articolo"});

					var data = {
						link : article.link,
						name : article.title,
						type : "article",
						picture : article.image ? article.image : "http://www.buonenotizie.it/buonenotizieplus/icon-bnplus.png",
						description : article.description
					};
					
					//fb.requestWithGraphPath('me/feed', data, 'POST', showRequestResult);
					loveButton.backgroundImage = "/images/buttoncuore_news_articolo-disabled.png";

				});
			}
		} else {
			loveButton.visible = false;
		}
		
		//SOCIAL SHARES
	
	var facebookShare = Titanium.UI.createButton({
			backgroundImage : '/images/facebook-share.png',
			title : "",
			width : 53,
			height : 40,
			bottom : 5,
			left : 0,
			//style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
			enabled : true,
			visible : true,
		});
		var twitterShare = Titanium.UI.createButton({
			backgroundImage : '/images/twitter-share.png',
			title : "",
			width : 53,
			height : 40,
			bottom : 5,
			left : 53,
			//style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
			enabled : true,
			visible : true,
		});
		var mailShare = Titanium.UI.createButton({
			backgroundImage : '/images/mail-share.png',
			title : "",
			width : 53,
			height : 40,
			bottom : 5,
			left : 106,
			//style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
			enabled : true,
			visible : true,
		});
		self.add(facebookShare);
		self.add(twitterShare);
		self.add(mailShare);
	
		var datatosend = {};
		var datanoios6 = {};
		var datatweet = {};
		var datatoemail = {};
	
			datatosend = {
				name : article.title,
				link : article.link,
				image : article.image,
				description : article.description
			};
	
			datatweet = {
				text : 'Ecco una buona notizia: "' + article.title + '" via #BuoneNotizie Plus',
				image : article.image,
				url : article.link
			};
			
			datatoemail = {
				subject : 'Ecco una buona notizia: "' + article.title + '"',
				text:'<b>'+article.title+'</b><br/><br/>'+article.link+'<br/><br/>Su <b>BuoneNotizie Plus</b> https://itunes.apple.com/it/app/buonenotizie-plus/id634493144'
			}
		
		var ExygySocialShare = require("com.exygy.socialshare");

		facebookShare.addEventListener("click", function() {
			
				optionsFacebook = {
   						provider: "facebook",
    					url: datatweet.url,
    					message: datatweet.text
					}
				ExygySocialShare.share(optionsFacebook);

				tracker.trackSocial({
					network : "facebook",
					action : "condivisione",
					target : datatosend.name ? datatosend.name : "non impostato"
				});
				tracker.trackEvent({
					category : "condividi",
					action : "facebook",
					label : datatosend.name,
					value : 1
				});
				flurry.logEvent('share', {type: "facebook"});

		});

		twitterShare.addEventListener("click", function() {
				
				optionsTwitter = {
   						provider: "twitter",
    					url: datatweet.url,
    					message: datatweet.text
					}
				ExygySocialShare.share(optionsTwitter);

				tracker.trackSocial({
					network : "twitter",
					action : "condivisione",
					target : datatosend.name ? datatosend.name : "non impostato"
				});
				tracker.trackEvent({
					category : "condividi",
					action : "twitter",
					label : datatosend.name,
					value : 1
				});
				flurry.logEvent('share', {type: "twitter"});
		});
		
		mailShare.addEventListener("click", function() {
			var emailDialog = Ti.UI.createEmailDialog();
			emailDialog.subject = datatoemail.subject;
			emailDialog.toRecipients = [''];
			emailDialog.html=true;
			emailDialog.messageBody = datatoemail.text;
			emailDialog.open();
			
			tracker.trackEvent({
					category : "condividi",
					action : "email",
					label : datatosend.name,
					value : 1
				});
			flurry.logEvent('share', {type: "email"});
			
		});
		
	}

	self.addEventListener('focus', function() {
		flurry.onPageView(titleArticle.text);
		tracker.trackScreen(titleArticle.text);
	});

	return self;
}

module.exports = ArticleWindow;
