import { Mongo } from 'meteor/mongo'

export const Codes = new Mongo.Collection('codes');

if (Meteor.isClient) {
	Meteor.subscribe('codes')
};

if (Meteor.isServer) {
	Meteor.publish('codes', function codesPublication() {
		return Codes.find({}, {limit: 10})
	})
}