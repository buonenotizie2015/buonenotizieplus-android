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

// receive JS event from the HTML
Ti.App.addEventListener('link_click', function(e) {
    var whereto = e._where;
    Ti.Platform.openURL(whereto);
    tracker.trackEvent({
		category : "banner",
		action : "action",
		label : "click",
		value : "click"
	});
	flurry.logEvent('banner', {what: "click"});
});

function randomXToY(minVal,maxVal){ 
	var randVal = minVal+(Math.random()*(maxVal-minVal)); 
	return Math.round(randVal);
}
var random = randomXToY(0,2);
var testAB = "testAB";
if(!Ti.App.Properties.getString('testAB')){
	Ti.App.Properties.setString(testAB,random);
	Ti.API.info("La variabile AB è stata impostata a "+Ti.App.Properties.getString('testAB'));
}else{
	Ti.API.info("La variabile AB era già impostata a "+Ti.App.Properties.getString('testAB'));
}

if(Ti.App.Properties.getString('testAB')==1){
	flurry.logEvent('testAB', {tester: '1'});
	tracker.trackEvent({
		category: "ABtesting",
		action: "set-tester",
		label: "A-smile",
		value: "1"
	});
}else{
	flurry.logEvent('testAB', {tester: '2'});
	tracker.trackEvent({
		category: "ABtesting",
		action: "set-tester",
		label: "B-thumb",
		value: "2"
	});
}

// This is a single context application with multiple windows in a stack
(function() {

	var Categorie = require('ui/handheld/android/CategorieWindow');
	var Stream = require('ui/handheld/android/StreamWindow');
	var Top = require('ui/handheld/android/TopWindow');
	var Profilo = require('ui/handheld/android/ProfiloWindow');
	
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(Categorie, Stream, Top, Profilo).open();

})();
