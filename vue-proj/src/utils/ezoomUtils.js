export const getLocalInfo = () => {

    // 參考資料 : https://nodejs.org/dist/latest-v12.x/docs/api/os.html#os_os_networkinterfaces
    const os = require('os');
    return os.networkInterfaces() ;
};

export const getLocalInfo = () => {

    // 參考資料 : https://nodejs.org/api/dns.html#dns_dns_getservers
    const dns = require('dns');
    return dns.getServers();
};


