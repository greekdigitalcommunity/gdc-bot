'use strict';

const fs = require('fs');

exports.syncToLocalFile = (data) =>
  fs.writeFile('.data/db/jobs/jobs.json', JSON.stringify(data), 'utf8', (err) => {
    if (err) {
      console.log('could not sync to local file', err);
      if (!fs.existsSync('.data/db/jobs')) {
        console.log('jobs dir does not exist - creating dir and file');
        fs.mkdirSync('.data/db/jobs');
        fs.writeFile('.data/db/jobs/jobs.json', JSON.stringify(data), 'utf8', (err) => { 
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