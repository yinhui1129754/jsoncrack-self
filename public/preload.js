utools.onPluginEnter(({code, type, payload}) => {
    if (type === "regex") {
        window.localStorage.setItem("json_crack_payload", payload);
    }
});