(function() {
"use strict";

app.directive('dashboard', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/dashboard/dashboard.html',
		controller: DashboardCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function DashboardCtrl($scope, $timeout) {
	this.options = {
		showTab: true,
		activeTab: 'main',
		showEventDetails: false
	};
	this.objectHolder = null;
	this.user = firebase.auth().currentUser;

	var userRef = firebase.database().ref('users/' + this.user.uid);
	userRef.on('value', function(snapshot) {
		this.userInfo = snapshot.val();
	}.bind(this));

	this.userIsOfficer = false;

	var officerRef = firebase.database().ref('officers/' + this.user.uid);
	officerRef.once('value', function(snapshot) {
		if (snapshot.val()) {
			this.userIsOfficer = true;
			$timeout(function() {
				$scope.$apply();
			});
		}
	}.bind(this));
}

DashboardCtrl.prototype.activateTab = function(which) {
	$('.active').removeClass('active');
	$('#tab-' + which).addClass('active');
	this.options.activeTab = which;
};

})();
