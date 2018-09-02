// chatroom-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const chatroom = new Schema({
    name: { type: String },
    users: { type: Array, default: []},
    isPrivate: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  }, {
    minimize: false
  });

  return mongooseClient.model('chatRooms', chatroom);
};
