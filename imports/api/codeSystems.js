import { Mongo } from 'meteor/mongo'

export const CodeSystems = new Mongo.Collection('codesystems');

 var codes = [
 	{'codesystem': 'CPT', 'OID': '2.16.840.1.113883.6.12'},
 	{'codesystem': 'ICD10CM', 'OID': '2.16.840.1.113883.6.90'},
 	{'codesystem': 'SNOMEDCT_US', 'OID': '2.16.840.1.113883.6.96'}
 ]

 //'ICD10CM', 'ICD9CM', 'SNOMEDCT_US', 'RXNORM', 'LNC', 'SOP', 'CPT', 'HCPCS'

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
    //console.log('Codesystems:')
    for (x in codes) {
    	//console.log(codes[x])
    	CodeSystems.insert(codes[x])
    }
	//	CodeSystems.insert({'UMLS Name': 'CPT', 'OID': '2.16.840.1.113883.6.12'})
}