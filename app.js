(function() {

  return {
    events: {
      'app.activated': 'sayPresence'
    },

    requests: {
      presence: function() {
        return {
          url: "https://zendesk-messenger.herokuapp.com/account/" + this.currentAccount().subdomain() + "/presence/" + this.currentUser().id(),
          type: 'POST',
          data: {
            secret: this.setting('messenger_secret')
          }
        };
      }
    },

    sayPresence: function() {
      this.ajax('presence');
      setInterval (function() {
        this.ajax('presence');
    }.bind(this),1000*60);
   }
  };

}());
