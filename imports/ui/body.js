import { Template } from 'meteor/templating'
import './body.html'
import '../api/auth.js'
import { Results } from '../api/results.js'
import { Codes } from '../api/codes.js'

//Listener for form .PressureInput
Template.searchBox.events({
  'submit form'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    
    //Just see if hitting submit does anything
    console.log('search submitted');
    const target = event.target;
    const searchText = target.text.value;
    // call get ticket
    const results= Meteor.call('searchApi', searchText); //Searches
    
    console.log(results);
    //Meteor.call('results.insert', results); //stores in mongo for display later
  },
});

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
	codes(){
		console.log(Codes.find({}).fetch())
		return Codes.find({})
	}
})