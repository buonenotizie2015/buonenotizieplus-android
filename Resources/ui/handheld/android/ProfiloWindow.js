function ProfiloWindow(title) {
	/*globals Titanium, Ti, alert, JSON */
	

	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
		barColor : '#333',
		barImage : '/images/navbar-bg.png',
		titleImage : '/images/logo.png',
		top : 0,
		left : 0
	});

	self.addEventListener('focus', function() {
		flurry.onPageView();
		tracker.trackScreen("Profilo");
	});

	var image = Ti.UI.createImageView({
		image : '/images/profilo-image.png',
		top : 70,
		left : 10
	});
	self.add(image);

	var label = Ti.UI.createLabel({
		text : 'Connetti il tuo profilo su Facebook per votare e condividere le buone notizie',
		font : {
			fontSize : 16
		},
		color : '#333',
		height : 'auto',
		top : 10,
		left : 10,
		right : 10,
		textAlign : 'center'
	});
	self.add(label);
	

	var fbButton = Ti.UI.createButton({
		backgroundImage : fb.loggedIn ? '/images/fb-logout.png' : '/images/fb-login.png',
		backgroundSelectedImage : fb.loggedIn ? '/images/fb-logout-hover.png' : '/images/fb-login-hover.png',
		width : 280,
		height : 47,
		top : 280,
		textAlign : 'center'
	});
	self.add(fbButton);
	
	self.reloadStream = false;

	function updateLoginStatus() {
		label.text = 'Il tuo profilo Facebook è connesso. Ora puoi votare e condividere le buone notizie';
		fbButton.backgroundImage = '/images/fb-logout.png';
		fbButton.backgroundSelectedImage = '/images/fb-logout-hover.png';
		
		self.reloadStream = true;
		
		if (fb.loggedIn){
			fb.requestWithGraphPath('me', {}, 'GET', function(e) {
				var data = JSON.parse(e.result);
				flurry.setUserID(fb.uid);
				if(data.gender="male"){flurry.setGender(flurry.MALE);}else if(data.gender="female"){flurry.setGender(flurry.FEMALE);}else{};
				var birth_year = parseInt(data.birthday.substr(data.birthday.length - 4));
				flurry.setAge(2013-birth_year);
			});	
		}
		
		tracker.trackSocial({
			network: "facebook",
			action: "login",
			target: "profilo"
		});
		tracker.trackEvent({
			category : "accesso",
			action : "login",
			label : "login-nel-profilo",
			value : 1
		});
	}

	function updateLogoutStatus() {
		label.text = 'Connetti il tuo profilo su Facebook per votare e condividere le buone notizie';
		fbButton.backgroundImage = '/images/fb-login.png';
		fbButton.backgroundSelectedImage = '/images/fb-login-hover.png';
		self.reloadStream = true;
		
		tracker.trackSocial({
			network: "facebook",
			action: "logout",
			target: "profilo"
		});
		tracker.trackEvent({
			category : "accesso",
			action : "logout",
			label : "logout-dal-profilo",
			value : 1
		});
		
	}
	fb.addEventListener('login', updateLoginStatus);
	fb.addEventListener('logout', updateLogoutStatus);

	fbButton.addEventListener('click', function() {

			
			if (fb.loggedIn){
				fb.logout();

			} else {
				fb.authorize();
			}
			
	});
	
	return self;
};

module.exports = ProfiloWindow;
