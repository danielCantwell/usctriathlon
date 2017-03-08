(function() {
"use strict";

app.directive('eventlist', function() {
	return {
		restrict: 'E',
		scope: {
			dash: '='
		},
		templateUrl: 'components/events/event-list.html',
		controller: EventListCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function EventListCtrl($scope, $timeout) {
	this.$scope = $scope;
	this.$timeout = $timeout;

	var eventRef = firebase.database().ref('events').orderByChild('datetime').startAt(Date.now() - (3 * 86400000));
	// 86400000 is the number of milliseconds in one day
	// 604800000 is the number of milliseconds in one week
	eventRef.on('value', function(snapshot) {
		this.events = [];
		snapshot.forEach(function(child) {
			this.events.push(child.val());
		}.bind(this));
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));

	this.eventPopup = false;
	this.popupPage = 0;
	this.popupTitle = 'New Workout';
	this.popupDate = '';
	this.popupPositiveButton = 'Next';

	this.userIsOfficer = true;
	// Check if user is officer
	var officerRef = firebase.database().ref('officers/' + this.dash.user.uid);
	officerRef.once('value', function(snapshot) {
		if (snapshot.val()) {
			this.userIsOfficer = true;
		}
	}.bind(this));
}

EventListCtrl.prototype.openPopup = function() {
	this.eventPopup = true;
	this.popupPage = 1;
};

EventListCtrl.prototype.loadEvent = function(event) {
	this.dash.options.showTab = false;
	this.dash.options.showEventDetails = true;
	this.dash.objectHolder = event;
};

EventListCtrl.prototype.validateAndNext = function() {
	switch (this.popupPage) {
		case 1:
			if (!this.popupName || this.popupName == "Required") {
				this.popupName = "Required";
			} else if (!this.popupDate) {
				
			} else {
				this.popupTitle = 'Select Event Location';
				this.popupPage = 2;

				this.$timeout(function() {
					var eventLocation = new google.maps.LatLng(34.022413, -118.287862);
					this.popupLocation = {
						lat: eventLocation.lat(),
						lon: eventLocation.lng()
					};

					var mapOptions = {
						zoom: 14,
						center: eventLocation,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var map = new google.maps.Map(document.getElementById('map'), mapOptions);
					var marker = new google.maps.Marker({
						position: eventLocation,
						map: map,
						title: 'Meeting Location'
					});
					map.addListener('click', function(event) {
	          this.popupLocation = {lat: event.latLng.lat(), lon: event.latLng.lng()};
	          var position = new google.maps.LatLng(this.popupLocation.lat, this.popupLocation.lon);
	          marker.setPosition(position);
	          map.setCenter(marker.getPosition());
	        }.bind(this));
				}.bind(this));
			}
			break;
		case 2:
			break;
	}
};

EventListCtrl.prototype.validateAndSave = function() {
	var event = {
		name: this.popupName,
		datetime: Date.parse(this.popupDate),
		location: this.popupLocation,
		details: this.popupDetails,
		openRSVP: true
	};
	var att = {
		passengerCount: 0,
		bikeCount: 0,
		passengerCapacity: 0,
		bikeCapacity: 0,
		driver: {},
		passenger: {},
		'not-carpooling': {}
	};

	var dataRef = firebase.database().ref();
	var newEventKey = dataRef.child('events').push().key;
	event.key = newEventKey;
	var updates = {};
	updates['/events/' + newEventKey] = event;
	updates['/attendees/' + newEventKey] = att;

	dataRef.update(updates).then(function() {
		this.closePopup();
	}.bind(this));
};

EventListCtrl.prototype.popupClickOutside = function() {
	this.closePopup();
};

EventListCtrl.prototype.closePopup = function() {
	this.eventPopup = false;
	this.popupName = '';
	this.popupDate = '';
	this.popupLocation = null;
	this.popupDetails = '';
	this.$timeout(function() {
		this.$scope.$apply();
	}.bind(this));
};

EventListCtrl.prototype.backPopup = function() {
	this.popupPage -= 1;
};

EventListCtrl.prototype.rsvpText = function(openRSVP) {
	if (openRSVP) {
		return 'RSVP Open';
	} else {
		return 'RSVP Closed';
	}
};

EventListCtrl.prototype.eventClass = function(event) {
	if (event.datetime < (Date.now() - 86400000)) {
		return 'old';
	}
};

})();
