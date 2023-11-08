const fs = require('fs')

utools.onPluginEnter(({code, type, payload}) => {
    if (type === "regex") {
        utools.dbStorage.setItem("json_crack_payload", payload)
    }
    if(type === "files"){
        let path = payload[0].path;
        readFileAsText(path).then((data) => {
            utools.dbStorage.setItem("json_crack_payload", data);
        }).catch((e) => {
          console.error(e);
        })
    }
});

const readFileAsText = (path) => {

    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

const saveTextToFile = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    });
}

const savaImageToFile = (path, blob) => {
    return new Promise((resolve, reject) => {
        blob.stream().getReader().read().then((buff) => {
            fs.writeFile(path, buff.value, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        }).catch((e) => {
            reject(e);
        })
    });
}

window.readFileAsText = readFileAsText;
window.saveTextToFile = saveTextToFile;
window.savaImageToFile = savaImageToFile;