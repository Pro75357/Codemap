import './auth.js'
import { Codes } from './codes.js'
import { Results } from './results.js'

var restroot = 'https://uts-ws.nlm.nih.gov/rest'; // root URL of the REST api -- https://documentation.uts.nlm.nih.gov/rest/home.html
// Query params: https://documentation.uts.nlm.nih.gov/rest/search/index.html#query-parameters
//var col = Object.keys(Codes.find({}).fetch()[0])

if (Meteor.isServer) {
	
    Meteor.methods({

        'searchAgain': function (rowID, searchText, searchTarget) {
            var result = Meteor.call('searchApi', searchText, 'words', '')
            //Results.remove({rowID: [rowID]}) // removes the original results
            Results.insert({ rowID: rowID, createdAt: new Date, result }) // places new results
            selectID = result[0].ui
            Meteor.call('getConceptCodes', rowID, selectID, searchTarget)
        },

        'searchCUI': function (searchCUI, searchTarget) {
            console.log("searching: "+searchCUI)
            try {
                var call = HTTP.call(
                    "GET",
                    restroot + '/content/current/CUI/'+searchCUI+'/atoms',
                    {
                        params: {
                            ticket: Meteor.call('getTicket'),
                            sabs: searchTarget,  //selected codeset
                        }
                    },
                )
                //console.dir(call.data.result)
                return call.data.result // returns result object
            } catch (e) {
                console.log(e);
                return false;
            }
        },


		'searchApi': function(searchText, searchType, searchTarget){ 
			try{
				var call = 	HTTP.call(
						"GET", 
						restroot+'/search/current', 
						{params: {ticket: Meteor.call('getTicket'), 
									string: searchText,
									sabs: searchTarget,  //SNOMED_CT codes only
									searchType: searchType //default is 'words', also: 'exact' for codes
									}
						},							
				    )
					//console.dir(call.data.result.results)
				return call.data.result.results // returns result object
			} catch(e) {
				console.log(e);
				return false;
			}
		},
		// This is the method that searches the UMLS database against every imported "Source_Desc"
		'descFetch': function(searchTarget){
			//this.unblock
			Results.rawCollection().drop() // clear previous results. 
			var code = Codes.find({}, {sort: { Source_Code: 1 }}).fetch() // gets all the codes from the collection, in order of the table (so they update in the right order)
			//console.log('Fetch Search Target: '+searchTarget)
			for (x in code) {
				console.log('Searching: '+code[x].Source_Desc)
				var result = Meteor.call('searchApi', code[x].Source_Desc, 'words', '') // result is an array of all the results. 

				// Now, save the results (not just first one) in a different collection, Results, along with the corresponding _id from the Codes database
                Results.insert({ rowID: code[x]._id, createdAt: new Date(), result })  // UNTESTED... but does not error. :)

                rowID = code[x]._id
                //console.dir(result)
                selectID = result[0].ui
                //console.log(selectID)
                Meteor.call('getConceptCodes', rowID, selectID, searchTarget)

			}
        },
        'codesFetch': function (searchTarget) {
            //this.unblock
            Results.rawCollection().drop() // clear previous results. 
            var code = Codes.find({}, { sort: { Source_Code: 1 } }).fetch() // gets all the codes from the collection, in order of the table (so they update in the right order)
            //console.log('Fetch Search Target: '+searchTarget)
            for (x in code) {
                console.log('Searching: ' + code[x].Source_Code)
                var result = Meteor.call('searchApi', code[x].Source_Code, 'exact') // result is an array of all the results. 

                // Now, save the results (not just first one) in a different collection, Results, along with the corresponding _id from the Codes database
                Results.insert({ rowID: code[x]._id, createdAt: new Date(), result })  // UNTESTED... but does not error. :)

                rowID = code[x]._id
                selectID = result[0].ui
                console.log(selectID)
                Meteor.call('getConceptCodes', rowID, selectID, searchTarget)
            }
        },
	})
}