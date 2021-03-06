// notifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const notifications = new mongooseClient.Schema({
    // User this notification is sent to
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        'comment',
        'comment-mention',
        'contribution-mention',
        'following-contribution'
      ]
    },
    relatedUserId: { type: String, index: true },
    relatedContributionId: { type: String, index: true },
    relatedOrganizationId: { type: String, index: true },
    relatedCommentId: { type: String },
    unseen: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('notifications', notifications);
};
