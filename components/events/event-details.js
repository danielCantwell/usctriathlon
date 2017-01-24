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

function EventDetailsCtrl($scope, $timeout, $q) {
	this.$scope = $scope;
	this.$timeout = $timeout;
	this.$q = $q;

	$scope.$watchCollection('ctrl.comments', function(newValue) {
		if (newValue) {
			$timeout(function(){
				$('ul').scrollTop($('ul')[0].scrollHeight);
			}, 0);
		}
	});

	this.view = 'details';
	this.rsvpButtonText = 'RSVP';
	this.showOfficerOptions = false;

	this.event = this.dash.objectHolder;
	this.eKey = this.event.key;

	// Load Comments
	var commentsRef = firebase.database().ref('comments/' + this.eKey);
	commentsRef.on('value', function(snapshot) {
		this.comments = snapshot.val();
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));

	var attendeesRef = firebase.database().ref('attendees/' + this.eKey);
	attendeesRef.on('value', function(snapshot) {
	  if (snapshot.hasChild('driver') && this.dash.user.uid in snapshot.val()['driver']) {
	    this.rsvpButtonText = 'Driver';
	  } else if (snapshot.hasChild('passenger') && this.dash.user.uid in snapshot.val()['passenger']) {
	    this.rsvpButtonText = 'Passenger';
	  } else if (snapshot.hasChild('not-carpooling') && this.dash.user.uid in snapshot.val()['not-carpooling']) {
	    this.rsvpButtonText = 'Driving Self';
	  } else {
	  	this.rsvpButtonText = 'RSVP';
	  }
	}.bind(this));

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
		title: 'Event Location'
	});
}

EventDetailsCtrl.prototype.hasOfficerStatus = function() {
	return this.dash.hasOfficerStatus();
};

EventDetailsCtrl.prototype.goBack = function() {
	this.dash.options.showTab = true;
	this.dash.options.showEventDetails = false;
	this.dash.objectHolder = null;
};

EventDetailsCtrl.prototype.activateTab = function(which) {
	$('.active').removeClass('active');
	$('#tab-' + which).addClass('active');
	this.view = which;

	if (this.view == 'comments') {
		this.$timeout(function(){
			$('ul').scrollTop($('ul')[0].scrollHeight);
		}, 0);
	}
};

EventDetailsCtrl.prototype.viewRsvpForm = function() {
	this.rsvpPopup = true;
};

EventDetailsCtrl.prototype.initials = function(name) {
	var matches = name.match(/\b(\w)/g);
	var acronym = matches.join('');
	return acronym;
};

EventDetailsCtrl.prototype.sendComment = function() {
	if (this.newComment) {

		var comment = {
			name: this.dash.userInfo.name,
			message: this.newComment,
			uid: this.dash.user.uid,
			date: Date.now()
		};

		var dataRef = firebase.database().ref();
		var newCommentKey = dataRef.child('comments/' + this.eKey).push().key;
		comment.key = newCommentKey;
		var updates = {};
		updates['/comments/' + this.eKey + '/' + newCommentKey] = comment;

		dataRef.update(updates).then(function() {
			this.newComment = '';
			this.closePopups();
		}.bind(this));
	}
};

// This is called in the context of the rsvp form controller
EventDetailsCtrl.prototype.rsvp = function(going) {
	// whether the person is not going, or changing their rsvp, we want to remove any existing rsvps

	var removeRef = firebase.database().ref().child('attendees').child(this.eKey);
	var pd = removeRef.child('driver').child(this.dash.user.uid).remove();
	var pp = removeRef.child('passenger').child(this.dash.user.uid).remove();
	var pn = removeRef.child('not-carpooling').child(this.dash.user.uid).remove();

	this.$q.all([pd, pp, pn]).then(function() {
		if (going && this.rsvp.option) {
			var rsvp = {
				name: this.dash.userInfo.name,
				hasBike: this.dash.userInfo.hasBike,
				date: Date.now(),
				key: this.dash.user.uid
			};

			if (this.rsvp.option == 'driver') {
				rsvp.passengerCapacity = this.dash.userInfo.passengerCapacity;
				rsvp.bikeCapacity = this.dash.userInfo.bikeCapacity;
				rsvp.selected = true;
			}

			var dataRef = firebase.database().ref();
			var updates = {};
			updates['/attendees/' + this.eKey + '/' + this.rsvp.option + '/' + this.dash.user.uid] = rsvp;

			dataRef.update(updates).then(function() {
				this.closePopups();
			}.bind(this));
		} else {
			this.closePopups();
		}
	}.bind(this));
};

EventDetailsCtrl.prototype.clickOfficerOptions = function() {
	this.showOfficerOptions = true;
};

EventDetailsCtrl.prototype.popupClickOutside = function() {
	this.closePopups();
};

EventDetailsCtrl.prototype.closePopups = function() {
	this.showOfficerOptions = false;
	this.rsvpPopup = false;
	this.$timeout(function() {
		this.$scope.$apply();
	}.bind(this));
}

})();
