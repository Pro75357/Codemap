import { Mongo } from 'meteor/mongo'

export const Codes = new Mongo.Collection('codes');

if (Meteor.isClient) {
	Meteor.subscribe('codes')
};

if (Meteor.isServer) {
	Meteor.publish('codes', function codesPublication() {
		return Codes.find({})
	})

	Meteor.methods({
		resetDB: function() {
		Codes.rawCollection().drop()
		Codes.insert({Source_Code: null})
		Codes.update({}, {$set: {Source_Desc: 'No data: Please upload CSV'}})
		codesColumns = [] // clear column names variable
		for (var key in Codes.findOne({})) { // Loads new column names in the array
			//console.log('key: '+ key)
			codesColumns.push(key)
		}
	},

		clearDB: function() {
			Codes.rawCollection().drop()
		}
			//Codes.update({},{$set: {CUI: ''}}, {multi: true})
			//Codes.update({},{$set: {name: ''}}, {multi: true})
	})
}