import { Meteor } from 'meteor/meteor'
import { Codes } from '../imports/api/codes.js'
import '../imports/api/results.js'
import '../imports/api/auth.js'
import '../imports/api/codes.js'

//import '../imports/api/pressure.js'

Meteor.methods({
	parseUpload( data ){
		check( data, Array )

		for (let i=0; i< data.length; i++) {
			Codes.insert( data[i] )
		}
	},
		resetDB: function() {
		Codes.drop()
		//Codes.update({},{$set: {CUI: ''}}, {multi: true})
		//Codes.update({},{$set: {name: ''}}, {multi: true})
	}
})