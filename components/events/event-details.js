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
	this.officerOptionsText = {
		close: {
			display: 'Close RSVPs',
			value: 'close-rsvp'
		},
		edit: {
			display: 'Edit Event',
			value: 'edit'
		},
		delete: {
			display: 'Delete Event',
			value: 'delete'
		},
		export: {
			display: 'Export Emails',
			value: 'export'
		}
	};

	this.event = this.dash.objectHolder;
	this.eKey = this.event.key;

	this.userIsOfficer = false;
	// Check if user is officer
	var officerRef = firebase.database().ref('officers/' + this.dash.user.uid);
	officerRef.once('value', function(snapshot) {
		if (snapshot.val()) {
			this.userIsOfficer = true;
		}
	}.bind(this));

	// Load Comments
	var commentsRef = firebase.database().ref('comments/' + this.eKey);
	commentsRef.on('value', function(snapshot) {
		this.comments = snapshot.val();
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));

	// Load RSVP status
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

	// Check if rsvp status is open or closed
	var rsvpOpenRef = firebase.database().ref('events/' + this.eKey);
	rsvpOpenRef.on('value', function(snapshot) {
		if (snapshot.val()) {
			var openRSVP = snapshot.val()['openRSVP'];
			if (openRSVP) {
				this.officerOptionsText.close.display = 'Close RSVPs';
				this.officerOptionsText.close.value = 'close-rsvp';
			} else {
				this.officerOptionsText.close.display = 'Open RSVPs';
				this.officerOptionsText.close.value = 'open-rsvp';
			}
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
				key: this.dash.user.uid,
				email: this.dash.userInfo.email
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
};

EventDetailsCtrl.prototype.officerOption = function(option) {
	var action = this.officerOptionsText[option].value;
	switch (action) {
		case 'close-rsvp':
			this.officerOptionsText.close.display = 'CONFIRM: Close RSVPs?';
			this.officerOptionsText.close.value = 'close-rsvp-confirm';
			break;
		case 'close-rsvp-confirm':
			this.openRSVPs(false).then(function() {
				this.closePopups();
			}.bind(this));
			break;
		case 'open-rsvp':
			this.officerOptionsText.close.display = 'CONFIRM: Open RSVPs?';
			this.officerOptionsText.close.value = 'open-rsvp-confirm';
			break;
		case 'open-rsvp-confirm':
			this.openRSVPs(true).then(function() {
				this.closePopups();
			}.bind(this));
			break;
		case 'edit':
			console.log('edit')
			break;
		case 'delete':
			this.officerOptionsText.delete.display = 'CONFIRM: Delete Event?';
			this.officerOptionsText.delete.value = 'delete-confirm';
			break;
		case 'delete-confirm':
			this.officerOptionsText.delete.display = 'Delete Event';
			this.officerOptionsText.delete.value = 'delete';
			this.deleteEvent().then(function() {
				this.closePopups();
				this.goBack();
			}.bind(this));
			break;
		case 'export':
			this.exportEmails();
			break;
		default:
			this.closePopups();
	}
};

EventDetailsCtrl.prototype.openRSVPs = function(openStatus) {
	var dataRef = firebase.database().ref();
	var openRSVPref = '/events/' + this.eKey + '/openRSVP';
	var update = {};
	update[openRSVPref] = openStatus;
	return dataRef.update(update);
};

EventDetailsCtrl.prototype.deleteEvent = function() {
	var dataRef = firebase.database().ref();

	// delete all information related to event ...
	// delete attendees
	dataRef.child('attendees').child(this.eKey).remove();
	// delete comments
	dataRef.child('comments').child(this.eKey).remove();

	// delete the event itself, and return the promise
	return dataRef.child('events').child(this.eKey).remove();
};

EventDetailsCtrl.prototype.exportEmails = function() {

	var dataRef = firebase.database().ref('attendees/' + this.eKey);
	dataRef.once('value', function(snapshot) {
		if (snapshot.val()) {
			var att = snapshot.val();
			var emails = [];

			if (att['driver']) {
				var driverArray = $.map(att.driver, function(d) { return d.email; });
				emails = emails.concat(driverArray);
			}
			if (att['passenger']) {
				var passengerArray = $.map(att.passenger, function(d) { return d.email; });
				emails = emails.concat(passengerArray);
			}
			if (att['not-carpooling']) {
				var selfDriversArray = $.map(att['not-carpooling'], function(d) { return d.email; });
				emails = emails.concat(selfDriversArray);
			}

			// Export Email Array to CSV File
			var CSV = '';

			for (var i = 0; i < emails.length; i++) {
				CSV += '"' + emails[i] + '"\r\n';
			}

			var filename = this.event.name + '-' + this.event.datetime;
			filename = filename.replace(/ /g, '-');
			var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

	    // generate a temp <a /> tag
	    var link = document.createElement("a");    
	    link.href = uri;
	    
	    // set the visibility hidden so it will not effect on your web-layout
	    link.style = "visibility:hidden";
	    link.download = filename + ".csv";
	    
	    // this part will append the anchor tag and remove it after automatic click
	    document.body.appendChild(link);
	    link.click();
	    document.body.removeChild(link);
		}
	}.bind(this));

	this.closePopups();
};

})();
