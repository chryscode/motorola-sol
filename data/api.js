const https = require('https');

async function fetchFromAPI(url){
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
        
            res.on('data', (chunk) => {
                data +=chunk;
            });
        
            res.on('end', () => {
                try{
                    const dataObject = JSON.parse(data);
                    resolve(dataObject);
                } catch (error) {
                    console.log('Error on fetch API data: ', error);
                    reject(error);
                }
            });
          
            res.on('error', (error) => {
                console.log('Error on API fetch: ', error);
                reject(error);
            });
        });
    });
}

module.exports = { fetchFromAPI }; 