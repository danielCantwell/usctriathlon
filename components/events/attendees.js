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

	this.driverSelection = {};

	this.userIsOfficer = false;
	// Check if user is officer
	var officerRef = firebase.database().ref('officers/' + this.user.uid);
	officerRef.once('value', function(snapshot) {
		if (snapshot.val()) {
			this.userIsOfficer = true;
			this.$timeout(function() {
				this.$scope.$apply();
			}.bind(this));
		}
	}.bind(this));

	// Load Attendees (RSVPs)
	var attendeesRef = firebase.database().ref('attendees/' + this.event.key);
	attendeesRef.on('value', function(snapshot) {
		this.attendees = snapshot.val();

		this.passengerCount = 0;
		this.bikeCount = 0;
		this.passengerCapacity = 0;
		this.bikeCapacity = 0;

		if (this.attendees) {
			this.drivers = this.attendees.driver;
			this.passengers = this.attendees.passenger;
			this.selfDrivers = this.attendees['not-carpooling'];

			var pcount = 0;

			if (this.attendees.driver) {
				var driverArray = $.map(this.attendees.driver, function(d) { return d; });
				var selectedDrivers = driverArray.filter(function(d) { return d.selected; });
				
				$.each(driverArray, function(k, driver) {
					this.driverSelection[driver.key] = driver.selected;
			  }.bind(this));

			  if (Object.keys(selectedDrivers).length > 0) {
					var pCapArray = $.map(selectedDrivers, function(d) { return d.passengerCapacity; });
					var bCapArray = $.map(selectedDrivers, function(d) { return d.bikeCapacity; });
					this.passengerCapacity = pCapArray.reduce(function(total, cap) { return total + cap; });
					this.bikeCapacity = bCapArray.reduce(function(total, cap) { return total + cap; });
			  }

				pcount += Object.keys(this.attendees.driver).length

				if (this.attendees.passenger) {
					pcount += Object.keys(this.attendees.passenger).length;
					var passengerArray = $.map(this.attendees.passenger, function(p) { return p; });
					this.bikeCount = driverArray.concat(passengerArray).filter(function(person) { return person.hasBike; }).length;
				} else {
					this.bikeCount = driverArray.filter(function(person) { return person.hasBike; }).length;
				}
			} else if (this.attendees.passenger) {
				pcount += Object.keys(this.attendees.passenger).length;
				this.bikeCount = $.map(this.attendees.passenger, function(p) { return p; }).filter(function(person) { return person.hasBike; }).length;
			}
			this.passengerCount = pcount;
		} else {
			this.drivers = null;
			this.passengers = null;
			this.selfDrivers = null;
		}

		this.$timeout(function() {
				this.$scope.$apply();
			}.bind(this));
	}.bind(this));

	// Update driver selection in firebase
	this.$scope.$watch('ctrl.driverSelection', function(newVal, oldVal) {
		if (Object.keys(oldVal).length > 0) {
			var dataRef = firebase.database().ref();
			var updates = {};

			$.each(newVal, function(driverKey, selection) {
				updates['/attendees/' + this.event.key + '/driver/' + driverKey + '/selected'] = selection;
		  }.bind(this));

			dataRef.update(updates);
		}
	}.bind(this), true);
}

})();
