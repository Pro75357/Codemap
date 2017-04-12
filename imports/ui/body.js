import { Template } from 'meteor/templating'
import './body.html'
import '../api/auth.js'
import '../api/search.js'
import '../api/upload.js'
import '../api/export.js'
import '../api/tableEdit.js'  // perhaps not necessary as all server?
import { Results } from '../api/results.js'
import { Codes } from '../api/codes.js'

//Listener for form .PressureInput
Template.searchBox.events({
  'submit form'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    
    //Just see if hitting submit does anything
    console.log('search submitted');
    const target = event.target
    const searchText = target.text.value
    // call get ticket
    const results= Meteor.call('searchApi', searchText); //Searches
    
    console.log(results);
    //Meteor.call('results.insert', results); //stores in mongo for display later
  },
});

Template.buttons.events({
	'submit .UMLS-button'(event) {
	    event.preventDefault()
	    const target = event.target
	    const searchTarget = target.UMLSTarget.value
	    console.log('Target: '+searchTarget)
	   // console.log("mega pressed")
		//console.log(Codes.find({},{limit: 10} ).fetch())
	    //console.log(Codes.find({},{limit: 10, fields: {'Clairty_HX_Description':1}} ).fetch())
	    Meteor.call('UMLSFetch', searchTarget)
	},
	'submit .ResetDB-button' (event) {
		event.preventDefault()
		Meteor.call('resetDB')
		console.log('Database Full Reset')
	},

	'submit .magic-button' (event) {
		event.preventDefault();
		console.log('Magic!');  // this is just for testing method calls
	}
})

Template.body.helpers({
		resultsCount() {
		return Results.find().count()
	},
	resultsPresent() {
		if (Results.find().count() > 0){
			return true;
		} else {
			return false;
		};
	},
})

Template.resultsdisplay.helpers({
	results() {
		//return Meteor.call('results.find');
		return Results.find({})
	}
})

Template.bigtable.helpers({	
	//tableColumn1(){
	//	return codesColumns[1] // return name of tableColumn1
	//},
	//tableColumn2(){
	//	return codesColumns[2] //console.log(Codes.)
	//},
	codes(){
		//console.log(Codes.find({}).fetch())
		return Codes.find({},
		 {sort: { Source_Code: 1 }}
		 )
	}
})

Template.bigtable.events({
	'click .coderow': function(event, template){
		event.preventDefault
		var rowID = this._id
		console.log('row id: '+rowID)
		console.log(Codes.find({_id: rowID}).fetch())
	},

	'click .saveallbutton': function(event, template){
		event.preventDefault
		console.log('clicked saveallbutton')
		Meteor.call('saveAll')
	},

	'click .removeButton': function(event, template){
		event.preventDefault
		console.log('clicked removeButton')
		var rowID = this._id
		Meteor.call('removeOne', rowID)
	},

	'click .saveButton': function(event, template){
		event.preventDefault
		console.log('clicked saveButton')
		var rowID = this._id
		Meteor.call('saveOne', rowID)
	},
})