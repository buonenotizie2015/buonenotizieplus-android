function ShareView() {

	var datatosend = {};
	var datanoios6 = {};
	var datatweet = {};
	var datatoemail = {};

	var self = Ti.UI.createScrollView({
		layout : "vertical"
	});

	var fbbtn = Ti.UI.createButton({
		width : 200,
		height : 35,
		top : 15,
		title : "Condividi su Facebook"
	});
	self.add(fbbtn);

	var tweetbtn = Ti.UI.createButton({
		width : 200,
		height : 35,
		top : 15,
		title : "Condividi su Twitter"
	});
	self.add(tweetbtn);
	
	var emailbtn = Ti.UI.createButton({
		width : 200,
		height : 35,
		top : 15,
		title : "Condividi via e-mail"
	});
	self.add(emailbtn);

	self.addEventListener('focus', function() {
		flurry.onPageView();
		tracker.trackScreen("Condividi");
	});
	

	if (Titanium.Platform.name == 'iPhone OS') {

		var fb = require('facebook');
		var socialShare = require("com.exygy.socialshare");
		

		fbbtn.addEventListener("click", function() {
			
				if (fb.loggedIn) {

					var readresult = function(r) {
						if (r.result) {
							facebook_response = Ti.UI.createAlertDialog({
								title : 'Pubblicato su Facebook!',
								message : 'La notizia è stato pubblicata.'
							});
						} else {
							facebook_response = Ti.UI.createAlertDialog({
								title : 'Pubblicazione non effettuata',
								message : 'Il commento non è stato pubblicato.'
							});
						}
						facebook_response.show();

						var fb_resp_timeout = setTimeout(function() {
							facebook_response.hide();

						}, 2000);
					};

					optionsFacebook = {
   						provider: "facebook",
    					url: datatweet.url,
    					message: datatweet.text
					}
					socialShare.share(optionsFacebook);

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

				} else {
					fb.authorize();
				}
		
		});

		var fbAccount;

		fb.addEventListener("facebookAccount", function(e) {
			fbAccount = e.account;
		});
		
		tweetbtn.addEventListener("click", function() {
				
				optionsFacebook = {
   						provider: "twitter",
    					url: datatweet.url,
    					message: datatweet.text
					}
					socialShare.share(optionsFacebook);
				
				tracker.trackSocial({
					network : "twitter",
					action : "condivisione",
					target : datatweet.name ? datatweet.name : "non impostato"
				});
				tracker.trackEvent({
					category : "condividi",
					action : "twitter",
					label : datatweet.name,
					value : 1
				});
		});
	    
		emailbtn.addEventListener("click", function() {
			var emailDialog = Ti.UI.createEmailDialog();
			emailDialog.subject = datatoemail.subject;
			emailDialog.toRecipients = [''];
			emailDialog.html=true;
			emailDialog.messageBody = datatoemail.text;
			emailDialog.open();
		});
		
	}

	self.setData = function(article) {
		datanoios6 = {
			link : "https://itunes.apple.com/it/app/buonenotizie-plus/id634493144",
			name : article.title,
			picture : article.image,
			description : article.description
		};

		datatosend = {
			name : article.title,
			link : "https://itunes.apple.com/it/app/buonenotizie-plus/id634493144",
			image : article.image,
			description : article.description
		};

		datatweet = {
			text : 'Sto leggendo "' + article.title + '" su #BuoneNotizie Plus',
			image : article.image,
			url : "https://itunes.apple.com/it/app/buonenotizie-plus/id634493144"
		};
		
		datatoemail = {
			subject : 'Leggi una buona notizia: "' + article.title,
			text:'<b>'+article.title+'</b><br/><br/>'+article.link+'<br/><br/>Su <b>BuoneNotizie Plus</b> https://itunes.apple.com/it/app/buonenotizie-plus/id634493144'
		}
	}

	return self;
}

module.exports = ShareView;
