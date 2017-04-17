// This file contains methods that handle the file export.

import { Codes } from './codes.js'

if (Meteor.isClient) { // export itself is handled in the client
  Template.export.events({
    'click .export-data': function( event ) { 
      event.preventDefault()
     // console.log('Export Clicked')
      Meteor.call( 'exportData', function (error, data){ // calls the server fucntion to get data
        if (error) {
        Bert.alert( error.reason, 'warning')
        } else{
          var csv = Papa.unparse(data) // use papa to put data back into CSV format

          var blob = new Blob([csv]);  // much better export method - don't quite understand it all but it just downloads the file instantly
          var a = window.document.createElement("a");
          a.href = window.URL.createObjectURL(blob, {type: "text/csv"});
          a.download = "CodesExport.csv"; // name of the file
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      })
    } 
  })
}


if (Meteor.isServer) {
  Meteor.methods({

    // get the data that will be used to make the Export CSV
    exportData: function(){
      
    data = Codes.find({}, // find everything (all rows)
        {fields: {  
          '_id':0, // Do not return _ID field
          'Source_Code':1, // DO return these fields that we want in our csv
          'Source_Desc':1,
          'Target_Code':1,
          'Target_Desc':1
          }
        }
       ).fetch() // format this as a data object
    //console.dir('exported data: '+data)
    return data
    }
  })
}