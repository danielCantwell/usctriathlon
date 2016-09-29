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
app.constant('FIREBASE_URL', 'https://usctriathlon.firebaseio.com');

app.controller('appCtrl', function($scope) {
	$scope.showLogin = true;

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in
			$scope.showLogin = false;
			console.log('User Signed In');
		} else {
			// No user is signed in
			$scope.showLogin = true;
			console.log('No User');
		}
	})
});