(function() {
"use strict";

app.directive('eventdetails', function() {
	return {
		restrict: 'E',
		scope: {
			dash: '='
		},
		templateUrl: 'components/events/event-details.html',
		controller: EventDetailsCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function EventDetailsCtrl($scope, $timeout) {

	this.$timeout = $timeout;

	$scope.$watchCollection('ctrl.comments', function(newValue) {
		if (newValue) {
			$timeout(function(){
				$('ul').scrollTop($('ul')[0].scrollHeight);
			}, 0);
		}
	});

	this.view = {
		details: true,
		comments: false,
		rsvp: false
	};

	this.event = this.dash.objectHolder;

	// this.event = {
	// 	name: 'Amalfi Loops',
	// 	datetime: '7:00 AM - 9/30/16',
	// 	details: 'Hey team! Who is ready for some AMALFI AWESOMENESS tomorrow?\n\nWe will be heading out to the rolling hills of Santa Monica to test ourselves with some Amalfi loops. This is a beautiful area and a super fun ride (I personally like to go house hunting as we ride through the neighborhoods!)\n\nHere are the details:\n- leaving at 7:00 am at the parking lot on the corner of Orchard and Jefferson! Please be there on time, especially if you are a driver.\n- meeting at the intersection of Ocean and San Vicente, by the picnic tables! There is abundant street parking on Georgina, which is one street south of San Vicente. Do not do the parking meter thing. Save yo money.\n\nFor those of you who just got bikes or are a little less experienced, do not worry - we will take some time to go over basics of road riding and make sure everyone knows the route really well before we send you guys out.\n\nMake sure to bring:\nBike\nBike shoes\nHelmet\nSunglasses\nWATER BOTTLES (not a screw top - something you can easily drink on the bike!)\n\nThe team will be providing nutrition (gels, bars) courtesy of Clif!!\n\nPlease text me (Emily) with any questions - 8582325164\n\nSee you guys tomorrow bright and early!!! 7am SHARP!!!!\n\nEm',
	// 	rsvpclose: '6:00 PM - 9/28/16',
	// 	lat: 34.025874,
	// 	lon: -118.512749
	// };

	// this.event.details = this.event.details.replace(/\n/g,"<br>");

	this.attendees = [
		'Daniel Cantwell',
		'Christina Yang',
		'Kenneth Rodriguez-Clisham',
		'Justin Zhang',
		'Dawson Ray'
	];

	this.drivers = [
		'Christina Yang',
		'Kenneth Rodriguez-Clisham'
	];

	this.comments = [
		{
			name: 'Daniel Cantwell',
			message: 'This is my first comment'
		},
		{
			name: 'Christina Yang',
			message: 'This comment is much better though'
		},
		{
			name: 'Daniel Cantwell',
			message: 'Oh you are right.  I should have known.'
		},
		{
			name: 'Other Person',
			message: 'I am going to leave a long comment that will hopefully span two lines, to make sure the words wrap correctly.'
		},
		{
			name: 'Christina Yang',
			message: 'This comment is much better though'
		},
		{
			name: 'Daniel Cantwell',
			message: 'Oh you are right.  I should have known.'
		},
		{
			name: 'Other Person',
			message: 'I am going to leave a long comment that will hopefully span two lines, to make sure the words wrap correctly.'
		},
		{
			name: 'Christina Yang',
			message: 'This comment is much better though'
		},
		{
			name: 'Daniel Cantwell',
			message: 'Oh you are right.  I should have known.'
		},
		{
			name: 'Other Person',
			message: 'I am going to leave a long comment that will hopefully span two lines, to make sure the words wrap correctly.'
		},
		{
			name: 'Christina Yang',
			message: 'This comment is much better though'
		},
		{
			name: 'Daniel Cantwell',
			message: 'Oh you are right.  I should have known.'
		},
		{
			name: 'Other Person',
			message: 'I am going to leave a long comment that will hopefully span two lines, to make sure the words wrap correctly.'
		}
	];

	var eventLocation = new google.maps.LatLng(this.event.location.lat, this.event.location.lon);

	var mapOptions = {
		zoom: 14,
		center: eventLocation,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	var marker = new google.maps.Marker({
		position: eventLocation,
		map: map,
		title: 'Meeting Location'
	});
}

EventDetailsCtrl.prototype.goBack = function() {
	this.dash.options.showTab = true;
	this.dash.options.showEventDetails = false;
	this.dash.objectHolder = null;
};

EventDetailsCtrl.prototype.toggleView = function() {
	if (this.view.details) {
		this.view.details = false;
		this.view.comments = true;
		$('#view-toggle').prop('value', 'Details');
		this.$timeout(function(){
			$('ul').scrollTop($('ul')[0].scrollHeight);
		}, 0);
	} else {
		this.view.details = true;
		this.view.comments = false;
		$('#view-toggle').prop('value', 'Comments');
	}
	this.view.rsvp = false;
};

EventDetailsCtrl.prototype.viewRsvpForm = function() {
	this.view.rsvp = true;
};

EventDetailsCtrl.prototype.hideRSVP = function() {
	this.view.rsvp = false;
};

EventDetailsCtrl.prototype.initials = function(name) {
	var matches = name.match(/\b(\w)/g);
	var acronym = matches.join('');
	return acronym;
};

EventDetailsCtrl.prototype.sendComment = function() {
	this.comments.push({
		name: 'First Last',
		message: this.newComment
	});
	this.newComment = '';
};

})();
