// Codes is the main collection that makes the table.
// Results is what gets displayed in the drop-down boxes.

import { Mongo } from 'meteor/mongo'
import { Results } from './results.js'
import { Saved } from './saved.js'
export const Codes = new Mongo.Collection('codes');

if (Meteor.isClient) {
	Meteor.subscribe('codes') // Makes the collection available to the client (Templates and stuff)
};

if (Meteor.isServer) {
	Meteor.publish('codes', function codesPublication() {
		return Codes.find({}) // how we publish codes to the client. For now, just return everything. 
	})

	Meteor.methods({
		
		'resetDB': function() { // drop everything
            Codes.rawCollection().drop()
            Results.rawCollection().drop()
            Saved.rawCollection().drop()

            Codes.insert({ externalCode: 'None'}) // Add in a simple structure and some info as a placeholder
            Codes.update({}, { $set: { externalCodeDescription: 'No data: Please upload CSV'}})
			//codesColumns = [] // clear column names variable
			//for (var key in Codes.findOne({})) { // Loads new column names in the array
				//console.log('key: '+ key)
			//	codesColumns.push(key)
		},	

		// just clears the collections, does not add anything.
		'clearDB': function() { 
			Codes.rawCollection().drop()
            Results.rawCollection().drop()
            Saved.rawCollection().drop()
		}
			//Codes.update({},{$set: {CUI: ''}}, {multi: true})
			//Codes.update({},{$set: {name: ''}}, {multi: true})
	})
}