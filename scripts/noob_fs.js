'use strict';

const fs = require('fs');

const NOOB_FS = process.env.NOOB_FS || '';

const setupTeamFile = () => {
  try {
    let parsedJson = JSON.parse(NOOB_FS);
    console.log('loaded team info', parsedJson);
    fs.closeSync(fs.openSync(`.data/db/teams/${parsedJson.id}.json`, 'a'));
    fs.writeFileSync(`.data/db/teams/${parsedJson.id}.json`, JSON.stringify(parsedJson));
    console.log('wrote team info');
  } catch (e) {
    console.log('could not write team info.', e);
  }
};

setupTeamFile();
