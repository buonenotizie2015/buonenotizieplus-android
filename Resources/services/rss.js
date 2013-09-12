var osname = Ti.Platform.osname;
var BNselCat = Ti.App.Properties.getList('BNselCat') ? Ti.App.Properties.getList('BNselCat') : [];
var MONTH_MAP = {
	JAN : 1,
	FEB : 2,
	MAR : 3,
	APR : 4,
	MAY : 5,
	JUN : 6,
	JUL : 7,
	AUG : 8,
	SEP : 9,
	OCT : 10,
	NOV : 11,
	DEC : 12
};

var getRssText = function(item, key) {
	return item.getElementsByTagName(key).item(0).text;
};
var parseDate = function(dateString) {
	var dateParts = dateString.split(' ');
	var timeParts = dateParts[4].split(':');
	return dateParts[1] + '/' + MONTH_MAP[dateParts[2].toUpperCase()] + ' ' + timeParts[0] + ':' + timeParts[1];
};

exports.loadRssFeed = function(o, tries) {
	var data = [];
	BNselCat = Ti.App.Properties.getList('BNselCat') ? Ti.App.Properties.getList('BNselCat') : [];

	for (var i in BNselCat) {
		tries = tries || 0;
		var xhr = Titanium.Network.createHTTPClient({
			onload : function(e) {
				var xml = this.responseXML;

				if (xml === null || xml.documentElement === null) {
					if (tries < 3) {
						tries++;
						exports.loadRssFeed(o, tries);
						return;
					} else {
						alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
						if (o.error) {
							o.error();
						}
						return;
					}
				}

				var items = xml.documentElement.getElementsByTagName("item");

				for (var i = 0; i < items.length; i++) {
					var item = items.item(i);
					var image;
					var score = '12';
					try {
						var image = item.getElementsByTagNameNS('http://www.buonenotizie.it/', 'thumbnail').item(0).getElementsByTagName('img').item(0).getAttribute('src');
					} catch (e) {
						image = '';
					}

					data.push({
					title : getRssText(item, 'title'),
					link : getRssText(item, 'link'),
					category : getRssText(item, ''),
					pubDate : parseDate(getRssText(item, 'pubDate')),
					image : image,
					score : score
					});
				}
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

		var rssURL = 'http://buonenotiziemanager.azurewebsites.net/categories/view/' + BNselCat[i] + '.rss';
		//var rssURL = 'http://ipalo/buonenotizie.it/feedmanager_app_bn/categories/view/' + BNselCat[i] + '.rss';
		xhr.open('GET', rssURL);

		if (o.start) {
			o.start();
		}
		xhr.send();
	}
};
