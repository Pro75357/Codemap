import { Mongo } from 'meteor/mongo'

export const Saved = new Mongo.Collection('saved');


if (Meteor.isClient) {
	Meteor.subscribe('saved')
}

if (Meteor.isServer) {
	Meteor.publish('saved', function savedPublication() {
		return Saved.find()
	})
}