import { openDB } from 'idb';
import { message } from 'antd';

const dbPromise = openDB('locations', 2, {
  upgrade(e) {
    const thisDB = e.target.result;
    if (!thisDB.objectStoreNames.contains('markers')) {
      thisDB.createObjectStore('markers', { keyPath: 'key' });
    }
  }
});

class DBService {
  get = key => {
    return dbPromise
      .then(db => {
        return db
          .transaction('markers')
          .objectStore('markers')
          .get(key);
      })
      .catch(() => {
        message.error('Sorry, an error occurred.');
      });
  };

  getAll = () => {
    return dbPromise
      .then(db => {
        return db
          .transaction('markers')
          .objectStore('markers')
          .getAll();
      })
      .catch(() => {
        message.error('Sorry, an error occurred.');
      });
  };

  getAllKeys = () => {
    return dbPromise
      .then(db => {
        return db
          .transaction('markers')
          .objectStore('markers')
          .getAllKeys();
      })
      .catch(() => {
        message.error('Sorry, an error occurred.');
      });
  };

  add = object => {
    if (object.key) {
      return dbPromise
        .then(db => {
          return db
            .transaction('markers', 'readwrite')
            .objectStore('markers')
            .add(object);
        })
        .catch(() => {
          message.error('Sorry, an error occurred.');
        });
    }
    return null;
  };

  update = object => {
    return dbPromise
      .then(db => {
        return db
          .transaction('markers', 'readwrite')
          .objectStore('markers')
          .put(object);
      })
      .catch(() => {
        message.error('Sorry, an error occurred.');
      });
  };

  delete = key => {
    return dbPromise
      .then(db => {
        return db
          .transaction('markers', 'readwrite')
          .objectStore('markers')
          .delete(key);
      })
      .catch(() => {
        message.error('Sorry, an error occurred.');
      });
  };

  clear = () => {
    return dbPromise
      .then(db => {
        return db
          .transaction('markers', 'readwrite')
          .objectStore('markers')
          .clear();
      })
      .catch(() => {
        message.error('Sorry, an error occurred.');
      });
  };
}

export const Service = new DBService();
