function ApplicationTabGroup(Categorie,Stream,Top,Profilo) {
	
	// get tab group object
	var self = Ti.UI.createTabGroup({
		top:40,
		height:30,
		backgroundColor:"#fff"
	});
	if(Ti.App.Properties.getBool('BNfirstTour'))
		self.setActiveTab(1);
	else
		self.setActiveTab(0);

	var categorieWin = new Categorie(L('Categorie')),
		streamWin = new Stream(L('Notizie')),
		topWin = new Top(L('Più votate')),
		profiloWin = new Profilo(L('Profilo'));
	
	var tab1 = Ti.UI.createTab({
		title: 'Categorie',
		heigth:40,
		icon: 'images/ico_categorie.png',
		window: categorieWin,
	});
	if(parseInt(version)<3){tab1.icon='images/ico_categorie-white.png';}
	categorieWin.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: 'Notizie',
		heigth:40,
		icon: 'images/ico_stream.png',
		window: streamWin,
	});
	if(parseInt(version)<3){tab2.icon='images/ico_stream-white.png';}
	streamWin.containingTab = tab2;
	
	var tab3 = Ti.UI.createTab({
		title: 'Più votate',
		heigth:40,
		icon: 'images/ico_top.png',
		window: topWin
	});
	if(parseInt(version)<3){tab3.icon='images/ico_top-white.png';}
	topWin.containingTab = tab3;
	
	var tab4 = Ti.UI.createTab({
		title: 'Profilo',
		heigth:40,
		icon: 'images/ico_profilo.png',
		window: profiloWin
	});
	if(parseInt(version)<3){tab4.icon='images/ico_profilo-white.png';}
	profiloWin.containingTab = tab4;
	
	streamWin.addEventListener('focus', function(){
		if(categorieWin.reloadStream){
			streamWin.refreshJSON();
			categorieWin.reloadStream = false;
		}
		if(profiloWin.reloadStream){
			streamWin.refreshJSON();
			profiloWin.reloadStream = false;
		}
	});
	
	topWin.addEventListener('focus', function(){
		topWin.refreshTopJSON();
	});
	
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab1);
	self.addTab(tab4);
	
	if(parseInt(version)>=3){
	self.addEventListener("open",function(e){
		var activity = self.activity;
        activity.actionBar.logo = "/images/logo@2x.png";
        activity.actionBar.backgroundImage = "/images/navbar-bg.png";
        activity.actionBar.displayHomeAsUp = false; 
	});
	}
	
	return self;
};

module.exports = ApplicationTabGroup;
