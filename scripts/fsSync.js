'use strict';

const fs = require('fs');

exports.syncToLocalFile = (data, path) =>
  fs.writeFile(path, JSON.stringify(data), 'utf8', (err) => {
    if (err) {
      const baseDir = path.replace('/' + path.split('/').pop(), '');
      console.log('could not sync to local file', err);
      if (!fs.existsSync(baseDir)) {
        console.log('jobs dir does not exist - creating dir and file');
        fs.mkdirSync(baseDir);
        fs.writeFile(path, JSON.stringify(data), 'utf8', (err) => {
          if (err) {
            console.log('could not resync to local file');
          } else {
            console.log('resync was successful');
          }
        });
      }
    } else {
      console.log('sync to file was successful');
    }
  });