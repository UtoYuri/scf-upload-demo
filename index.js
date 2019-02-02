const fs = require('fs')
const moment = require('moment');
const Cos = require('cos-nodejs-sdk-v5');
const config = require('./config');

const {
    SECRETID, SECRETKEY,
    BUCKET, REGION,
} = config;

const cos = new Cos({
    SecretId: SECRETID,
    SecretKey: SECRETKEY
});

const uploadFile2Cos = (fileName, pathName) => {
    const destPathName = `share/${moment().format('YYYY-MM-DD')}/${new Date().getTime()}-${fileName}`;
    return new Promise((resolve, reject) => {
        cos.sliceUploadFile({
            Bucket: BUCKET,
            Region: REGION,
            Key: destPathName,
            FilePath: pathName
        }, async (err, data) => {
            if (err) {
                reject(new Error(`Upload failed, ${JSON.stringify(err)}`));
            } else {
                await fs.unlinkSync(pathName);
                resolve(data);
            }
        });
    });
};

const uploadHandler = async (event, context, callback) => {
    try {
        const { fileName, base64Data } = JSON.parse(event.body);
        if (!fileName || ! base64Data) {
            throw new Error('Bad request, wrong params');
        }
        const securityFileName = encodeURIComponent(fileName);
        const pathName = `/tmp/${securityFileName}`;

        var dataBuffer = new Buffer(base64Data.split(';base64,').pop(), 'base64');
        await fs.writeFileSync(pathName, dataBuffer, 'base64');
        const data = await uploadFile2Cos(securityFileName, pathName);

        callback(null, {
            errorCode: 0,
            url: `https://${data.Location}`
        });
    } catch (e) {
        callback(e);
    }
}

exports.main_handler = uploadHandler;