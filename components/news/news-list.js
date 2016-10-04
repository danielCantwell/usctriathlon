(function() {
"use strict";

app.directive('newslist', function() {
	return {
		restrict: 'E',
		scope: {
			mainCtrl: '='
		},
		templateUrl: 'components/news/news-list.html',
		controller: NewsListCtrl,
		controllerAs: 'ctrl',
		replace: true,
		bindToController: true
	}
});

function NewsListCtrl() {
	this.announcements = [
		{
			name: 'Announcement One',
			details: 'Here is my first announcement.  It is a good first announcement.'
		},
		{
			name: 'Announcement Two',
			details: 'Here I am announcing more things.  Please take appropriate action in response to this great announcement.  If you do not do this by the deadline, well, that sucks.'
		},
		{
			name: 'Announcement Three',
			details: 'This announcement is the best of them all.  None can match the greatness of this announcement.  Ok I will stop.'
		},
		{
			name: 'Announcement Four',
			details: 'Oh but here is another one.'
		},
		{
			name: 'Announcement Five',
			details: 'Hopefully this one requires the user to scroll down to see.'
		},
		{
			name: 'Announcement Six',
			details: 'What happens if the last announcement is multiple lines?  Will the user be able to scroll far enough?  Who knows?  I hope we will find out now.  Here we go.'
		}
	];
}

})();
