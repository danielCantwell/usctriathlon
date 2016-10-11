(function() {
"use strict";

app.directive('popup', function() {
	return {
		restrict: 'E',
		scope: {
			ctrl: '='
		},
		templateUrl: 'components/popup/popup.html',
		replace: true,
		transclude: true,
		link: function(scope, elem, attr) {
			scope.outsideClick = function() {
				this.ctrl.popupClickOutside();
			};
		}
	}
});

})();
