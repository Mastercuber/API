/* eslint-disable no-unused-vars */

const { asyncForEach, genInviteCode } = require('../../helper/seed-helpers');
const { keyBy, isEmpty } = require('lodash');

class Service {
  constructor (options) {
    this.options = options || {};
    if (!options.app) {
      throw new Error('admin services missing option.app');
    }
    this.app = options.app;
    this.seederstore = {};
  }
  
  async _fillSeederStore(services = []) {
    this.app.debug('###Filling seeder store...');
    await asyncForEach(services, async (service) => {
      const res = await this.app.service(service).find({ query: { $limit: 100 }});
      this.seederstore[service] = keyBy(res.data, '_id');
    });
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }
    
    return new Promise(async (resolve, reject) => {

      if (data.seedBaseCategories || data.seedBaseBadges || data.seedFakeData || data.seedDemoData) {
        try {
          await this._fillSeederStore(['users', 'categories']);
        } catch (err) {
          reject(err);
        }
      }

      if (data.seedBaseCategories) {
        // run the seeder
        this.app.debug('seedBaseCategories...');
        require('../../seeder')(this.app, this.seederstore);
        try {
          await this.app.seed([
            require('../../seeder/base/categories')
          ]);
          resolve();
        } catch (err) {
          reject(err);
        }
      }
      if (data.seedBaseBadges) {
        // run the seeder
        this.app.debug('seedBaseBadges...');
        require('../../seeder')(this.app, this.seederstore);
        try {
          await this.app.seed([
            require('../../seeder/base/categories')
          ]);
          resolve();
        } catch (err) {
          reject(err);
        }
      }
      if (data.seedFakeData) {
        // run the seeder
        this.app.debug('seedFakeData...');
        require('../../seeder')(this.app, this.seederstore);
        try {
          await this.app.seed(require('../../seeder/development')());
          resolve();
        } catch (err) {
          reject(err);
        }
      }
      if (data.seedDemoData) {
        // run the seeder
        this.app.debug('seedDemoData...');
        require('../../seeder')(this.app, this.seederstore);
        try {
          await this.app.seed(require('../../seeder/demo')());
          resolve();
        } catch (err) {
          reject(err);
        }
      }

      if (!isEmpty(data.createInvites)) {
        // run the seeder
        this.app.debug('creatingInviceCodes...');

        let output = [];
        await asyncForEach(data.createInvites, async (email) => {
          try {
            const res = await this.app.service('invites').create({
              email: email,
              code: genInviteCode()
            });
            output.push(res);
          } catch (err) {
            this.app.error(err);
          }
        });

        resolve(output);
      }
    });
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
