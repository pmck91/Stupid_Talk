Template.header.title = function () {
	return "<h1>Stupid Talk...</h1>";
};

Template.header.greeting = function () {
	return "<h2>Silly things your friends say</h2>";
};

Template.hello.events({
	'click input' : function () {
	// template data, if any, is available in 'this'
	if (typeof console !== 'undefined')
		console.log("You pressed the button");
}});