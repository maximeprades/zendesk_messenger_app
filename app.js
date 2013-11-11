(function() {

  return {
    events: {
      'app.activated'     :  'sayPresence',
      'activeUsers.done'  :  'switchToUserList',
      'activeUsers.fail'  :  'switchToError'
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
      },

      activeUsers: function() {
        return {
          url: "https://zendesk-messenger.herokuapp.com/account/" + this.currentAccount().subdomain() + "/presence/active_users",
          type: 'GET',
          data: {
            secret: this.setting('messenger_secret')
          }
        };
      }
    },

    sayPresence: function() {
      this.ajax('presence');
      this.ajax('activeUsers');
      setInterval (function() {
        this.ajax('presence');
        this.ajax('activeUsers');
      }.bind(this),1000*60);
    },

  switchToUserList: function(data) {
     this.switchTo('userlist',
      {
        activeUsers: data.active_ids
      });
    },

  switchToError: function() {
     this.switchTo('error');
    }

  };
}());
