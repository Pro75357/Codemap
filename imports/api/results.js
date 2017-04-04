import { Mongo } from 'meteor/mongo'

export const Results = new Mongo.Collection('results');

if (Meteor.isClient) {
	Meteor.subscribe('results')
};

if (Meteor.isServer) {
	Meteor.publish('results', function resultsPublication() {
		return Results.find();
	})

	Meteor.methods({
		'results.insert'({ result }) {
			console.log("inserting results")
			Results.insert(result);
		},
		'results.remove'(pressureId){
			Results.remove(pressureId);
		},
		'results.count'(){
			//console.log(Results.find({}).count());
			return Results.find({}).count();
		},
		'results.getOne'(){ // this one needs finished
			return Results.findOne({});
		},	
		'results.find'(){
			return Results.find({});
		}
});
}

