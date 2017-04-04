import { Mongo } from 'meteor/mongo'

if (Meteor.isServer) {
	Meteor.publish("users", function(){
  return Meteor.users.find({},{fields:{profile:1}})
})

Meteor.subscribe("users");

