// This is where the methods that handle the file upload live.

import { Codes } from './codes.js'

//codesColumns = []

if (Meteor.isClient) {

	// Helper for the loading icon
	Template.upload.onCreated( () => {
		Template.instance().uploading = new ReactiveVar( false )
	})

	Template.upload.helpers({
		uploading() {
			return Template.instance().uploading.get()
		}
	})

	// upload based on tutorial: https://themeteorchef.com/tutorials/importing-csvs
	Template.upload.events({  
		'change .upload': function(event, template) {
			event.preventDefault();
			//console.log("New CSV submitted")
			//console.log("event: "+ event.target.files[0])

			template.uploading.set( true ) //Make the upload icon appear

			Meteor.call('clearDB') //Drops any existing database

			Papa.parse( event.target.files[0], { // parses the uploaded CSV to a data structure
				header: true,
				complete (results, file){
					Meteor.call( 'parseUpload', results.data, (error, response ) => { // passes the data to the server function to save it to collection
						if (error) {
							console.log('warning:'+error.reason)
							Bert.alert( error.reason, 'warning')
						} else {
							template.uploading.set( false ) // stop the uploading icon
							//console.log("upload complete")
							Bert.alert('Upload complete!', 'success', 'growl-top-right') // upload complete notification
						}
					})
				}
			})
		}
	})
}

if (Meteor.isServer) {
	Meteor.methods({
		parseUpload: function( data ){ // takes data that is passed from the parsed CVS above.
			check( data, Array )
			
			//codesColumns = [] // clear column names variable
			//console.log(data[0])
			for (let i=0; i< data.length; i++) { // Insert each field as a new row.
				Codes.insert( data[i] )
				//console.log(data[i])
			}
			//Codes.update({},{$set: {Target_Code: ''}}, {multi: true}) // Add the empty target columns to all documents
			//Codes.update({},{$set: {Target_Desc: ''}}, {multi: true}) // not really necessary
		},
	})
}