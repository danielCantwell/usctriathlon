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
		template: '<section><login ng-if="ctrl.options.showLogin==true"></login><dashboard ng-if="ctrl.options.showLogin==false"></dashboard></section>',
		controller: MainCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function MainCtrl($scope) {
	this.options = {
		showLogin: true
	};

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in
			this.options.showLogin = false;
		} else {
			// No user is signed in
			this.options.showLogin = true;
		}
		$scope.$apply();
	}.bind(this));
}
