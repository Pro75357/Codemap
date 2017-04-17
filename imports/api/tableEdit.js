import { Codes } from './codes.js'

if (Meteor.isServer){
    Meteor.methods({

		'saveAll': function(){
		console.log("All results saved to targets")
		// Todo: Function should put all Results in targets. and delete results?
		var code = Codes.find({}, {sort: { Source_Code: 1 }}).fetch() // gets all the codes from the collection, in order of the table (so they update in the right order)
			for (x in code) {  // iterate over the whole table
				if (Codes.findOne({_id: code[x]._id}).Result_Code == ''){ // Don't save the blanks
				console.log('not saving a blank')
				} else {
					Codes.update(
						{_id: code[x]._id}, // the document to update
						{$set: { 
							Target_Code: code[x].Result_Code, // updates the Target code with current Result_code
							Target_Desc: code[x].Result_Desc, // updates the Target Description with current Result desc
							Result_Code: '', // clears the displayed result_code
							Result_Desc: '',  // clears the displayed result_desc
							}
						}
					)
				}
			}		
        },
        'getConceptCodes': function (rowID, selectID, searchTarget) {
            res = Meteor.call('searchCUI', selectID, searchTarget)
            //console.dir(res)
            // if no result just return no results instead of error on the next line
            if (typeof res[0] === 'undefined') {
                TC = 'NONE'
            } else {
                TCurl = res[0].code // The first resulted code. Is a whole https url.
                TCsplit = TCurl.split("/") // split the URL by / 
                TC = TCsplit[(TCsplit.length - 1)] // - we only want the last bit
            }
            // Update the table with the result
            Codes.update(
                { _id: rowID },
                {
                    $set: {
                        Concept_Code: TC,
                    }
                }
            )
        },

        'saveOne': function (rowID, selectID, searchTarget) {
            res = Meteor.call('searchCUI', selectID, searchTarget)
            console.dir(res)
            // if no result just return no results instead of error on the next line
            if (typeof res[0] === 'undefined') {
                TC = 'NONE'
                TD = 'No Result'
            } else {
                TCurl = res[0].code // The first resulted code. Is a whole https url.
                TCsplit = TCurl.split("/") // split the URL by / 
                //console.log('Split: '+TCsplit) //- works
                //    console.log('TCsplit Lenght: ' + TCsplit.length)
                TC = TCsplit[(TCsplit.length - 1)] // - we only want the last bit

                TD = res[0].name // Gets name of first object
            }
             // Update the table with the result
                Codes.update(
                    { _id: rowID },
                    {
                        $set: {
                            Target_Code: TC,
                            Target_Desc: TD
                        }
                    }

                )
        },
        /*
        'findCodes': function (rowID, selectID, searchTarget) {
            searchCUI = Codes.findOne({ _id: rowID }, function (result) { return result.ui === selectID })
            res = Meteor.call('searchCUI', searchCUI, searchTarget)
            console.dir(res)
        },
        */
		'removeOne': function(rowID){
			console.log('result deleted')
			//Todo: make function that deletes the individually clicked result.
			Codes.update({_id: rowID},
			{
				$set: {
					Target_Code: '',
					Target_Desc: ''
				}
			})
		},

		'editOne': function(rowID) {
			console.log('need to edit this one')
			// Todo: function that allows editing the current result. 
			// Will be difficult. 
		}
	})
}