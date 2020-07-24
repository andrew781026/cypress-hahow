import fs from "fs";
import low from 'lowdb'; // json db
import FileSync from 'lowdb/adapters/FileSync';
import {createFileIfNotExist} from './ezoomUtils';

let globalDB; // globalDB 會再開啟 APP 後載入

const DbUtils = {

    setGlobalDB: db => globalDB = db,

    getGlobalDB: () => globalDB,

    setGoogleOAuth2Info: oauth2Info => globalDB.set('google', oauth2Info).write(),

    updateGoogleOAuth2Info: oauth2Info => {

        const googleData = globalDB.get('google').value();
        globalDB.set('google', {...googleData, ...oauth2Info}).write();
    },

    getGoogleOAuth2Info: () => globalDB.get('google').value(),

    getSavedTokens: () => {

        const googleOAuth2Info = globalDB.get('google').value();
        return googleOAuth2Info && googleOAuth2Info.tokens;
    },

    setHahowToken: token => globalDB.set('hahowToken', token).write(),

    getHahowToken: () => globalDB.get('hahowToken').value(),

    setCourses: courses => globalDB.set('courses', courses).write(),

    getCourses: () => globalDB.get('courses').value(),

    getDataBase: ({filePath, defaultJson = {}}) => {

        if (fs.existsSync(filePath)) {

            const adapter = new FileSync(filePath);
            return low(adapter);

        } else {

            createFileIfNotExist(filePath);
            const adapter = new FileSync(filePath);
            const db = low(adapter);

            // Set some defaults (required if your JSON file is empty)
            db.defaults(defaultJson).write();

            return db;
        }
    },
}

export default DbUtils;