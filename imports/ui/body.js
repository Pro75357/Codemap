import { Template } from 'meteor/templating'
import './body.html'
import '../api/auth.js'
import '../api/results.js'

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
	results() {
		return Meteor.call('results.find');
	},
	resultsCount() {
		console.log(Meteor.call('results.count'));
		return Meteor.call('results.count');
	},
	resultsPresent() {
		if (Meteor.call('results.count') >0){
			return true;
		} else {
			return false;
		};
	}
});