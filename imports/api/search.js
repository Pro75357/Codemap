import { Mongo } from 'meteor/mongo'
import './auth.js'

export const Pressure = new Mongo.Collection('pressure');

if (Meteor.isClient) {
	Meteor.subscribe('pressure')
};

if (Meteor.isServer) {
	Meteor.publish('pressure', function pressurePublication() {
		return Pressure.find();
	})
};

Meteor.methods({
	'pressure.insert'({ systolic, diastolic, readingTime }) {
		Pressure.insert({
			systolic,
			diastolic,
			readingTime,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
	},
	'pressure.remove'(pressureId){
		Pressure.remove(pressureId);
	},
	'pressure.count'(){
		return Pressure.find({}).count();
	},
	'pressure.get'(){ // this one needs finished
		return Pressure.findOne({});
	}	
});

