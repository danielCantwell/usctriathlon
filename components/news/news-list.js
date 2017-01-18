(function() {
"use strict";

app.directive('newslist', function() {
	return {
		restrict: 'E',
		scope: {
			dash: '='
		},
		templateUrl: 'components/news/news-list.html',
		controller: NewsListCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function NewsListCtrl($scope, $timeout) {
	this.$scope = $scope;
	this.$timeout = $timeout;

	var newsRef = firebase.database().ref('announcements').orderByChild('negdate').limitToFirst(10);
	newsRef.on('value', function(snapshot) {
		this.announcements = [];
		snapshot.forEach(function(child) {
			this.announcements.push(child.val());
		}.bind(this));
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));

	this.popupTitle = 'New Announcement';
	this.newsPopup = false;
}

NewsListCtrl.prototype.hasOfficerStatus = function() {
	return this.dash.hasOfficerStatus();
};

NewsListCtrl.prototype.openPopup = function() {
	this.newsPopup = true;
};

NewsListCtrl.prototype.popupClickOutside = function() {
	this.closePopup();
};

NewsListCtrl.prototype.closePopup = function() {
	this.newsPopup = false;
	this.popupName = '';
	this.popupDetails = '';

	this.$timeout(function() {
		this.$scope.$apply();
	}.bind(this));
};

NewsListCtrl.prototype.submit = function() {
	var negativeDate = 0 - Date.now();
	var ann = {
		name: this.popupName,
		details: this.popupDetails,
		negdate: negativeDate
	};
	
	var dataRef = firebase.database().ref();
	var newAnnouncementKey = dataRef.child('announcements').push().key;
	ann.uid = newAnnouncementKey;
	var updates = {};
	updates['/announcements/' + newAnnouncementKey] = ann;

	dataRef.update(updates).then(function() {
		this.closePopup();
	}.bind(this));

	this.closePopup();
};

NewsListCtrl.prototype.editIfOfficer = function(ann) {
	if (this.dash.hasOfficerStatus()) {
		console.log('Editing Announcement:', ann.name);
	}
};

})();
