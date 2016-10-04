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

function EventListCtrl($scope) {
	this.$scope = $scope;
	this.events = [
		{
			name: 'Event One',
			date: '29 Sept 2016'
		},
		{
			name: 'Event Two',
			date: '30 Sept 2016'
		}
	];

	// this.loadEvent();
}

EventListCtrl.prototype.loadEvent = function(event) {
	this.dash.options.showTab = false;
	this.dash.options.showEventDetails = true;
	this.dash.objectHolder = event;
};

})();
