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
	this.events = [
		{
			name: 'Event One',
			datetime: '29 Sept 2016',
			location: {}
		},
		{
			name: 'Event Two',
			datetime: '30 Sept 2016',
			location: {}
		}
	];

	this.eventPopup = false;
	this.popupPage = 0;
	this.popupTitle = 'New Workout';

	this.popupPositiveButton = 'Next';
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
	          // map.setZoom(15);
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
		datetime: this.popupDate,
		location: this.popupLocation,
		details: this.popupDetails
	};
	this.events.push(event);
	this.closePopup();
};

EventListCtrl.prototype.hasOfficerStatus = function() {
	return this.dash.hasOfficerStatus();
};

EventListCtrl.prototype.popupClickOutside = function() {
	this.closePopup();
};

EventListCtrl.prototype.closePopup = function() {
	this.eventPopup = false;
	this.popupName = '';
	this.popupDate = null;
	this.popupLocation = null;
	this.popupDetails = '';
};

EventListCtrl.prototype.backPopup = function() {
	this.popupPage -= 1;
};

})();
