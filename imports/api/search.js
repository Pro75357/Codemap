//This file contains methods for searching using UMLS API. 

import './auth.js'
import { Codes } from './codes.js'
import { Results } from './results.js'
import { CodeSystems } from './codeSystems.js'
import { Saved } from './saved.js'

//const codeSystems = require('./config.json')

//import { Mongo } from 'meteor/mongo'

//export var Temp = new Mongo.Collection(null);

var restroot = 'https://uts-ws.nlm.nih.gov/rest'; // root URL of the REST api -- https://documentation.uts.nlm.nih.gov/rest/home.html
// Query params: https://documentation.uts.nlm.nih.gov/rest/search/index.html#query-parameters

if (Meteor.isServer) {
	
    Meteor.methods({


        //Search the root of the API to get the CUI codes for a concept.
        //Takes the  variables searchTarget and rowID from the fetch functions so the callback function can update the correct row. 
        'searchApi': function (searchText, searchType, rowID) {
            try {
                HTTP.call(
                    "GET",
                    restroot + '/search/current',
                    {
                        params: {
                            ticket: Meteor.call('getTicket'),
                            string: searchText,
                            //sabs: '',  //This will limit results to a single source (pass it searchTarget), but doesn't give good results. Not recommended.
                            searchType: searchType //default is 'words', also: 'exact' for codes
                        }
                    },
                    function (error, res) { //This is the Async http call. This function gets called when the result returns. Nothing waits on this function so you have to call the reults writing function from here. 
                        if (error) {
                            console.log('searchApi error: ' + error.statuscode)
                        } else {
                            var result = res.data.result.results
                            Results.insert({ rowID: rowID, createdAt: new Date(), result })  //write the results using the async function (vs returning a result to some other function which is not async)
                            var searchCUI = result[0].ui //Just get first result in this case (to populate the code under the drop-down)
                            Meteor.call('getConceptCodes', rowID, searchCUI)  // this will get the actual target code (such as SNOMED code) for the selectID to fill populate under each search result.
                        }
                    }
                )
                //console.dir(call.data.result.results)
                //return call.data.result.results // returns result object
            } catch (e) {
                console.log(e);
                return false;
            }
        },

        //Second-level search - retruns 'atoms' for a Concept Unique Identifier (CUI)
        // CUI is the main code returned from searchApi method

        'searchCUI': function (searchCUI, searchTarget, rowID) {
            // console.log("searching: " + searchCUI)
            try {
                HTTP.call(
                    "GET",
                    restroot + '/content/current/CUI/' + searchCUI + '/atoms',
                    {
                        params: {
                            ticket: Meteor.call('getTicket'),
                            sabs: searchTarget
                        }
                    }, function (err, res) {
                        if (err) {
                            //console.log('searchCUI error: ')
                            //console.log(err.content)
                        } else {
                            //console.log(searchTarget)
                            //console.log(res.data.result[0].code)
                            // store first result somewhere with corresponsing target code. 
                            codeUrl = res.data.result[0].code // The first resulted code. Is a whole https url.
                            codeSplit = codeUrl.split("/") // split the URL by / 
                            code = codeSplit[(codeSplit.length - 1)] // - we only want the last bit
                          //  console.log('found: ' + searchTarget + ": " + code)
                            Results.insert({ rowID: rowID, purpose: 'CodesSearch', codeSet: searchTarget, code: code })
                        }
                    }
                )
                //console.dir(call.data.result)
                //return call.data.result // non-synchronously returns result object
            } catch (e) {
                console.log(e); // will error if CUI is invalid or blank OR just if there is no result for that particular searchTarget (404)
                return false;
            }
        },

        // This gets the actual codes for the selected searchTarget and puts it into the Codes collection where it will pull into the view.
        'getConceptCodes': function (rowID, searchCUI) {
            CS = CodeSystems.find({}).fetch()
            for (x in CS) {
                searchTarget = CS[x].codesystem
                Meteor.call('searchCUI', searchCUI, searchTarget, rowID)
            }

            //console.dir(res)
            // if no result just return no results instead of error on the next line
            /*
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
        )*/
        },

        //Search that is called from the single search box
        'searchAgain': function (rowID, searchText) {
            //Results.remove({rowID: [rowID]}) // removes the original results
            Meteor.call('searchApi', searchText, 'words', rowID)
           // console.dir(codeSystems)
        },

        // This is the method that searches the UMLS database against every imported "Source_Desc". Is the MAIN batch function. 
        'descFetch': function () {
            Results.rawCollection().drop() // clear any previous results. 
            var code = Codes.find({}, { sort: { Source_Code: 1 } }).fetch() // gets all the codes from the collection, in order of the table (so they update in the right order)
            //console.log('Fetch Search Target: '+searchTarget)
            for (x in code) { // for each row in the codes table... 
                console.log('Searching: ' + code[x].Source_Desc)
                rowID = code[x]._id // so we can pass this row's ID
                Meteor.call('searchApi', code[x].Source_Desc, 'words', rowID)  // Pass all the stuff to 'searchApi'- which does an async call and inserts results. 
            }
        },

        // this does the exact same thing as 'descFetch' but uses the CODES field and an 'exact' match. 
        'codesFetch': function () {
            Results.rawCollection().drop() // clear previous results. 
            var code = Codes.find({}, { sort: { Source_Code: 1 } }).fetch()
            for (x in code) {
                console.log('Searching: ' + code[x].Source_Code)
                rowID = code[x]._id
                Meteor.call('searchApi', code[x].Source_Code, 'exact', rowID)
            }
        },

        'clearTempCodes': function (rowID) {
            Results.remove({ rowID: rowID, purpose: 'CodesSearch' }) // clear any previous results on this row before calling new results
        },

        // This saves a single selected (selectID) result to the Codes table in the Target fields.
        'saveOne': function (rowID, searchCUI) {
            // Pull the codes from results
            var codes = Results.find({ rowID: rowID, purpose: 'CodesSearch' }, { fields: { codeSet: 1, code: 1, _id: 0 } }).fetch()
            // Cui is already given through argument!
            // get Source_Code, Source_Desc from Codes
            Source = Codes.findOne({_id: rowID}, {fields: {Source_Code: 1, Source_Desc: 1}})
            // for each code, everything (Source Code, Source Desc, CUI, Code) to Saved (this is for papa parse and easy exporting)
            for (x in codes) {
               // console.log(codes[x].codeSet+codes[x].code)
                Saved.insert({ rowID: rowID, Source_Code: Source.Source_Code, Source_Desc: Source.Source_Desc, searchCUI: searchCUI, codeSet: codes[x].codeSet, code: codes[x].code })
            }
            
            // push  CUI to "Saved CUIs" array in codes to update main table         
            Codes.update({ _id: rowID }, { $push: { searchCUIs: searchCUI } })
        },
                // This removes a result from the target fields based on the row. 
		'removeOne': function (rowID) {
            console.log('results deleted')
            Saved.remove({ rowID: rowID }) // removes any saved codes from the row
            Codes.update({ _id: rowID }, { $set: { searchCUIs: [] } }) // removes searchCUIs from the view
        },


	})
}