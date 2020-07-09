const Axios = require('axios');

const getApiToken = jwtToken => `Bearer ${jwtToken}`;

const HttpUtil = {
    async get({url, token}) {

        const response = await Axios({
            method: "GET",
            url,
            headers: {Authorization: getApiToken(token)},
        });

        return await response.data;
    },
};

module.exports = {
    HttpUtil
};
