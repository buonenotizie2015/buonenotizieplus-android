var createStreamRow = function(item) {

	var parseYMDdate = function(dateString) {
		var dateParts = dateString.split(' ');
		var timeParts = dateParts[1].split(':');
		var datePart = dateParts[0].split('-');
		return datePart[2] + '/' + datePart[1];
	};
	
	var leftPos = item.image ? 75 : 5;
	
	var tablerow = Ti.UI.createTableViewRow({
		height : 75,
		link : item.link,
		className : 'itemRow',
		hasChild : false
	});
	tablerow.item = item;

	var imageview = Ti.UI.createImageView({
		image : item.image,
		height : 65,
		width : 65,
		left : 5,
		top : 5
	});
	tablerow.add(imageview);

	var categoryView = Ti.UI.createView({
		layout : 'horizontal',
		width : 'auto',
		top : 5,
		height:16,
		left : leftPos,
		right : 35
	});

	var categoryLab = Ti.UI.createLabel({
		text: item.category,
		color: '#000',
		height:16,
		font: {fontSize: 12, fontWeight: 'bold', fontFamily : 'EgyptienneFLTStd-Bold'},
		left:2, 
		width:'auto'
	});

	var categoryParent = Ti.UI.createLabel({
		text: ' '+item.parentCategory.toUpperCase()+' ',
		color: '#fff',
		backgroundColor: item.parentColor ? item.parentColor : '333',
		height:16,
		verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		left:0,
		font: {fontSize: 12, fontWeight: 'bold', fontFamily : 'Oswald'},
		width: 'auto'
	});
	
	categoryView.add(categoryParent);
	categoryView.add(categoryLab);
	
	tablerow.add(categoryView);
	
	var score = item.score;

	var titleview = Ti.UI.createLabel({
		text : item.title,
		color : '#000',
		height : 50,
		font : {
			fontFamily : 'EgyptienneFLTStd-Roman',
			fontSize : 12
		},
		top : 20,
		left : leftPos,
		right : 47
	});
	tablerow.add(titleview);

	var dateview = Ti.UI.createLabel({
		text : parseYMDdate(item.pubDate),
		textAlign : 'left',
		color : '#444',
		font : {
			fontSize : 10
		},
		height : 'auto',
		top : 3,
		right : 5
	});
	tablerow.add(dateview);
	
	var loveView = Ti.UI.createView({
		backgroundColor : '#00aeef',
		height : 42,
		width:42,
		bottom : 0,
		right : 0,
		viewid : 'loveView'
	});
	var loveButton = Titanium.UI.createButton({
			height : 42,
			width : 42,
			right : 0,
			bottom : 0,
			backgroundImage : '/images/smile.png',
			btnid : 'loveButton'
		});
	var scoreView = Ti.UI.createLabel({
		text : score,
		textAlign : 'center',
		color : '#fff',
		font : {
			fontSize : 13
		},
		height : 18,
		width:42,
		bottom : 0,
		right : 0,
		labelid : "loveLabel"
	});
	
	loveView.add(scoreView);
	loveView.add(loveButton);
	tablerow.add(loveView);

	
	//LOVE BOTTON
	
		titleview.text = item.title;

		link = item.link;
	
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

			loveButton.enabled = true;

			for (var j in item.loves) {
				if (fb.uid === item.loves[j].fb_uid) {
					loveButton.enabled = false;
					loveButton.backgroundImage = '/images/smile-disabled.png';
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
					sendData.article_id = item.article_id;

					var sendLove = Ti.Network.createHTTPClient({
						onsendstream : function(e) {
							loveButton.enabled = false;
							loveButton.backgroundImage = '/images/smile-disabled.png';
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
						action : "love-schermata-stream",
						label : item.title,
						value : 1
					});
					flurry.logEvent('love', {start: "love-schermata-stream"});
					tapstream.fireEvent('love', false,{'where': "love-schermata-stream"});

					var data = {
						link : item.link,
						name : item.title,
						type : "article",
						picture : item.image ? item.image : "http://www.buonenotizie.it/buonenotizieplus/icon-bnplus.png",
						description : item.description
					};
					
					fb.requestWithGraphPath('me/feed', data, 'POST', showRequestResult);
					scoreView.text = String(parseInt(scoreView.text)+1);
					loveButton.backgroundImage = '/images/smile-disabled.png';
				});
			}
			} else {
				loveButton.enabled = false;
				loveButton.backgroundImage = '/images/smile-disabled.png';
			}

	return tablerow;
};

//Master View Component Constructor
function MasterView() {
	var self = Ti.UI.createView({
		backgroundColor : '#fff'
	});
	
	var footerView = Ti.UI.createView({
		layout : 'horizontal',
		width : 'auto',
		height:60,
		backgroundColor:"#fff"
	});

	var activityIndicator = Ti.UI.createActivityIndicator({
	  color: 'black',
	  message: 'Sto caricando...',
	  style:Ti.UI.ActivityIndicatorStyle.DARK,
	  top:16,
	  left:100,
	  height:30
	});
	footerView.add(activityIndicator);

	var table = Ti.UI.createTableView({
		footerView:footerView
	});
	self.add(table);

	table.addEventListener('click', function(e) {
		if(e.source.viewid != 'loveView' && e.source.btnid != 'loveButton' && e.source.labelid != 'loveLabel'){
    		self.fireEvent('itemSelected', {
				link : e.row.link,
				itemdata : e.row.item,
			});
    	}else{
    	}
	});

	var lastDistance = 0;
	var updating = false;
	
	table.addEventListener('scroll', function(e) {
		activityIndicator.show();
		var offset =  e.firstVisibleItem*75;
		var height = e.size.height;
		var total = offset + height + 75;
		var theEnd = e.totalItemCount*75; 
		var distance = theEnd - total;
			
		if (distance < lastDistance) {
            if (!updating && (total >= (theEnd-135))){ //135 are the pixel from the bottom where the app start looking for new articles
				updating = true;
				self.fireEvent('loadMoreArticles');
			}
		}
		lastDistance = distance;
	});

	self.pageView = 0;
	

	self.refreshTable = function(data) {

		if (Object.prototype.toString.apply(data) === '[object Array]') {
			
			var rows = [];
			for (var i = 0; i < data.length; i++) {
				rows.push(createStreamRow(data[i]));
			}
			table.setData(rows);
		}
	};

	self.moreArticles = function(data) {

		if (Object.prototype.toString.apply(data) === '[object Array]') {

			var rows = [];
			for (var i = 0; i < data.length; i++) {
				rows.push(createStreamRow(data[i]));
			}
			table.appendRow(rows);
			updating = false;
		}
	};
	
	self.addEventListener('close', function() {
		self.remove(table);table= null;
	});
	return self;
}

module.exports = MasterView;
