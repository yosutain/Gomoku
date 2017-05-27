import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	var globalObject=Meteor.isClient?window:global;
	for(var property in globalObject){
		var object=globalObject[property];
		if(object instanceof Meteor.Collection){
			object.remove({});
		}
	}
});

piecesOnBoard = new Mongo.Collection('pieces');
gomokuWinner = new Mongo.Collection('winner');

if (Meteor.isServer) {
	Meteor.startup(function() {
		return Meteor.methods({
			removeAllPieces: function() {
				return piecesOnBoard.remove({});
			},

			resetWinner: function() {
				return gomokuWinner.remove({});
			}
		});
	});
}