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

function DashboardCtrl($scope) {
	this.activeTab = 'main';
}

DashboardCtrl.prototype.activateTab = function(which) {
	$('.active').removeClass('active');
	$('#tab-' + which).addClass('active');
	this.activeTab = which;
};

})();
