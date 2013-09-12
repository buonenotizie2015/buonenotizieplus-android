var BNselCat = Ti.App.Properties.getString('BNselCat') ? JSON.parse(Ti.App.Properties.getString('BNselCat')) : {};

exports.loadArticles = function(o, page, tries) {
	var data = [];
	BNselCat = Ti.App.Properties.getString('BNselCat') ? JSON.parse(Ti.App.Properties.getString('BNselCat')) : {};
	var tries = 3;
	var streamData = {};
	streamData.page = page ? page : 0;

	var catList = [];
	for (var i in BNselCat) {
		catList.push(BNselCat[i]);
	}

	var jsonCatList = '(';
	for(var catn in catList){
   		jsonCatList = jsonCatList + catList[catn] + ', ';
	}

	streamData.main_category = jsonCatList.substring(0, jsonCatList.length -2) + ')';
	
	tries = tries || 0;
	var xhr = Titanium.Network.createHTTPClient({

		
		onload : function(e) {
						
			var response = eval(this.responseText);

			if (response === null || !response) {
				if (tries < 3) {
					tries++;
					exports.loadArticles(o, page, tries);
					return;
				} else {
					alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
					if (o.error) {
						o.error();
					}
					return;
				}
			}
			for (var j in response) {
				data.push({
					article_id : response[j].Article.id,
					title : response[j].Article.title,
					description : response[j].Article.description,
					link : response[j].Article.link,
					category : response[j].Category.name,
					parentCategory : response[j].ParentCategory.name,
					parentColor: response[j].ParentCategory.color,
					pubDate : response[j].Article.pubDate,
					image : response[j].Article.image,
					score : response[j].Article.love_count,
					loves : response[j].Love
				});
			}
			data.sort(function(a, b) {
				a = a.pubDate;
				b = b.pubDate;
				return a > b ? -1 : a < b ? 1 : 0;
			});
			if (o.success) {
				o.success(data);
			}
		},
		onerror : function(e) {
			if (o.error) {
				o.error();
			}
		}
	});

	var jsonURL = 'http://buonenotiziemanager.azurewebsites.net/articles/getArticles.json';
	//var jsonURL = 'http://ipalo/buonenotizie.it/feedmanager_app_bn/articles/getArticles.json';
	xhr.open('POST', jsonURL);

	if (o.start) {
		o.start();
	}
	
	
	xhr.send(streamData);

};

exports.loadJson = function(o, tries) {

	var data = [];
	BNselCat = Ti.App.Properties.getString('BNselCat') ? JSON.parse(Ti.App.Properties.getString('BNselCat')) : {};
	var tries = 3;

	var catList = [];
	for (var i in BNselCat) {
		for (var j in BNselCat[i]) {
			catList.push(BNselCat[i][j]);
		}
	}

	for (var i in catList) {
		tries = tries || 0;
		var xhr = Titanium.Network.createHTTPClient({
			onload : function(e) {

				var response = eval(this.responseText);

				if (response === null || !response) {
					if (tries < 3) {
						tries++;
						exports.loadJson(o, tries);
						return;
					} else {
						alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
						if (o.error) {
							o.error();
						}
						return;
					}
				}

				for (var j in response) {
					data.push({
						article_id : response[j].Article.id,
						title : response[j].Article.title,
						description : response[j].Article.description,
						link : response[j].Article.link,
						category : response[j].Category.name,
						parentCategory : response[j].ParentCategory.name,
						parentColor: response[j].ParentCategory.color,
						pubDate : response[j].Article.pubDate,
						image : response[j].Article.image,
						score : response[j].Article.love_count,
						loves : response[j].Love
					});
				}
				data.sort(function(a, b) {
					a = a.pubDate;
					b = b.pubDate;
					return a > b ? -1 : a < b ? 1 : 0;
				});
				if (o.success) {
					o.success(data);
				}
			},
			onerror : function(e) {
				if (o.error) {
					o.error();
				}
			}
		});

		var jsonURL = 'http://buonenotiziemanager.azurewebsites.net/categories/view/' + catList[i] + '.json';
		//var jsonURL = 'http://ipalo/buonenotizie.it/feedmanager_app_bn/categories/view/' + catList[i] + '.json'
		xhr.open('GET', jsonURL);

		if (o.start) {
			o.start();
		}
		xhr.send();
	}
};

exports.loadTopJson = function(t, topTries) {

	var topData = [];
	var topTries = 3;

	var xhrTop = Titanium.Network.createHTTPClient({
		onload : function(e) {
			var topResponse = eval(this.responseText);

			if (topResponse === null || !topResponse) {
				if (topTries < 3) {
					topTries++;
					exports.loadTopJson(t, topTries);
					return;
				} else {
					alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
					if (t.error) {
						t.error();
					}
					return;
				}
			}

			for (var j in topResponse) {
				topData.push({
					article_id : topResponse[j].Article.id,
					title : topResponse[j].Article.title,
					description : topResponse[j].Article.description,
					link : topResponse[j].Article.link,
					category : topResponse[j].Category.name,
					parentCategory : topResponse[j].ParentCategory.name,
					parentColor: topResponse[j].ParentCategory.color,
					pubDate : topResponse[j].Article.pubDate,
					image : topResponse[j].Article.image,
					score : topResponse[j].Article.love_count,
					loves : topResponse[j].Love
				});
			}
			if (t.success) {
				t.success(topData);
			}
		},
		onerror : function(e) {
			if (t.error) {
				t.error();
			}
		}
	});

	var jsonTopURL = 'http://buonenotiziemanager.azurewebsites.net/articles/topArticles.json';
	//var jsonTopURL = 'http://ipalo/buonenotizie.it/feedmanager_app_bn/articles/topArticles.json';
	xhrTop.open('GET', jsonTopURL);

	if (t.start) {
		t.start();
	}
	xhrTop.send();
};