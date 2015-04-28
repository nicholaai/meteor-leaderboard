// Create a MongoDB Collection
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {

  Template.leaderboard.helpers({
    'player': function(){
      // Retrieve all of the data from the "Playerslist" collection"
      return PlayersList.find()
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
    }    
  });

  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      // Create a session to store the unique ID of the clicked player
      Session.set('selectedPlayer', playerId);
    }
  });


}

if(Meteor.isServer) {

}