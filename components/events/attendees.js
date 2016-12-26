(function() {
"use strict";

app.directive('attendees', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/events/attendees.html',
		controller: AttendeesCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function AttendeesCtrl() {
	this.options = {
		showTab: true,
		activeTab: 'main',
		showEventDetails: false
	};
	this.objectHolder = null;
	this.user = firebase.auth().currentUser;

	this.event = {
		'attendees': [
			'daniel', 'christina'
		]
	}

	this.passengerCount = 3;
	this.passengerSpots = 4;
	this.bikeCount = 2;
	this.bikeSpots = 3;

	this.drivers = [
		'Sir Kenneth',
		'Ms Christina',
		'Dawson Ray',
		'Sir Kenneth',
		'Ms Christina',
		'Dawson Ray'
	];

	this.passengers = [
		'Daniel Cantwell',
		'Michael Tong',
		'Kitty Cantwell',
		'Bobby Smith',
		'Chris Longear',
		'Daniel Cantwell',
		'Michael Tong',
		'Kitty Cantwell',
		'Bobby Smith',
		'Chris Longear',
		'Cute Puppy',
		'Daniel Cantwell',
		'Michael Tong',
		'Kitty Cantwell',
		'Bobby Smith',
		'Chris Longear',
		'Turkey Trihard'
	];
}

AttendeesCtrl.prototype.hasOfficerStatus = function() {
	// return user.status == 'officer';
	return true;
};

})();
