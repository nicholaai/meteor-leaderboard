// Create a MongoDB Collection
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {

  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      // Retrieve all of the data from the "Playerslist" collection"
      return PlayersList.find({createdBy: currentUserId}, 
                              {sort: {score: -1, name: 1}})
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
    },
    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer)
    }    
  });

  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      // Create a session to store the unique ID of the clicked player
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: 5}});
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5}});
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      if(confirm("Are you sure you want to remove this player?"))
        PlayersList.remove(selectedPlayer);
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
    }
  });


}

if(Meteor.isServer) {

}