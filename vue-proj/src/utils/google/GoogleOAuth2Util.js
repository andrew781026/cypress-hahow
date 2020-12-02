import http from 'http';
import url from 'url';
import opn from 'open';
import queryString from 'query-string';

import {google} from 'googleapis';

class GoogleOAuth2Util {

    constructor({clientId, clientSecret, scopes = [], redirectPort = 3000, saveToken}) {

        this.clientId = clientId;
        this.scopes = scopes;
        this.redirectPort = redirectPort;
        this.oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            `http://localhost:${redirectPort}/oauth2callback`
        );

        GoogleOAuth2Util.setGlobalAuth(this.oauth2Client);

        saveToken && this.oauth2Client.on('tokens', saveToken); // 儲存 oauth2Client 用的 token
    }

    static setGlobalAuth(oauth2Client) {
        google.options({auth: oauth2Client})
    }

    static renderRedirectHtml(tokens = {}) {

        const {expiry_date, access_token, refresh_token} = tokens;

        return `<h1>Authentication successful!</h1>
                <table style="border-collapse: collapse;">
                    <tr>
                        <td style="border: 1px solid black;padding: 10px;">EXPIRY_DATE</td>
                        <td style="border: 1px solid black;padding: 10px;">${new Date(expiry_date).toDateString()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black;padding: 10px;">ACCESS_TOKEN</td>
                        <td style="border: 1px solid black;padding: 10px;">${access_token}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black;padding: 10px;">REFRESH_TOKEN</td>
                        <td style="border: 1px solid black;padding: 10px;">${refresh_token}</td>
                    </tr>
                </table>`;
    }

    generateAuthUrl() {

        const oauth2Client = this.oauth2Client;
        const redirectPort = this.redirectPort;
        const scopes = this.scopes;
        const client_id = this.clientId;

        const parsed = {
            access_type: 'offline',
            scope: scopes.join(' '),
            // prompt: 'consent', // add prompt: 'consent' to get refresh_token
            redirect_uri: `http://localhost:${redirectPort}/oauth2callback`,
            response_type: 'code',
            client_id,
            flowName: 'GeneralOAuthFlow',
        };

        const stringified = queryString.stringify(parsed);

        return `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?${stringified}`
        /*
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes.join(' '),
            // prompt: 'consent', // add prompt: 'consent' to get refresh_token
            redirect_uri: `http://localhost:${redirectPort}/oauth2callback`
        });
         */
    }

    static setOauth2Tokens(oauth2Client, tokens) {
        oauth2Client.setCredentials(tokens)
    }

    static getOauth2Client(tokens, options) {

        const oauth2Client = new google.auth.OAuth2(options);
        oauth2Client.setCredentials(tokens);

        return oauth2Client;
    }

    static getGoogleApis(tokens) {

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials(tokens);
        google.options({auth: oauth2Client});

        return google;
    }

    openAuthPageAndGetAuthorizationCode(savedTokens) {

        // grab the url that will be used for authorization
        const authorizeUrl = this.generateAuthUrl();
        const redirectPort = this.redirectPort;
        const oauth2Client = this.oauth2Client;
        const renderRedirectHtml = GoogleOAuth2Util.renderRedirectHtml;
        const setOauth2Tokens = GoogleOAuth2Util.setOauth2Tokens;

        // token 已過期 , 可用 refresh_token 取得新的
        if (savedTokens && savedTokens.refresh_token) {

            setOauth2Tokens(oauth2Client, savedTokens);
            return {...savedTokens, googleApis: google};

            // token 尚未過期
        } else if (savedTokens && new Date(savedTokens.expiry_date) > new Date()) { // "expiry_date": 1597119480777

            setOauth2Tokens(oauth2Client, savedTokens);
            return {...savedTokens, googleApis: google};

        } else {

            return new Promise((resolve, reject) => {

                const server = http
                    .createServer((req, res) => {
                        if (req.url.indexOf('/oauth2callback') > -1) {
                            const qs = new url.URL(req.url, `http://localhost:${redirectPort}`).searchParams;

                            oauth2Client.getToken(qs.get('code'))
                                .then(({tokens}) => {

                                    // show access_token and api_key to html
                                    res.end(renderRedirectHtml(tokens));

                                    setOauth2Tokens(oauth2Client, tokens);
                                    resolve({
                                        access_token: tokens.access_token,
                                        refresh_token: tokens.refresh_token,
                                        expiry_date: tokens.expiry_date,
                                        googleApis: google
                                    });

                                    // Close the server
                                    server.close(() => console.log('Server closed!'));
                                })
                                .catch(e => {
                                    res.end('Authentication failed.');
                                    reject(e);

                                    // Close the server
                                    server.close(() => console.log('Server closed!'));
                                });
                        } else {
                            res.end(`Wrong Url.You need to set http://localhost:${redirectPort}/oauth2callback as redirect_uri`);
                        }
                    })
                    .listen(redirectPort, () => {
                        // open the browser to the authorize url to start the workflow
                        opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
                    });
            });
        }
    }
}

export default GoogleOAuth2Util;