// get APIkey from the apikey.js file  (note, this is excluded from GIT, get your own key licence and key from:https://uts.nlm.nih.gov//home.html) 


import { myApiKey } from '../../apikey.js'; // this should just give the variable "myApiKey", of which the API key is stored as a string.  
import { Results } from './results.js'

var thisApiKey = myApiKey();

//import './results.js'

var authroot = 'https://utslogin.nlm.nih.gov'; // Root URL of the auth api
var restroot = 'https://uts-ws.nlm.nih.gov/rest'; // root URL of the REST api -- https://documentation.uts.nlm.nih.gov/rest/home.html
// Query params: https://documentation.uts.nlm.nih.gov/rest/search/index.html#query-parameters
//  Stuff for server

var TGT = 'asdf' // invalid init value for TGT

//https://docs.meteor.com/api/http.html


	if (Meteor.isServer) {
		
		Meteor.methods({
	
		//First, test if there is a valid TGT		
			/*	
			testTGT: function() {
				if (TGT.length < 5){  // First make sure is not null variable
					console.log('tgt not > 5 chars... ');
					if (needsTested){   // check if we have already tested
						console.log('needsTested flag is true...')
						if(Meteor.call('ticketTest')){
							console.log('test successful, setting needsTested to false.');
							needsTested= false; // say we have already tested
							return true; 
						}	
					} else { console.log('needsTested is false. TGT is: '+TGT); return true;}
				}else { console.log('TGT is' +TGT.length+', assuming it is good');return true;} // if TGT length is > 1 we don't even test. for now. 
				if(Meteor.call('getTGT')){  // if either if statement fails try to get a new TGT.
					return true; // if getTGT is successful return true.
				}  
				else {return false; // if getTGT fails return false
				}
			},
		*/
			ticketTest: function(){
				this.unblock();
				console.log("Testing ticket...");
				try{
					this.call = HTTP.call("POST", 'http://utslogin.nlm.nih.gov/cas/serviceValidate', {params: { ticket: HTTP.call("POST", TGT, {params: {service: 'http://umlsks.nlm.nih.gov'}}), service: 'http://umlsks.nlm.nih.gov'}});
					console.log(this.call);
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
		
			getTGT: function (){
				this.unblock(); // make sure server doesn't get block from this call ??
				console.log('getting TGT...')
				console.log('Using ApiKey: '+thisApiKey); //print API key=
				try{
					this.call = HTTP.call("POST", authroot+'/cas/v1/api-key', {params: { apikey: thisApiKey }} );
					console.log('TGT get status: '+ this.call.statusCode);
					//console.log(this.call.headers);
					TGT = this.call.headers.location; // Store in TGT after parsing json
					console.log("newTGT: "+TGT); // Print the parsing
					return true;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
			
			//Get one-time ticket using TGT
			getTicket: function(){
				this.unblock; // no idea
				console.log('getting new single ticket')
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
			
			searchApi: function(searchText){
				this.unblock;
				try{
					HTTP.call(
						"GET", 
						restroot+'/search/current', 
						{params: {ticket: Meteor.call('getTicket'), 
						string: searchText}},
						function (err, res) {
							//Remove the only result
							Meteor.call('results.remove')

							//Put in a new result
							Meteor.call('results.insert', JSON.parse(res.content))
						});
				} catch(e) {
					console.log(e);
					return false;
				}
			}	

		
		});
		
		Meteor.call('getTGT');
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

