import { Mongo } from 'meteor/mongo'

export const CodeSystems = new Mongo.Collection('codesystems');

var codes = ['ICD10PCS', 'ICD10CM', 'ICD9CM', 'SNOMEDCT_US', 'RXNORM', 'LNC', 'SOP', 'CPT', 'HCPCS']

// all avalilable "sabs" at: https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/active_release.html

if (Meteor.isClient) {
	Meteor.subscribe('codesystems')
}

if (Meteor.isServer) {
	Meteor.publish('codesystems', function codesystemsPublication() {
		return CodeSystems.find()
	})
    // just always run this at startup to ensure above codesystem is correct:
    CodeSystems.rawCollection().drop()
    console.log('Codesystems:')
	for (x in codes) {
        CodeSystems.insert({ 'codesystem': codes[x] })
        console.log(codes[x])
    }
    
    
	
}
