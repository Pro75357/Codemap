// This will use an imported API key from UMLS UTS 
// and manage authentication for the API

// UMLS query params: https://documentation.uts.nlm.nih.gov/rest/search/index.html#query-parameters
// Meteor http calls: https://docs.meteor.com/api/http.html

// get APIkey from the apikey.js file  (note, this is excluded from GIT, get your own key licence and key from:https://uts.nlm.nih.gov//home.html)
import { myApiKey } from '../../apikey.js'; // this should just give the variable "myApiKey", of which the API key is stored as a string.  
var thisApiKey = myApiKey()

//Root URLs for easier coding
var authroot = 'https://utslogin.nlm.nih.gov'; // Root URL of the auth api

 // init variable for TGT
var TGT = 'init'
if (thisApiKey == "API-KEY-GOES-HERE") {
	Meteor.call('noApiKey')
}


if (Meteor.isClient) {
	Meteor.methods({
		'noApiKey': function(){
			Bert.alert('NO API KEY FOUND','danger', 'growl-top-right')
		}
	})
}


if (Meteor.isServer) {
		
	Meteor.methods({
			// Gets the initial Ticket Granting Ticket using the API key
			'getTGT': function (){
				console.log('TGT apiKey: '+thisApiKey); //print API key=
				try{
					this.call = HTTP.call("POST", authroot+'/cas/v1/api-key', {params: { apikey: thisApiKey }} );
					console.log('TGT get status: '+ this.call.statusCode);
					//console.log(this.call.headers);
					TGT = this.call.headers.location; // Store in TGT after parsing json
                    console.log("newTGT: " + TGT); // Print the parsing  
					return true;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
			
			//Get one-time ticket using TGT
			'getTicket': function(){
				//console.log('getting new single ticket')
				//console.log('Using TGT: '+TGT);
				try{
					this.call = HTTP.call("POST", TGT, {params: {service: 'http://umlsks.nlm.nih.gov'}});
					var ticket = this.call.content;
					console.log('New single-use ticket: '+ticket);
					return ticket;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
		
        })

		// These functions will just run on startup (on the server). 

        Meteor.call('getTGT'); // Get TGT for the session. Good for like 8 hours. On production will need better solution. 
		//Meteor.call('ticketTest');
		console.log('Ready to Search!')
}