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

			Papa.parse( event.target.files[0], {
				header: true,
				complete (results, file){
					Meteor.call( 'parseUpload', results.data, (error, response ) => {
						if (error) {
							console.log('warning:'+error.reason)
							Bert.alert( error.reason, 'warning')
						} else {
							template.uploading.set( false )
							console.log("upload complete")
							Bert.alert('Upload complete!', 'success', 'growl-top-right')
						}
					})
				}
			})
			for (cols in codesColumns) {
				console.log('new columns: '+cols)
				}
		}
	})
}

if (Meteor.isServer) {
	Meteor.methods({
		parseUpload: function( data ){
			check( data, Array )
			codesColumns = [] // clear column names variable
			//console.log(data[0])
			for (let i=0; i< data.length; i++) {
				Codes.insert( data[i] )
				//console.log(data[i])
			}
			for (var key in Codes.findOne({})) { // Loads column names in an array
					//console.log('key: '+key)
					codesColumns.push(key)
					console.log(codesColumns)
				}
			Codes.update({},{$set: {Target_Code: ''}}, {multi: true}) // Add the empty target columns to all documents
			Codes.update({},{$set: {Target_Desc: ''}}, {multi: true})

		},
		
	})
}