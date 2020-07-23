import fs from "fs";
import low from 'lowdb'; // json db
import FileSync from 'lowdb/adapters/FileSync';
import {createFileIfNotExist} from './ezoomUtils';

let globalDB; // globalDB 會再開啟 APP 後載入

class DbUtils {

    // globalDB;

    static setGlobalDB(db) {
        globalDB = db;
    }

    static getGlobalDB() {
        return globalDB;
    }

    static setGoogleOAuth2Info(oAuth2Info) {
        globalDB.set('google', oAuth2Info).write();
    }

    static updateGoogleOAuth2Info(oAuth2Info) {
        globalDB.assign('google', oAuth2Info).write();
    }

    static getGoogleOAuth2Info() {
        return globalDB.get('google').value();
    }

    static getSavedTokens() {

        const googleOAuth2Info = globalDB.get('google').value();
        return googleOAuth2Info && googleOAuth2Info.tokens;
    }

    static setHahowToken(token) {
        globalDB.set('hahowToken', token).write();
    }

    static getHahowToken(token) {
        return globalDB.get('hahowToken').value();
    }

    static setCourses(courses) {
        globalDB.set('courses', courses).write();
    }

    static getCourses() {
        return globalDB.get('courses').value();
    }

    static getDataBase({filePath, defaultJson = {}}) {

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
    }
}

export default DbUtils;