import { Mongo } from 'meteor/mongo'

export const Results = new Mongo.Collection(null);

/*
if (Meteor.isClient) {
	Meteor.subscribe('results')
};
if (Meteor.isServer) {
	Meteor.publish('results', function resultsPublication() {
		return Results.find();
	})
*/
if (Meteor.isServer) {
	Meteor.methods({
		'results.insert'(result) {
			console.log(result.results)
			Results.insert({ data : result.result.results });
		},
		'results.remove'(pressureId){
			Results.remove({});
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