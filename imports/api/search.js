import './auth.js'
import { Codes } from './codes.js'

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
			
			'UMLSFetch': function(searchTarget){
				this.unblock
				var code = Codes.find({}, {sort: { Source_Code: 1 }}).fetch()
				console.log('Fetch Search Target: '+searchTarget)
				for (x in code) {
					console.log('Searching: '+code[x].Source_Desc)
					var result = Meteor.call('searchApi', code[x].Source_Desc, searchTarget)
					console.log('result: '+result[0].name)
					//console.log(result)
					//console.log('CUI in updatefx: '+result.ui)
					//console.log(code[x]._id)
					Codes.update({
						_id: code[x]._id
						},{
							$set: {Target_Code: result[0].ui } //returns CUI of first result.
					})
					Codes.update({
						_id: code[x]._id
					},{
						$set: {Target_Desc: result[0].name} // returns name of first result
					})
				}
			}
	})
}