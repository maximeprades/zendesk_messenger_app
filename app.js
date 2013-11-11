(function() {

  return {
    defaultState: 'main',

    events: {
      'app.activated'   : 'init',
     'pane.activated'  : 'onPaneActivated',
      'activeUsers.done': 'onActiveUsersDone',
      'activeUsers.fail': 'switchToError',
      'click #send-msg' : 'sendMessage',
      'notification.message': 'onIncomingMessage'
    },

    requests: {
      presence: function() {
        return this._request('/presence/%@'.fmt(this.currentUser().id()), 'POST');
      },
      activeUsers: function() {
        return this._request('/presence/active_users');
      },
      sendMessage: function(to, message) {
        return {
          url: '/api/v2/apps/notify',
          type: 'POST',
          data: {
            event: 'message',
            body: {
              text: message,
              from: this.currentUser().name(),
              to: to
            },
            app_id: 19859
          }
        };
      }
    },

    storage: {},

    init: function() {
      this.sayPresence();
    },

    onPaneActivated: function() {
      this.ajax('activeUsers');
    },

    drawActiveUsers: function() {
      this.$('.activeUsers').html(this.renderTemplate('userlist', {
        activeUsers: this.storage.activeUsers
      }));
    },

    sayPresence: function() {
      this.when(this.ajax('presence'), this.ajax('activeUsers')).then(function() {
        setInterval(this.sayPresence.bind(this), 1000 * 60);
      }.bind(this));
    },

    onActiveUsersDone: function(data) {
      this.storage.activeUsers = data.active_ids;
      this.drawActiveUsers();
    },

    switchToError: function() {
      this.switchTo('error');
    },

    sendMessage: function() {
      var area = this.$('.message');
      var message = area.val();
      var to = this.$('.targetUser').val();
      this.ajax('sendMessage', to, message);
      area.val('');
    },

    onIncomingMessage: function(data) {
      if ((data.to * 1) === this.currentUser().id()) {
        this.popover();
        _.defer(this.drawMessage.bind(this, data));
      }
    },

    drawMessage: function(message) {
      this.$('#messages').append(this.renderTemplate('message', message));
    },

    _request: function(url, type, params) {
      var data = _.extend({
        secret: this.setting('messenger_secret')
      }, params);
      return {
        url: helpers.fmt("https://zendesk-messenger.herokuapp.com/account/%@%@", this.currentAccount().subdomain(), url),
        type: type,
        data: data
      };
    }
  };
}());
