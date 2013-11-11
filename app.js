(function() {

  return {
    events: {
      'app.activated'     :  'init',
      'activeUsers.done'  :  'switchToUserList',
      'activeUsers.fail'  :  'switchToError'
    },

    requests: {
      presence: function() {
        return this._request('/presence/%@'.fmt(this.currentUser().id()), 'POST');
      },

      activeUsers: function() {
        return this._request('/presence/active_users');
      }
    },

    init: function() {
      this.sayPresence();
    },

    sayPresence: function() {
      this.ajax('presence');
      this.ajax('activeUsers');

      setInterval(this.sayPresence.bind(this), 1000 * 60);
    },

    switchToUserList: function(data) {
      this.switchTo('userlist', {
        activeUsers: data.active_ids
      });
    },

    switchToError: function() {
      this.switchTo('error');
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
