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

    static setYoutubeToken(apiKey) {
        globalDB.set('youtubeToken', apiKey).write();
    }

    static getYoutubeToken() {
        return globalDB.get('youtubeToken').value();
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