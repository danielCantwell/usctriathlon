(function() {
"use strict";

app.directive('rsvpform', function() {
	return {
		restrict: 'E',
		scope: {
			eventctrl: '=',
			event: '='
		},
		templateUrl: 'components/events/rsvp-form.html',
		controller: RsvpCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function RsvpCtrl($scope) {
	this.rsvp = {
		option: 'passenger'
	}
}

})();
