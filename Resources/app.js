//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

var osname = Ti.Platform.osname,
	version = Ti.Platform.version,
	height = Ti.Platform.displayCaps.platformHeight,
	width = Ti.Platform.displayCaps.platformWidth;

var flurry = require('sg.flurry');
	flurry.onStartSession('4VV2TRPJNS9MV3Y32F3J');
	flurry.setContinueSessionMillis(10000);
	flurry.setCaptureUncaughtExceptions(true);

var fb = require('facebook');
 fb.appid = 563301893701994;
 fb.permissions = ['publish_actions','user_birthday'];
 fb.forceDialogAuth = false;

if (fb.loggedIn){
	fb.requestWithGraphPath('me', {}, 'GET', function(e) {
		var data = JSON.parse(e.result);
		flurry.setUserID(fb.uid);
		if(data.gender="male"){flurry.setGender(flurry.MALE);}else if(data.gender="female"){flurry.setGender(flurry.FEMALE);}else{};
		var birth_year = parseInt(data.birthday.substr(data.birthday.length - 4));
		flurry.setAge(2013-birth_year);
	});	
}

var GA = require('analytics.google');
//GA.optOut = true;
GA.debug = false;
GA.trackUncaughtExceptions = true;
var tracker = GA.getTracker("UA-9426666-8");

var tapstream = require('com.tapstream.sdk');
var config = {
    collectDeviceId: true
};
tapstream.create("buonenotizie", "wy-Y6mo8Q3OjtTNxDf31QA", config);
tapstream.fireEvent('install', true, {
    'system': 'android',
});
// This is a single context application with multiple windows in a stack
(function() {

	var Categorie = require('ui/handheld/android/CategorieWindow');
	var Stream = require('ui/handheld/android/StreamWindow');
	var Top = require('ui/handheld/android/TopWindow');
	var Profilo = require('ui/handheld/android/ProfiloWindow');
	
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	var CategorieWizard = require('ui/common/CategorieWizard');
	
	
	if(Ti.App.Properties.getBool('BNfirstTour')){
		new ApplicationTabGroup(Categorie, Stream, Top, Profilo).open();
	}else{
		new CategorieWizard("Benvenuto").open();
	}

})();

flurry.onEndSession();
