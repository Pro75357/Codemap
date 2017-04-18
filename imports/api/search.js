//This file contains methods for searching using UMLS API. 

import './auth.js'
import { Codes } from './codes.js'
import { Results } from './results.js'
import {CodeSystems} from './codeSystems.js'
//const codeSystems = require('./config.json')

import { Mongo } from 'meteor/mongo'

export var Temp = new Mongo.Collection(null);

var restroot = 'https://uts-ws.nlm.nih.gov/rest'; // root URL of the REST api -- https://documentation.uts.nlm.nih.gov/rest/home.html
// Query params: https://documentation.uts.nlm.nih.gov/rest/search/index.html#query-parameters

if (Meteor.isServer) {
	
    Meteor.methods({

        //Second-level search - retruns 'atoms' for a Concept Unique Identifier (CUI)
        // CUI is the main code returned from searchApi method

        'searchCUI': function (searchCUI) {
            console.log("searching: "+searchCUI)
            try {
                var call = HTTP.call(
                    "GET",
                    restroot + '/content/current/CUI/'+searchCUI+'/atoms',
                    {
                        params: {
                            ticket: Meteor.call('getTicket'),
                          //  sabs: 'ICD10PCS,ICD9CM,SNOMEDCT,ICD10CM,RXNORM,LOINC,SOP'  //selected codeset
                        }
                    },
                )
                //console.dir(call.data.result)
                return call.data.result // non-synchronously returns result object
            } catch (e) {
                console.log(e); // will error if CUI is invalid or blank OR just if there is no result for that particular searchTarget (404)
                return false;
            }
        },

        //Search the root of the API to get the CUI codes for a concept.
        //Takes the  variables searchTarget and rowID from the fetch functions so the callback function can update the correct row. 
		'searchApi': function(searchText, searchType, searchTarget, rowID){ 
			try{
				HTTP.call(
						"GET", 
						restroot+'/search/current', 
						{params: {ticket: Meteor.call('getTicket'), 
									string: searchText,
									//sabs: '',  //This will limit results to a single source (pass it searchTarget), but doesn't give good results. Not recommended.
									searchType: searchType //default is 'words', also: 'exact' for codes
									}
						},	
                        function(error, res) { //This is the Async http call. This function gets called when the result returns. Nothing waits on this function so you have to call the reults writing function from here. 
                            if  ( error ) {
                                console.log(err)
                            } else {
                                var result = res.data.result.results
                                Results.insert({ rowID: rowID, createdAt: new Date(), result })  //write the results using the async function (vs returning a result to some other function which is not async)
                                var selectID =  result[0].ui //Just get first result in this case (to populate the code under the drop-down)
                                Meteor.call('getConceptCodes', rowID, selectID, searchTarget)  // this will get the actual target code (such as SNOMED code) for the selectID to fill populate under each search result.
                            }
                        }
				    )
					//console.dir(call.data.result.results)
				//return call.data.result.results // returns result object
			} catch(e) {
				console.log(e);
				return false;
			}
		},

        // This gets the actual codes for the selected searchTarget and puts it into the Codes collection where it will pull into the view.
        'getConceptCodes': function (rowID, selectID) {
            res = Meteor.call('searchCUI', selectID)
            //console.dir(res)
            // if no result just return no results instead of error on the next line
            if (typeof res[0] === 'undefined') {
                TC = 'NONE'
            } else {
               // console.dir(res)
                Temp.insert(res)
                CS = CodeSystems.find({}).fetch()
              //  console.log(typeof CS)
                for (x in CS){
                    console.dir(CS[x].codesystem)
                   // console.log(Temp.find({}).fetch())
                    tempcodes = Temp.find({rootSource: CS[x].codesystem}).fetch()
                console.log(tempcodes)
                    //TCurl = tempcodes[0].code // The first resulted code. Is a whole https url.
                  //  TCsplit = TCurl.split("/") // split the URL by / 
                  //  TC = TCsplit[(TCsplit.length - 1)] // - we only want the last bit
                  //  console.log(TC)
                }
            }
            // Update the table with the result
            CodeSystems.update(
                { _id: rowID },
                {
                    $set: {
                        Concept_Code: 'xx',
                    }
                }
            )
        },

                //Search that is called from the single search box
        'searchAgain': function (rowID, searchText, searchTarget) {
            //Results.remove({rowID: [rowID]}) // removes the original results
            Meteor.call('searchApi', searchText, 'words', searchTarget, rowID)
            console.dir(codeSystems)
        },

		// This is the method that searches the UMLS database against every imported "Source_Desc". Is the MAIN batch function. 
		'descFetch': function(searchTarget){
			Results.rawCollection().drop() // clear any previous results. 
			var code = Codes.find({}, {sort: { Source_Code: 1 }}).fetch() // gets all the codes from the collection, in order of the table (so they update in the right order)
			//console.log('Fetch Search Target: '+searchTarget)
			for (x in code) { // for each row in the codes table... 
				console.log('Searching: '+code[x].Source_Desc) 
                rowID = code[x]._id // so we can pass this row's ID
                Meteor.call('searchApi', code[x].Source_Desc, 'words', searchTarget, rowID)  // Pass all the stuff to 'searchApi'- which does an async call and inserts results. 
			}
        },

        // this does the exact same thing as 'descFetch' but uses the CODES field and an 'exact' match. 
        'codesFetch': function (searchTarget) {
            Results.rawCollection().drop() // clear previous results. 
            var code = Codes.find({}, { sort: { Source_Code: 1 } }).fetch()
            for (x in code) {
                console.log('Searching: ' + code[x].Source_Code)
                rowID = code[x]._id
                Meteor.call('searchApi', code[x].Source_Code, 'exact', searchTarget, rowID) 
            }
        },
	})
}