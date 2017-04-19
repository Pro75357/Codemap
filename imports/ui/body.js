import { Template } from 'meteor/templating'
import './body.html'
import '../api/auth.js'
import '../api/search.js'
import '../api/upload.js'
import '../api/export.js'
import { Results } from '../api/results.js'
import { Codes } from '../api/codes.js'
import { CodeSystems } from '../api/codeSystems.js'

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

Template.body.helpers({
    codesystems() {
        return CodeSystems.find({}).fetch()
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
    },

    cuis() {
        return Codes.find({ _id: this._id }, { fields: { searchCUIs: 1 } })
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

    codesystems () {
    	return CodeSystems.find({}).fetch()
    },

    resultcodes() {
        //var searchCUI = 'C0007876'
        //var searchCUI = document.getElementById(this._id+'resultSelect').value
       // console.log(searchCUI)
        var res = Results.find({ rowID: this._id, purpose: 'CodesSearch' }, {fields: { codeSet: 1, code: 1 } }).fetch()

       // console.dir(res)
        return  res
    }

})

Template.bigtable.events({
    'click .allCodeSearch': function (event, template) {
        // call umls fetch with words and normal matches
      // var searchTarget = document.getElementById('searchTarget').value
       Meteor.call('codesFetch', searchTarget)
        // send search target along to update selectors. 
    },

    'click .allDescSearch': function (event, template) {
        // call UMLS fetch with codes and exact matches
       // var searchTarget = document.getElementById('searchTarget').value
        Meteor.call('descFetch') 

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
        var searchCUI = document.getElementById(this._id+'resultSelect').value
        Meteor.call('saveOne', rowID, searchCUI)
        
    },

    'submit .searchBox': function (event, template) {
        event.preventDefault
        var rowID = this._id
        var searchText = document.getElementById(this._id + 'search').value
        //var searchTarget = document.getElementById('searchTarget').value
        document.getElementById(this._id + 'resultSelect').selectedIndex = 0 // set the selector back to first result so the next 'getconcepts' call returns the correct data. 
        Meteor.call('clearTempCodes', rowID)
        Meteor.call('searchAgain', rowID, searchText)

        //document.getElementById(this.ID+'search').selectedIndex = '0' // set the search selector back to first result. -- problem is, it does a full page refresh!
        //var selectID = document.getElementById(this._id + 'resultSelect').value
       // var searchTarget = document.getElementById('searchTarget').value
       // Meteor.call('getConceptCodes', rowID, selectID, searchTarget)
        return false // prevents page refresh
    },

    'change .resultSelector': function (event, template) {
        event.preventDefault
        var rowID = this._id
        var searchCUI = document.getElementById(this._id + 'resultSelect').value
       //var searchTarget = document.getElementById('searchTarget').value
        //console.log('changed')
        Meteor.call('clearTempCodes', rowID)
        Meteor.call('getConceptCodes', rowID, searchCUI)
    }
})
