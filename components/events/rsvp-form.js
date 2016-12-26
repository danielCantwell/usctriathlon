(function() {
"use strict";

app.directive('rsvpform', function() {
	return {
		restrict: 'E',
		scope: {
			eventctrl: '=',
			event: '=',
			negative: '=',
			positive: '='
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

RsvpCtrl.prototype.negativeClick = function() {
	console.log('Negative Click');
	if (this.negative) {
		this.negative(false);
	}
};

RsvpCtrl.prototype.positiveClick = function() {
	console.log('Positive Click');
	if (this.positive) {
		this.positive(true, this.rsvp.option);
	}
};

})();
