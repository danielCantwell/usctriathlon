(function() {
"use strict";

app.directive('settings', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/settings/settings.html',
		controller: SettingsCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function SettingsCtrl($scope) {
}

SettingsCtrl.prototype.signOut = function() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
	}, function(error) {
		// An error happened.
	});
};

})();
