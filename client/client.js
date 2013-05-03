Meteor.subscribe("user_services");

var MAX_CHARS = 200;

Template.header.title = function () {
	return "<h1>Stupid Talk...</h1>";
};

Template.header.greeting = function () {
	return "<h2>Silly things your friends say</h2>";
};

Template.userInput.avatar = function() {
	var avatarUrl = ' ';
	if(Meteor.user().services.facebook){
		avatarUrl = "https://graph.facebook.com/" + Meteor.user().services.facebook.id  + "/picture?type=small";
	} else if(Meteor.user().services.google) {
		avatarUrl = "http://profiles.google.com/s2/photos/profile/" + Meteor.user().services.google.id + "?sz=" + "80";
	} else if(Meteor.user().services.twitter){
		avatarUrl = "http://api.twitter.com/1/users/profile_image?screen_name=" + Meteor.user().services.twitter.screenName + "&size=bigger";
	} else {
		avatarUrl = "http://imgur.com/F94SAfy";
	}

	$('#inputAvatar').css('background-image', 'url('+avatarUrl+')');
}

Template.userInput.events({

	// insert the 'talk'
	'submit form': function(event) {
		
		if(Meteor.userId()){
		
			var avatarUrl = ' ';
			if(Meteor.user().services.facebook){
				avatarUrl = "https://graph.facebook.com/" + Meteor.user().services.facebook.id  + "/picture?type=small";
			} else if(Meteor.user().services.google) {
				avatarUrl = "http://profiles.google.com/s2/photos/profile/" + Meteor.user().services.google.id + "?sz=" + "80";
			} else if(Meteor.user().services.twitter){
				avatarUrl = "http://api.twitter.com/1/users/profile_image?screen_name=" + Meteor.user().services.twitter.screenName + "&size=bigger";
			} else {
				avatarUrl = "http://imgur.com/F94SAfy";
			}

			var $input = $('#inputtext');
			
			// prevent the default submission event
			event.preventDefault();
			
			// put the silly talk into the DB
			StupidThings.insert({
				body: $input.val(),
				created: Date(),
				owner: Meteor.userId(),
				ownerAvatarUrl: avatarUrl,
				score:1,
				weightedScore:1
			});
			
			console.log('submitted');
			// blank it
			$input.val('');
			$('#remaining').html(MAX_CHARS);
		} else {
			console.log("a user needs to be logged in");
		}
	}, // end of submit handler
	
	
	// remaining chars counter
	'keyup #inputtext' : function() {
	
		$('#remaining').html(MAX_CHARS - $('#inputtext').val().length);
		
		if(MAX_CHARS -$('#inputtext').val().length <= 25)
		{
			$('#remaining').addClass("text-error").removeClass("text-warning");
		}
		else if(MAX_CHARS -$('#inputtext').val().length > 25 && MAX_CHARS -$('#inputtext').val().length <= 50)
		{
			$('#remaining').addClass("text-warning").removeClass("text-error");
		}
		else
		{
			$('#remaining').removeClass("text-warning").removeClass("text-error");
		}
		
	}
		
});