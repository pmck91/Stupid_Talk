/***************************
|||| Meteors client code ||||
****************************/

Meteor.startup(function (){
	Meteor.subscribe("user_services");
	Meteor.subscribe("talks");
	Session.setDefault('service','none');
	Session.setDefault('loggedIn','false');
	Session.setDefault('possibleGoogleAvatarProblem','true');
	Session.setDefault('page','0');
	Session.set('left-right','right');
});

var left = false;
var MAX_CHARS = 150;

Template.header.title = function () {
	return "<h1>Stupid Talk...</h1>";
};

Template.header.greeting = function () {
	return "<h2>Silly things your friends say</h2>";
};

Template.content.bubbles = function(){
	return StupidThings.find({}, {sort: {weightedScore: -1, created: 1}});
};

Template.bubble.rendered = function(){
};

Template.bubble.abubble = function(id, body) {
	
	var ret = '';
	if(!left)
	{
		ret = ret + "<div class=\"bubblediv\" id=\""+ id+ "\"><div class=\"bubbleRight bubble\"><div class=\"innerBubble\"><p>" + body + "</p></div><div class =\"avatarRight avatar\" id=\""+ id +"avatar\"></div>";
			if(Meteor.userId()){
				if(Meteor.userId() == this.owner){
					ret = ret + "<div class=\"rightVote trashvote\"><button class=\"btn btn-mini thumbs-up\"><i class=\"icon-thumbs-up\"></i></button></br><button class=\"btn btn-danger btn-mini delete\"><i class=\"icon-white icon-trash\"></i></button></br>";
					ret = ret + "<button class=\"btn btn-mini thumbs-down\"><i class=\"icon-thumbs-down\"></i></button></div>";
				} else {
					ret = ret + "<div class=\"rightVote vote\"><button class=\"btn btn-mini thumbs-up\"><i class=\"icon-thumbs-up\"></i></button></br><button class=\"btn btn-mini thumbs-down\"><i class=\"icon-thumbs-down\"></i></button></div>";
				}
			}
			ret = ret + "</div></div>";
	} else {
		ret = ret + "<div class=\"bubblediv\" id=\""+ id+ "\"><div class =\"avatarLeft avatar\" id=\""+ id+"avatar\"><div class=\"bubbleLeft bubble\"><div class= \"innerBubble\"><p>"+ body + "</p></div></div>";
			if(Meteor.userId()){
				if(Meteor.userId() == this.owner){
					ret = ret + "<div class=\"leftVote trashvote\"><button class=\"btn btn-mini thumbs-up\"><i class=\"icon-thumbs-up\"></i></button></br><button class=\"btn btn-danger btn-mini delete\"><i class=\"icon-white icon-trash\"></i></button></br><button class=\"btn btn-mini thumbs-down\"><i class=\"icon-thumbs-down\"></i></button></div>";
				} else {
					ret = ret + "<div class=\"leftVote vote\"><button class=\"btn btn-mini thumbs-up\"><i class=\"icon-thumbs-up\"></i></button></br><button class=\"btn btn-mini thumbs-down\"><i class=\"icon-thumbs-down\"></i></button></div>";
				}
			}
			ret = ret + "</div></div>";
	} 
	
	left = !left;
	return ret;
};

Template.bubble.events({
	'click .thumbs-up': function(){
		StupidThings.update(this._id, {$inc:{weightedScore: 1}});
	},
	
	'click .thumbs-down': function(){
		StupidThings.update(this._id, {$set:{weightedScore: -1}});
	},
	
	'click .delete': function(){
		StupidThings.remove(this._id);
	}
});

// code run on loading of #userInput
Template.userInput.rendered = function() {
	Session.set('possibleGoogleAvatarProblem','true');

	if(Session.get('service') == 'google') {
		$('#inputAvatar').css('background-image', 'url(\'default.png\')');
		// found on stack exchange, deals with the fact google returns no image if the user is using the google default 
		var hiddenImg = new Image();
		hiddenImg.onload = function(){
			$('#inputAvatar').css('background-image', 'url(\''+Session.get('avatarURL')+'\')');
			Session.set('possibleGoogleAvatarProblem', 'false');
		};
		hiddenImg.src = Session.get('avatarURL');
	}else{
		$('#inputAvatar').css('background-image', 'url(\''+Session.get('avatarURL')+'\')');
		Session.set('possibleGoogleAvatarProblem','false');
	}
}

Template.content.rendered = function() {
	talks = StupidThings.find({}, {sort: {score: -1, created: 1}});
	
	talks.forEach( function(talk){
		$('#'+talk._id+'avatar').css('background-image', 'url(\''+talk.ownerAvatarUrl+'\')');
	});
}

// template events related to #userInput
Template.userInput.events({

	// insert the 'talk'
	'submit form': function(event) {
		
		if(Meteor.userId()){
		
			var $input = $('#inputtext');
			var avurl = Session.get('avatarURL');
			
			if(Session.get('possibleGoogleAvatarProblem') == 'true') {
				avurl = 'default.png';
			}
			
			// prevent the default submission event
			event.preventDefault();
			
			// put the silly talk into the DB
			StupidThings.insert({
				body: $input.val(),
				created: (new Date).getTime(),
				owner: Meteor.userId(),
				ownerAvatarUrl: avurl,
				score:1,
				weightedScore:1
			});
			
			console.log('Sucesfully submitted your \'talk\'');
			
			// blank it
			$input.val('');
			
			$('#remaining').html(MAX_CHARS);
		} else {
			console.log("A user needs to be logged in for your to do that");
		}
	}, // end of submit handler
	
	// remaining chars counter
	'keyup #inputtext' : function() {
	
		$('#remaining').html(MAX_CHARS - $('#inputtext').val().length);
		
		if(MAX_CHARS -$('#inputtext').val().length <= 25) {
			$('#remaining').addClass("text-error").removeClass("text-warning");
		} else if(MAX_CHARS -$('#inputtext').val().length > 25 && MAX_CHARS -$('#inputtext').val().length <= 50) {
			$('#remaining').addClass("text-warning").removeClass("text-error");
		} else {
			$('#remaining').removeClass("text-warning").removeClass("text-error");
		}
	}
});

// code to be run on dom changes
Deps.autorun(function(){

	// if a user is logged in
	if(Meteor.userId()){
		
		Session.set('loggedIn','true');
		
		var avatarUrl = ' ';
		
		if(Meteor.user().services.facebook){
			avatarUrl = "https://graph.facebook.com/" + Meteor.user().services.facebook.id  + "/picture?type=small";
			Session.set('service','facebook');
		} else if(Meteor.user().services.google) {
			Session.set('service','google');
			avatarUrl = "http://profiles.google.com/s2/photos/profile/" + Meteor.user().services.google.id + "?sz=" + "80";
		} else if(Meteor.user().services.twitter){
			avatarUrl = "http://api.twitter.com/1/users/profile_image?screen_name=" + Meteor.user().services.twitter.screenName + "&size=bigger";
			Session.set('service','twitter');
		} else {
			avatarUrl = "http://imgur.com/F94SAfy";
			Session.set('service','unknown');
		}
		
		Session.set('avatarURL',avatarUrl);
		
	} else {
		Session.set('avatarURL', 'none');
		Session.set('service','none');
		Session.set('loggedIn','false');
	}
});




