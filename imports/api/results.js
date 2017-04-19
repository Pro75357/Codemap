import { Mongo } from 'meteor/mongo'

export const Results = new Mongo.Collection('results');


if (Meteor.isClient) {
	Meteor.subscribe('results')
}

if (Meteor.isServer) {
	Meteor.publish('results', function resultsPublication() {
		return Results.find()
	})
}