import './auth.js'
import { Codes } from './codes.js'
import { Results } from './results.js'

var restroot = 'https://uts-ws.nlm.nih.gov/rest'; // root URL of the REST api -- https://documentation.uts.nlm.nih.gov/rest/home.html
// Query params: https://documentation.uts.nlm.nih.gov/rest/search/index.html#query-parameters
//var col = Object.keys(Codes.find({}).fetch()[0])

if (Meteor.isServer) {
	
	Meteor.methods({
	
		'searchApi': function(searchText, searchTarget){
			this.unblock;
			try{
				var call = 	HTTP.call(
						"GET", 
						restroot+'/search/current', 
						{params: {ticket: Meteor.call('getTicket'), 
									string: searchText,
									sabs: searchTarget,  //SNOMED_CT codes only
									searchType: 'words' //default is 'words'
									}
						},							
						//function (err, res) {
							//Remove the only result
							//Meteor.call('results.remove')

							//Put in a new result
							//console.log('result objects: '+res.data.result.results[0])
							//console.log('CUI: '+res.data.result.results[0].ui)
							//return JSON.parse(res.data.result.results)  //Returns first result object
							//}
						)
					//console.dir(call.data.result.results)
					return call.data.result.results // returns result object
			} catch(e) {
				console.log(e);
				return false;
			}
		},
		// This is the method that searches the UMLS database against every imported "Source_Desc"
		'UMLSFetch': function(searchTarget){
			this.unblock
			Results.rawCollection().drop() // clear previous results. 
			var code = Codes.find({}, {sort: { Source_Code: 1 }}).fetch() // gets all the codes from the collection, in order of the table (so they update in the right order)
			//console.log('Fetch Search Target: '+searchTarget)
			for (x in code) {
				console.log('Searching: '+code[x].Source_Desc)
				var result = Meteor.call('searchApi', code[x].Source_Desc, searchTarget) // result is an array of all the results. 
				console.log('result: '+result[0].name) // the first result is result[0], it's elements depend on which API call is used.
				//console.log(result)
				//console.log('CUI in updatefx: '+result.ui)
				//console.log(code[x]._id)

				// First, insert the first result in the Codes table (which will update the "bigTable" displayed on screen)
				Codes.update({  
					_id: code[x]._id // finds the document that matches the ID 
					},{
						$set: {Result_Code: result[0].ui } //adds the CUI of first result in the Target_Code field
				})
				Codes.update({
					_id: code[x]._id // same for the result name
				},{
					$set: {Result_Desc: result[0].name} //adds the name to the "Target_Desc" field
				})

				//Add the corresponding Codes _id to the result array
				result.push(code[x]._id)

				// Now, save the results (not just first one) in a different collection, Results, along with the corresponding _id from the Codes database
				Results.insert(result)  // UNTESTED... but does not error. :)

			}
		}
			
	})
}