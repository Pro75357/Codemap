import { Mongo } from 'meteor/mongo'

export const CodeSystems = new Mongo.Collection('codesystems');

 var codes = [
 	{ 'codesystem': 'CPT',          'TTY': 'ETCLIN',    'OID': '2.16.840.1.113883.6.12'},
    { 'codesystem': 'ICD10CM',      'TTY': 'PT',        'OID': '2.16.840.1.113883.6.90' },
    { 'codesystem': 'ICD10PCS',     'TTY': 'PT',        'OID': '2.16.840.1.113883.6.4' },
    { 'codesystem': 'ICD9CM',       'TTY': 'PT',        'OID': '2.16.840.1.113883.6.103' },  // using ICD9CM diagnosis version as OID code, 
    { 'codesystem': 'SNOMEDCT_US',  'TTY': 'PT',        'OID': '2.16.840.1.113883.6.96' },
    { 'codesystem': 'RXNORM',       'TTY': '',          'OID': '2.16.840.1.113883.6.88' },
    { 'codesystem': 'LNC',          'TTY': '',          'OID': '2.16.840.1.113883.6.1' }, // Term types are : LA, (https://www.nlm.nih.gov/research/umls/sourcereleasedocs/current/LNC/stats.html)
    { 'codesystem': 'HCPCS',        'TTY': 'PT',        'OID': '2.16.840.1.113883.6.14' },
    { 'codesystem': 'SOP',          'TTY': 'PT', 'OID': '2.16.840.1.113883.3.221.5' }  // There are only 145 codes total. Probably not very useful here. 
 ]


// all avalilable "sabs" at: https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/active_release.html

// Available 'code systems' with OID code at : https://www.nlm.nih.gov/vsac/support/usingvsac/code-systems.html

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