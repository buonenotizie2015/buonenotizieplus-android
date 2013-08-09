function CategorieWindow(title) {

	var self = Ti.UI.createWindow({
		title : title,
		backgroundColor : '#fff',
		barColor : '#333',
		barImage : '/images/navbar-bg.png',
		titleImage : '/images/logo.png',
		top : 0,
		left : 0
	});
	var containerView = Ti.UI.createView({
		backgroundColor : '#fff',
		borderRadius : 0,
		top : 0,
		height : 'auto',
		width : 'auto'
	});
	var contentView = Ti.UI.createScrollView({
		backgroundColor : '#fff',
		borderRadius : 0,
		top : 0,
		height : 'auto',
		width : 'auto'
	});
	var textCategorie = Ti.UI.createLabel({
		text : 'Scegli le categorie che vuoi seguire',
		textAlign : 'center',
		color : '#333',
		font : {
			fontSize : 16
		},
		height : 40,
		top : 0,
		bottom : 5,
		left : 10,
		right : 10
	});

	self.reloadStream = false;

	contentView.add(textCategorie);
	containerView.add(contentView);
	self.add(containerView);
	
	self.addEventListener('focus', function() {
    	flurry.onPageView();
    	tracker.trackScreen("Categorie");
	});


	self.loadCategories = function() {
		//load dinamically categories from manager
		var BNselCat = Ti.App.Properties.getString('BNselCat') ? JSON.parse(Ti.App.Properties.getString('BNselCat')) : {};
		var xhr = Titanium.Network.createHTTPClient();
		
		xhr.open('GET', 'http://buonenotiziemanager.azurewebsites.net/categories/getCategories.json');
		//xhr.open('GET', 'http://ipalo/buonenotizie.it/feedmanager_app_bn/categories/getCategories.json');
		xhr.onload = function(e) {
			var response = eval(this.responseText);
			
			//check if there are ghost values not present in db anymore
			for (var key in BNselCat) {
				var present = false;
				for (var k2 in response) {
					if (response[k2].Category.slug==key)
						present = true;
				}
				if(!present)
					delete BNselCat[key];
			}
			Ti.App.Properties.setString('BNselCat', JSON.stringify(BNselCat));
			
			
			for (var i in response) {
				var cat = Ti.UI.createLabel({
					height : 40,
					width : 'fill',
					backgroundColor : response[i].Category.color ? response[i].Category.color : '#333',
					top : 40 + (i * 45),
					bottom : 0,
					left : 0,
					right : 0,
					zIndex:9
				});
				var catName = Ti.UI.createLabel({
					text : response[i].Category.name,
					textAlign : 'left',
					height:40,
					top : 40 + (i * 45),
					color : '#ffffff',
					backgroundColor : 'transparent',
					font : {
						fontSize : 18,
						fontFamily : 'Georgia',
						fontWeight : 'bold'
					},
					left : 30,
					zIndex:99
				});
				contentView.add(cat);
				contentView.add(catName);

				var catChecked = response[i].Category.slug in BNselCat ? true : false;

				var catSwitch = Titanium.UI.createSwitch({
					style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
					titleOn:'Attiva',
  					titleOff:'Disattiva',
					value : catChecked,
					top : 35 + (i * 45 + 6),
					right : 50,
					cat_id : response[i].Category.id,
					slug : response[i].Category.slug,
					zIndex:99
					//childs : response[i].children
				});

				contentView.add(catSwitch);

				catSwitch.addEventListener('change', function(e) {
					if (e.value == true) {
						/*var catChilds = [];
						for (var j in this.childs) {
							catChilds.push(this.childs[j].Category.slug);
						}*/
						BNselCat[this.slug] = this.cat_id;
					} else {
						delete BNselCat[this.slug];
					}
					Ti.App.Properties.setString('BNselCat', JSON.stringify(BNselCat));
					self.reloadStream = true;
				});
			}
		};
		xhr.onerror = function(e) {
		};
		xhr.send();
		//end load categories

	}
	
	self.loadCategories();

	return self;
};

module.exports = CategorieWindow;
