import { Codes } from './codes.js'

if (Meteor.isClient) {
  Template.export.events({
    'click .export-data': function( event ) {
        event.preventDefault()
        console.log('Export Clicked')
        Meteor.call( 'exportData', function (error, data){
          if (error) {
          Bert.alert( error.reason, 'warning')
          } else{
            var csv = Papa.unparse(data)
            //console.log(csv)
            window.open(encodeURI('data:text/csv;charset=utf-8,' + csv)); //so dirty... but it works. 
          }
        })
    } 
  })
}


if (Meteor.isServer) {
  Meteor.methods({
    exportData: function(){
      // get the data that will be used to make the Export CSV
   return Codes.find({}).fetch() //just retrun the whole damn array for now
    }
  })
}