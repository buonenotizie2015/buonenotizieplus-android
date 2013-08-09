var createStreamRow = function(item) {

	var parseYMDdate = function(dateString) {
		var dateParts = dateString.split(' ');
		var timeParts = dateParts[1].split(':');
		var datePart = dateParts[0].split('-');
		return datePart[2] + '/' + datePart[1];
	}
	
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
		font: {fontSize: 12, fontWeight: 'bold'},
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
		font: {fontSize: 12, fontWeight: 'bold', fontFamily: 'Georgia'},
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
			fontSize : 12
		},
		top : 20,
		left : leftPos,
		right : 20
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

	var scoreview = Ti.UI.createLabel({
		text : item.score + '  ',
		textAlign : 'right',
		backgroundColor : '#555',
		color : '#fff',
		font : {
			fontSize : 10
		},
		height : 20,
		width : 40,
		right : 0,
		bottom : 0,
		backgroundImage : '/images/love-bg-table.png'
	});
	tablerow.add(scoreview);

	return tablerow;
};

//Master View Component Constructor
function MasterView() {
	var self = Ti.UI.createView({
		backgroundColor : '#fff'
	});

	var table = Ti.UI.createTableView();
	self.add(table);

	table.addEventListener('click', function(e) {
		self.fireEvent('itemSelected', {
			link : e.row.link,
			itemdata : e.row.item,
		});
	});

	var lastDistance = 0;
	var updating = false;

	table.addEventListener('scroll', function(e) {
			
		var offset =  e.firstVisibleItem*75;
		var height = e.size.height;
		var total = offset + height + 75;
		var theEnd = e.totalItemCount*75;
		var distance = theEnd - total;
			
		if (distance < lastDistance) {
            if (!updating && (total >= theEnd)){
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

	return self;
}

module.exports = MasterView;
