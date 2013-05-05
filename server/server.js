Meteor.startup(function () {
	Meteor.publish("user_services", function() {
		return Meteor.users.find({_id: this.userId}, {
			fields: {
				'services.facebook.id': 1,
				'services.facebook.name': 1,
				'services.google.id':1,
				'services.google.name':1,
				'services.twitter.id':1,
				'services.twitter.screenName':1
			}
		})
	});

	Meteor.publish("talks", function() {
		return StupidThings.find({} , {
			fields: { }
		})
	});
});



