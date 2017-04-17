import { Codes } from './codes.js'

if (Meteor.isServer){
    Meteor.methods({

        // This gets the actual codes for the selected searchTarget and puts it into the Codes collection where it will pull into the view.
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

        // This saves a single selected (selectID) result to the Codes table in the Target fields.
        'saveOne': function (rowID, selectID, searchTarget) {
            res = Meteor.call('searchCUI', selectID, searchTarget)
            //console.dir(res)
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

        // This removes a result from the target fields based on the row. 
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

        // I want to make this show/hide based on a single row. TODO.
		'editOne': function(rowID) {
			console.log('need to edit this one')
			// Todo: function that allows editing the current result. 
			// Will be difficult. 
		}
	})
}