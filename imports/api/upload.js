
import { Codes } from './codes.js'

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
	'change .upload' (event, template) {
		event.preventDefault();
		//console.log("New CSV submitted")
		//console.log("event: "+ event.target.files[0])

		template.uploading.set( true )

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
	}
})