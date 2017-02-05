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
	this.popupKey = '';

	this.userIsOfficer = false;
	// Check if user is officer
	var officerRef = firebase.database().ref('officers/' + this.dash.user.uid);
	officerRef.once('value', function(snapshot) {
		if (snapshot.val()) {
			this.userIsOfficer = true;
		}
	}.bind(this));
}

NewsListCtrl.prototype.openPopup = function() {
	this.newsPopup = true;
};

NewsListCtrl.prototype.popupClickOutside = function() {
	this.closePopup();
};

NewsListCtrl.prototype.closePopup = function() {
	this.newsPopup = false;
	this.popupKey = '';
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
		negdate: negativeDate
	};

	if (this.popupDetails) {
		ann.details = this.popupDetails;
	}
	
	var dataRef = firebase.database().ref();
	var updates = {};

	if (this.popupKey.length > 0) {
		updates['/announcements/' + this.popupKey] = ann;
		ann.key = this.popupKey;
	} else {
		var newAnnouncementKey = dataRef.child('announcements').push().key;
		updates['/announcements/' + newAnnouncementKey] = ann;
		ann.key = newAnnouncementKey;
	}

	dataRef.update(updates).then(function() {
		this.closePopup();
	}.bind(this));
};

NewsListCtrl.prototype.editIfOfficer = function(ann) {
	if (this.userIsOfficer) {
		this.newsPopup = true;
		this.popupKey = ann.key;
		this.popupName = ann.name;
		this.popupDetails = ann.details;
	}
};

NewsListCtrl.prototype.deleteAnnouncement = function(key) {
	firebase.database().ref('announcements/' + key).remove();
	this.closePopup();
};

})();
