interface Window {
    readFileAsText(path: string): Promise;

    saveTextToFile(path: string, data: string): Promise;

    savaImageToFile(path: string, data: Blob): Promise;
}