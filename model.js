StupidThings = new Meteor.Collection("stupid_things");

StupidThings.allow({

	// only allow an insert op if a user is logged in
	insert: function(userId, talk){
		return userId && talk.owner === userId;
	},
	
	// users can only change an opjects score, a bug is that through the console they can change it by any amount they wish
	update: function(id, talks, fields, modifier){
		var allowed = ['weightedScore'];
		
		if(_.difference(fields,allowed).length){
			return false;
		} else {
			return true;
		}
	},
	
	// can only remove it if its yours
	remove: function(id,talk){
		return id && talk.owner === id;
	}
});