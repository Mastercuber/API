const logger = require('winston');

module.exports = function() {
  return function (hook) {
    logger.info('inside hook!!!!!!!!!!!!!!!!');
    // Check required fields
    if(!hook.result.text || !hook.result._id || !hook.result.userId) {
      return false;
    }
    logger.info('inside hook!!!!!!!!!!!!!!!!2');
    const userId = hook.result.userId;
    const text = hook.result.text;
    logger.info('before send!!!!!!!!!!!!!!!!');
    logger.info('channels: ' + hook.app.channels);
    logger.info('userId: ' + userId);
    logger.info('text: ' + text);
    logger.info('hook.result: ' + JSON.stringify(hook.result, null, 2));
    logger.info('channel connections: ' + hook.app.channel(userId).connections);
    hook.app.channel(userId).send(hook.result);
    logger.info('after send!!!!!!!!!!!!!!!!');
    return hook;
  };
};
