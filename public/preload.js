const fs = require('fs')

utools.onPluginEnter(({code, type, payload}) => {
    if (type === "regex") {
        utools.dbStorage.setItem("json_crack_payload", payload)
    }
});

window.readFileAsText = (path) => {

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
window.saveTextToFile = (path, data) => {
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

window.savaImageToFile = (path, blob) => {
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