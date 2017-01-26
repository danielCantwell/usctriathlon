(function() {
"use strict";

app.directive('settings', function() {
	return {
		restrict: 'E',
		scope: {
			dash: '='
		},
		templateUrl: 'components/settings/settings.html',
		controller: SettingsCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function SettingsCtrl($scope, $timeout) {
	this.$scope = $scope;
	this.$timeout = $timeout;

	this.personalUpdateValue = {
		label: "Click to Update",
		show: false
	};
	this.carUpdateValue = {
		label: "Click to Update",
		show: false
	};

	this.personalInfo = {
		name: this.dash.userInfo.name,
		email: this.dash.userInfo.email,
		phone: this.dash.userInfo.phone,
		hasBike: this.dash.userInfo.hasBike
	};

	this.carInfo = {
		passengerCapacity: this.dash.userInfo.passengerCapacity,
		bikeCapacity: this.dash.userInfo.bikeCapacity
	};

	this.bikeOptions = [
		{ label: 'Yes', value: true },
		{ label: 'No', value: false }
	];

	this.capacityOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '4', value: 4 },
		{ label: '5', value: 5 },
		{ label: '6', value: 6 },
		{ label: '7', value: 7 },
		{ label: '8', value: 8 }
	];

	$(".personal-info input").on("input", function() {
    this.personalUpdateValue.show = true;
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));
	
	$(".personal-info select").on("change", function() {
    this.personalUpdateValue.show = true;
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));	

	$(".car-info select").on("change", function() {
    this.carUpdateValue.show = true;
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));

	this.officerSettings = {
		isOfficer: false,
		position: 'none'
	};

	// Check if user is officer
	var officerRef = firebase.database().ref('officers/' + this.dash.user.uid);
	officerRef.on('value', function(snapshot) {
		if (snapshot.val()) {
			this.officerSettings = {
				isOfficer: true,
				position: snapshot.val()['position']
			};
			this.$timeout(function() {
				this.$scope.$apply();
			}.bind(this));
		}
	}.bind(this));
}

SettingsCtrl.prototype.updatePersonalInfo = function(info) {

	var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var reName = /^([a-zA-Z]{2,}\s[a-zA-Z]{2,})$/;
	var rePhone = /^([0-9]{10})$/;

	// make sure email, name, and phone all have valid info
	if (reName.test(info.name) && reEmail.test(info.email) && rePhone.test(info.phone)) {

		var dataRef = firebase.database().ref();
		var userRef = '/users/' + this.dash.user.uid;

		var update = {};
		update[userRef + '/email'] = info.email;
		update[userRef + '/name'] = info.name;
		update[userRef + '/phone'] = info.phone;
		update[userRef + '/hasBike'] = info.hasBike;

		if (this.officerSettings.isOfficer) {
			update['/officers/' + this.dash.user.uid + '/name'] = info.name;
		}

		this.personalUpdateValue.label = "Updating...";
		dataRef.update(update).then(function() {
			this.personalUpdateValue.show = false;
			this.personalUpdateValue.label = "Click to Update";
			this.$timeout(function() {
				this.$scope.$apply();
			}.bind(this));
		}.bind(this));
	} else {
		this.personalUpdateValue.label = "Please Correct Info to Update";
	}
};

SettingsCtrl.prototype.updateCarInfo = function(info) {
	var dataRef = firebase.database().ref();
	var userRef = '/users/' + this.dash.user.uid;

	var update = {};
	update[userRef + '/passengerCapacity'] = info.passengerCapacity;
	update[userRef + '/bikeCapacity'] = info.bikeCapacity;

	this.carUpdateValue.label = "Updating...";
	dataRef.update(update).then(function() {
		this.carUpdateValue.show = false;
		this.carUpdateValue.label = "Click to Update";
		this.$timeout(function() {
			this.$scope.$apply();
		}.bind(this));
	}.bind(this));
};

SettingsCtrl.prototype.signOut = function() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
	}, function(error) {
		// An error happened.
	});
};

SettingsCtrl.prototype.openOfficerSettings = function() {
	this.showOfficerSettings = true;
};

SettingsCtrl.prototype.popupClickOutside = function() {
	this.closePopups();
};

SettingsCtrl.prototype.closePopups = function() {
	this.showOfficerSettings = false;
	this.$timeout(function() {
		this.$scope.$apply();
	}.bind(this));
};

SettingsCtrl.prototype.enterOfficerCode = function(code) {
	var dataRef = firebase.database().ref('officercode');
	dataRef.once('value', function(snapshot) {
		if (code == snapshot.val()) {
			var officerRef = firebase.database().ref('officers/' + this.dash.user.uid);
			var update = {
				name: this.dash.userInfo.name,
				position: ''
			};
			officerRef.update(update);
		} else {
			this.codeInput = 'Invalid Entry';
			this.$timeout(function() {
				this.$scope.$apply();
			}.bind(this));
		}
	}.bind(this));
};

SettingsCtrl.prototype.updateOfficerSettings = function() {
	var dataRef = firebase.database().ref('officers/' + this.dash.user.uid);
	var update = {
		position: this.officerSettings.position
	};
	dataRef.update(update).then(function() {
		this.$timeout(function() {
			this.$scope.$apply();
			this.closePopups();
		}.bind(this));
	}.bind(this));
};

})();
