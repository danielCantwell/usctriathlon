(function() {
"use strict";

app.directive('attendees', function() {
	return {
		restrict: 'E',
		scope: {
			eventctrl: '='
		},
		templateUrl: 'components/events/attendees.html',
		controller: AttendeesCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function AttendeesCtrl($scope, $timeout) {
	this.$scope = $scope;
	this.$timeout = $timeout;
	this.options = {
		showTab: true,
		activeTab: 'main',
		showEventDetails: false
	};
	this.user = firebase.auth().currentUser;

	this.event = this.eventctrl.event;
	this.passengerCount = 0;
	this.bikeCount = 0;
	this.passengerCapacity = 0;
	this.bikeCapacity = 0;

	// Load Attendees (RSVPs)
	var attendeesRef = firebase.database().ref('attendees/' + this.event.key);
	attendeesRef.on('value', function(snapshot) {
		this.attendees = snapshot.val();

		if (this.attendees) {
			this.drivers = this.attendees.driver;
			this.passengers = this.attendees.passenger;
			this.selfDrivers = this.attendees['not-carpooling'];

			var pcount = 0;
			var bcount = 0;

			if (this.attendees.driver) {
				var driverArray = $.map(this.attendees.driver, function(d) { return d; });
				var pCapArray = $.map(driverArray, function(d) { return d.passengerCapacity; });
				var bCapArray = $.map(driverArray, function(d) { return d.bikeCapacity; });
				this.passengerCapacity = pCapArray.reduce(function(total, cap) { return total + cap; });
				this.bikeCapacity = bCapArray.reduce(function(total, cap) { return total + cap; });
				pcount += Object.keys(this.attendees.driver).length

				if (this.attendees.passenger) {
					pcount += Object.keys(this.attendees.passenger).length;
					this.bikeCount = driverArray.concat(passengerArray).filter(function(person) { return person.hasBike; }).length;
				} else {
					this.bikeCount = driverArray.filter(function(person) { return person.hasBike; }).length;
				}
			} else if (this.attendees.passenger) {
				pcount += Object.keys(this.attendees.passenger).length;
				this.bikeCount = $.map(this.attendees.passenger, function(p) { return p; }).filter(function(person) { return person.hasBike; }).length;
			}
			this.passengerCount = pcount;

			this.$timeout(function() {
				this.$scope.$apply();
			}.bind(this));
		}
	}.bind(this));
}

AttendeesCtrl.prototype.hasOfficerStatus = function() {
	// return user.status == 'officer';
	return true;
};

})();
