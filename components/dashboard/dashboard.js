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

function DashboardCtrl() {
	this.options = {
		showTab: true,
		activeTab: 'main',
		showEventDetails: false
	};
	this.objectHolder = null;
	this.user = firebase.auth().currentUser;
}

DashboardCtrl.prototype.activateTab = function(which) {
	$('.active').removeClass('active');
	$('#tab-' + which).addClass('active');
	this.options.activeTab = which;
};

DashboardCtrl.prototype.hasOfficerStatus = function() {
	// return user.status == 'officer';
	return true;
};

})();