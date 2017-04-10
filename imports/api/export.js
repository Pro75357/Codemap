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
            //window.open(encodeURI('data:text/csv;charset=utf-8,' + csv)); //so dirty... but it works. 
            var blob = new Blob([csv]);  // much better export method
            var a = window.document.createElement("a");
            a.href = window.URL.createObjectURL(blob, {type: "text/csv"});
            a.download = "CodesExport.csv";
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
    exportData: function(){
      // get the data that will be used to make the Export CSV
    //return Codes.find({}).fetch() //just return the whole damn array for now
    data = Codes.find({}, {fields: {'_id':0}}).fetch() // returns everythin EXCEPT ID field 
    console.dir('exported data: '+data)
    return data
    }
  })
}