import { Template } from 'meteor/templating'
import './body.html'
import '../api/auth.js'
import '../api/search.js'
import '../api/upload.js'
import '../api/export.js'
import '../api/tableEdit.js'  // perhaps not necessary as all server?
import { Results } from '../api/results.js'
import { Codes } from '../api/codes.js'
import { CodeSystems } from '../api/codeSystems.js'

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
/*
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
*/
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
    },

	results(){
        var res = Results.find({ rowID: this._id }, { sort: { createdAt: -1 } }).fetch()[0] //finds most recent result for the row.
		//console.dir(res)
		//console.dir(res)
		if (typeof res === 'undefined'){
			return []
		}
		return res.result
    },

    SelectedID() {
        return document.getElementById('searchTarget').value
    },

    codesystems () {
    	return CodeSystems.find({ rowID: this._id }).fetch()
    }

})

Template.bigtable.events({
    'click .allCodeSearch': function (event, template) {
        // call umls fetch with words and normal matches
       var searchTarget = document.getElementById('searchTarget').value
       Meteor.call('codesFetch', searchTarget)
        // send search target along to update selectors. 
    },

    'click .allDescSearch': function (event, template) {
        // call UMLS fetch with codes and exact matches
        var searchTarget = document.getElementById('searchTarget').value
        Meteor.call('descFetch', searchTarget) 

    },

	'click .coderow': function(event, template){
		event.preventDefault
        var rowID = this._id
        //var selectID = document.getElementById('').value
       // var searchTarget = document.getElementById('searchTarget').value
		//console.log('row id: '+rowID)
		//console.log(Codes.find({_id: rowID}).fetch())
       // Meteor.call('saveOne',rowID, selectID, searchTarget)
        //console.dir(res)
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
		//console.log('clicked saveButton')
        var rowID = this._id
        var selectID = document.getElementById(this._id+'resultSelect').value
        var searchTarget = document.getElementById('searchTarget').value
       // console.log(selectID)
        Meteor.call('saveOne', rowID, selectID, searchTarget)
        
    },

    'submit .searchBox': function (event, template) {
        event.preventDefault
        var rowID = this._id
        var searchText = document.getElementById(this._id + 'search').value

        var searchTarget = document.getElementById('searchTarget').value

        Meteor.call('searchAgain', rowID, searchText, searchTarget)
        //document.getElementById(this.ID+'search').selectedIndex = '0' // set the search selector back to first result. -- problem is, it does a full page refresh!
        //var selectID = document.getElementById(this._id + 'resultSelect').value
       // var searchTarget = document.getElementById('searchTarget').value
       // Meteor.call('getConceptCodes', rowID, selectID, searchTarget)
        return false // prevents page refresh
    },

    'change .resultSelector': function (event, template) {
        event.preventDefault
        var rowID = this._id
        var selectID = document.getElementById(this._id + 'resultSelect').value
       //var searchTarget = document.getElementById('searchTarget').value
        //console.log('changed')
        Meteor.call('getConceptCodes', rowID, selectID)
    }
})
