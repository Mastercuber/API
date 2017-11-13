const authManagement = require('./auth-management/auth-management.service.js');
const users = require('./users/users.service.js');
const contributions = require('./contributions/contributions.service.js');
const comments = require('./comments/comments.service.js');
const notifications = require('./notifications/notifications.service.js');
const emails = require('./emails/emails.service.js');
const categories = require('./categories/categories.service.js');
const uploads = require('./uploads/uploads.service.js');
const images = require('./images/images.service.js');
const badges = require('./badges/badges.service.js');
const emotions = require('./emotions/emotions.service.js');
const organizations = require('./organizations/organizations.service.js');
const projects = require('./projects/projects.service.js');
const follows = require('./follows/follows.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(authManagement);
  app.configure(users);
  app.configure(contributions);
  app.configure(comments);
  app.configure(notifications);
  app.configure(emails);
  app.configure(categories);
  app.configure(uploads);
  app.configure(images);
  app.configure(badges);
  app.configure(emotions);
  app.configure(organizations);
  app.configure(projects);
  app.configure(follows);
};
