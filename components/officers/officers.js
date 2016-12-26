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

function OfficersCtrl() {
	this.officers = [
		{
			'name': 'Kenneth Rodriguez-Clisham',
			'title': 'President'
		},
		{
			'name': 'Christina Yang',
			'title': 'Recruitment Chair'
		},
		{
			'name': 'Daniel Cantwell',
			'title': 'Christina\'s Person'
		},
		{
			'name': 'Other Person',
			'title': 'Some Position'
		},
		{
			'name': 'Christina Yang',
			'title': 'Recruitment Chair'
		},
		{
			'name': 'Daniel Cantwell',
			'title': 'Christina\'s Person'
		},
		{
			'name': 'Other Person',
			'title': 'Some Position'
		},
		{
			'name': 'Christina Yang',
			'title': 'Recruitment Chair'
		},
		{
			'name': 'Daniel Cantwell',
			'title': 'Christina\'s Person'
		},
		{
			'name': 'Other Person',
			'title': 'Some Position'
		}
	];
}

OfficersCtrl.prototype.hasOfficerStatus = function() {
	// return user.status == 'officer';
	return true;
};

})();
