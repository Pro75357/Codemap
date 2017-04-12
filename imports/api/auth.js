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


if (Meteor.isServer) {
		
	Meteor.methods({
	
		// test if there is a valid TGT		 // this is not worth the effort. Just get a new TGT each session. 
        /*
			'testTGT': function() {
                if (TGTc.find({}).count() < 1) {  // First make sure TGT collection is not empty
                    console.log('No local TGT found... ');
                    Meteor.call('getTGT') //just get TGT and move on ( no need to otherwise test new TGT)
                } else {
                    console.log('found old TGT: ' + TGT)
                    Meteor.call('ticketTest') // if key seems legit, just test it. 
                }
			},
		
			'ticketTest': function(){
				this.unblock();
				console.log("Testing TGT...");
                try {
                    this.call = HTTP.call(
                        "POST",
                        'http://utslogin.nlm.nih.gov/cas/serviceValidate',
                        {
                            params:
                            {
                                ticket:
                                Meteor.call('getTicket')
                                //HTTP.call("POST", TGT, { params: { service: 'http://umlsks.nlm.nih.gov' } })
                                , service: 'http://umlsks.nlm.nih.gov'
                            }
                        });
                    //console.log(this.call);
					if (this.call.statuscode < 400){
						console.log("ticket test response code: "+this.call.statuscode)
						return true;
					}
					else {
						console.log("ticket test failed");
						return false;
						}
				} catch (e) {
					console.log(e);
					return false;
					}
				},
		*/
			'getTGT': function (){
				this.unblock(); // make sure server doesn't get block from this call ??
				//console.log('getting TGT...')
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
				this.unblock; // no idea
				//console.log('getting new single ticket')
				//console.log('Using TGT: '+TGT);
				try{
					this.call = HTTP.call("POST", TGT, {params: {service: 'http://umlsks.nlm.nih.gov'}});
					var ticket = this.call.content;
					//console.log('New single-use ticket: '+ticket);
					return ticket;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
		
        })

        Meteor.call('getTGT'); // Get TGT for the session. Good for like 8 hours. On production will need better solution. 
		//Meteor.call('ticketTest');
		console.log('Ready to Search!')
}
	


	
	//function getTicket() {
	//	try HTTP.call(POST, root+'', {params: {}})
//	}
//Check if TGT valid
// -Test one-time ticket
// -- if yes, return true
// -- if no, do GET TGT

// Test one-time ticket
// -- just returns T/F