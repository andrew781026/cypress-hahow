const ss = async () => {

    return new Promise((resolve, reject) => {

        resolve(5);
        console.log('here will access');
    });

};

ss().then(s => console.log(s));
