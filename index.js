"use strict";

// Main Script File

// Initialize Firebase
var config = {
	apiKey: "AIzaSyCQrW6PCvAMZ9zEQ9Z17HACA2mUcxdho9I",
	authDomain: "usc-triathlon.firebaseapp.com",
	databaseURL: "https://usc-triathlon.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "1427279346"
};
firebase.initializeApp(config);

// Initialize Angular
var app = angular.module('app', ['ngRoute']);

app.directive('main', function() {
	return {
		restrict: 'E',
		template: '<section><section class="loader" ng-if="ctrl.options.loader==true"></section><login ng-if="ctrl.options.showLogin==true"></login><dashboard ng-if="ctrl.options.showLogin==false"></dashboard></section>',
		controller: MainCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function MainCtrl($scope) {
	this.options = {
		showLogin: true,
		loader: true
	};

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// Check if this is a new user...
			var dataRef = firebase.database().ref();

			dataRef.child('users').once('value').then(function(snapshot) {
				var hasUser = snapshot.hasChild(user.uid);
				if (!hasUser) {
					var userEmail = user.email;

					var newUserObj = {
						name: '',
						email: userEmail,
						phone: ''
					};
					var updates = {};
					updates['/users/' + user.uid] = newUserObj;
					dataRef.update(updates);
				}

				// User is signed in
				this.options.showLogin = false;
				this.options.loader = false;
				$scope.$apply();
			}.bind(this));
		} else {
			// No user is signed in
			this.options.showLogin = true;
			this.options.loader = false;
		}
		$scope.$apply();
	}.bind(this));
}
