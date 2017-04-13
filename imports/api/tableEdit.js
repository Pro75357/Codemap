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

        'saveOne': function (rowID, selectID, searchTarget) {
           //console.log(rowID + ' ' + selectID)
            //CUI = Codes.find({ _id: rowID }, function (result) { return result.ui === selectID })
            res = Meteor.call('searchCUI', selectID, searchTarget)
            TC = res[0].code
            TD = res[0].name
            console.log("TC: " + TC)
            console.log("TD: " + TD)
            Codes.update(
                { _id: rowID },
                {
                    $set: {
                        Target_Code: TC,
                        Target_Desc: TD
                    }}

            )
        },

        'findCodes': function (rowID, selectedID, searchTarget) {
            searchCUI = Codes.findOne({ _id: rowID }, function (result) { return result.ui === selectID })
            res = Meteor.call('searchCUI', searchCUI, searchTarget)
            console.dir(res)
        },
            //RD = Codes.findOne({ _id: rowID }).Result_Desc

            // Make sure they are not '' otherwise will overwrite with null.
            /*
            if (RC == '') {
                return false
            } else {
                Codes.update(
                    { _id: rowID }, // the document to update
                    {
                        $set: {
                            Target_Code: RC, // updates the Target code with current Result_code
                            Target_Desc: RD, // updates the Target Description with current Result desc
                            Result_Code: '', // clears the displayed result_code
                            Result_Desc: '',  // clears the displayed result_desc
                        }
                    }
                )
            }
        }

            */
        /*
		'saveOne': function(rowID){
			console.log('result saved')
			// saves the individually clicked result.
			
			// First get the result in variable
			RC= Codes.findOne({_id: rowID}).Result_Code
			RD= Codes.findOne({_id: rowID}).Result_Desc

			// Make sure they are not '' otherwise will overwrite with null.
			if (RC == '') {
				return false
			} else {
				Codes.update(
					{_id: rowID}, // the document to update
					{$set: { 
						Target_Code: RC, // updates the Target code with current Result_code
						Target_Desc: RD, // updates the Target Description with current Result desc
						Result_Code: '', // clears the displayed result_code
						Result_Desc: '',  // clears the displayed result_desc
						}
					}
				)
			}
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