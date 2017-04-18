import { Mongo } from 'meteor/mongo'

export const CodeSystems = new Mongo.Collection('codesystems');

var codes = ['ICD10PCS', 'ICD9CM','SNOMEDCT_US','ICD10CM','RXNORM','LNC','SOP']

if (Meteor.isClient) {
	Meteor.subscribe('codesystems')
}

if (Meteor.isServer) {
	Meteor.publish('codesystems', function codesystemsPublication() {
		return CodeSystems.find()
	})

	if (CodeSystems.find({}).count() <1){
		for (x in codes) {
		CodeSystems.insert({'codesystem': codes[x]})
		}
	}
}