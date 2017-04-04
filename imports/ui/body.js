import { Template } from 'meteor/templating'
import './body.html'
import '../api/auth.js'

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
    Meteor.call('searchApi', searchText);
  },
});

