var _ = require('underscore');
var util = require('util');
var FeedBase = require('./feed-base');

function SavedFeed(session, limit) {
    this.timeout = 10 * 60 * 1000; // 10 minutes
    this.limit = limit;
    FeedBase.apply(this, arguments);
}
util.inherits(SavedFeed, FeedBase);

module.exports = SavedFeed;
var Media = require('../media');
var Request = require('../request');

SavedFeed.prototype.get = function (maxId) {
    var that = this;

    return new Request(that.session)
      .setMethod('POST')
      .setResource('savedFeed', {
            maxId: that.getCursor()
        })
      .generateUUID()
      .setData({})
      .signPayload()
      .send()
      .then(function(data) {
            var nextMaxId = data.next_max_id ? data.next_max_id.toString() : data.next_max_id;
            that.moreAvailable = data.more_available && !!nextMaxId;
            if (that.moreAvailable)
                that.setCursor(nextMaxId);

            console.log(data);
            return data.items;
      })
};
