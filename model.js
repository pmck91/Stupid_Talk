StupidThings = new Meteor.Collection("stupid_things");
Alignments = new Meteor.Collection("alignment");

StupidThings.allow({

	// only allow an insert op if a user is logged in
	insert: function(userId, talk){
		return userId && talk.owner === userId;
	},
	
	update: function(id, talks, fields, modifier){
		var allowed = ['weightedScore'];
		
		if(_.difference(fields,allowed).length){
			return false;
		} else {
			return true;
		}
	},
	
	remove: function(id,talk){
		return id && talk.owner === id;
	}
});