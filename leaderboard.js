// Create a MongoDB Collection
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {

  Meteor.subscribe('thePlayers');

  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      // Retrieve all of the data from the "Playerslist" collection"
      return PlayersList.find({}, {sort: {score: -1, name: 1}})
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
      Meteor.call('modifyPlayerScore', selectedPlayer, 5);
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, -5);
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayerData', selectedPlayer);
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      Meteor.call('insertPlayerData', playerNameVar);
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId})
  });

  Meteor.methods({
    'insertPlayerData': function(playerNameVar){
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
    },
    'removePlayerData': function(selectedPlayer){
      PlayersList.remove(selectedPlayer);
    },
    'modifyPlayerScore': function(selectedPlayer, scoreValue){
      PlayersList.update(selectedPlayer, {$inc: {score: scoreValue}});
    }
  });
}
