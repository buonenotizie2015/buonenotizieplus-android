function ProfiloWizard(title) {
	/*globals Titanium, Ti, alert, JSON */
	var Categorie = require('ui/handheld/android/CategorieWindow');
	var Stream = require('ui/handheld/android/StreamWindow');
	var Top = require('ui/handheld/android/TopWindow');
	var Profilo = require('ui/handheld/android/ProfiloWindow');
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');

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
			fontSize : 15,
			fontFamily : 'Oswald'
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

	function updateLoginStatusWizard() {
		label.text = 'Il tuo profilo Facebook è connesso. Ora puoi votare e condividere le buone notizie';
		fbButton.backgroundImage = '/images/fb-logout.png';
		
		Ti.App.Properties.setBool('BNfirstTour', true);
		
		new ApplicationTabGroup(Categorie, Stream, Top, Profilo).open();
		
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
	
	fb.addEventListener('login', updateLoginStatusWizard);
	
	fbButton.addEventListener('click', function() {
		if (fb.loggedIn){
			fb.logout();
		} else {
			fb.authorize();
		}	
	});
	
	var buttonLater = Ti.UI.createButton({
		title : 'Più tardi',
		textAlign : 'center',
		color : '#111111',
		backgroundColor:"#cccccc",
		backgroundSelectedColor:"#999999",
		font : {
			fontSize : 14,
			fontFamily : 'Oswald'
		},
		height : 50,
		top: 340,
		left : 20,
		right : 20
	});
	
	self.add(buttonLater);
	
	buttonLater.addEventListener('click', function() {
		Ti.App.Properties.setBool('BNfirstTour', true);
		new ApplicationTabGroup(Categorie, Stream, Top, Profilo).open();	
	});
	
	self.addEventListener('close', function() {
		self.remove(buttonLater);buttonLater= null;
		self.remove(fbButton);fbButton= null;
		self.remove(image);image=null;
		self.remove(label);label=null;
	});

	
	return self;
};

module.exports = ProfiloWizard;
