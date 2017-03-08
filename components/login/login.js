(function() {
"use strict";

app.directive('login', function() {
	return {
		restrict: 'E',
		scope: {
			main: '='
		},
		templateUrl: 'components/login/login.html',
		controller: LoginCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function LoginCtrl($scope) {
	this.registering = false;
	this.$scope = $scope;
	this.loader = false;
}

LoginCtrl.prototype.login = function(user) {
	if (this.validateLoginFields(user)) {
		// Login User
		this.loader = true;
		firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function(error) {
			this.loader = false;
			switch (error.code) {
				case 'auth/wrong-password':
					this.errorMessage = 'Password is not correct';
			}
			if (this.errorMessage == null) {
				this.errorMessage = 'Error logging in. Please make sure your email is correct.';
			}
			this.$scope.$apply();
		}.bind(this));
	} else {
		this.errorMessage = 'Error in the format of your login information'
	}
};

LoginCtrl.prototype.register = function(user) {
	if (this.validateRegistrationFields(user)) {

		this.main.newUserInfo = {
			name: user.name,
			phone: user.phone,
			hasBike: true,
			passengerCapacity: 0,
			bikeCapacity: 0
		};

		// Register User
		this.loader = true;
		firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
			console.log('Registration Failed');
			this.loader = false;
			this.main.newUserInfo = null;
		}.bind(this));
	}
};

LoginCtrl.prototype.toggleRegistering = function() {
	this.registering = !this.registering;
};

LoginCtrl.prototype.validateLoginFields = function(user) {
	// email regex
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	this.flagEmail = !user || !user.email || !re.test(user.email);
	this.flagPassword = !user || !user.password || !(user.password.length > 3);

	return !this.flagEmail && !this.flagPassword;
};

LoginCtrl.prototype.validateRegistrationFields = function(user) {
	var validLoginInfo = this.validateLoginFields(user);
	// var reName = /^([a-zA-Z]{2,}\s[a-zA-Z]{2,})$/;
	var rePhone = /^([0-9]{10})$/;
	this.flagName = !user || !user.name;
	this.flagPhone = !user || !user.phone || !rePhone.test(user.phone);

	return validLoginInfo && !this.flagName && !this.flagPhone;
};

})();
