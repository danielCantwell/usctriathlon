(function() {
"use strict";

app.directive('officers', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/officers/officers.html',
		controller: OfficersCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function OfficersCtrl($scope, $timeout) {
	var dataRef = firebase.database().ref('officers');
	dataRef.once('value', function(snapshot) {
		if (snapshot.val()) {
			this.officers = $.map(snapshot.val(), function(o) { return o; });
			$timeout(function() {
				$scope.$apply();
			});
		}
	}.bind(this));
}

})();
