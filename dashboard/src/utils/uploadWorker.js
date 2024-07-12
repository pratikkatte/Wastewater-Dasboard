// /* eslint-disable no-restricted-globals */

self.onmessage = async function(event) {
    const files = event.data.uploadedFile;
    const formData = new FormData();
    files.forEach((file, index) => {
    formData.append(`file`, file);
    });

    try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                self.postMessage({ progress: percentComplete });
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                self.postMessage({ message: 'File uploaded successfully', data: response });
            } else {
                self.postMessage({ error: 'File upload failed' });
            }
        };

        xhr.onerror = function() {
            self.postMessage({ error: 'An error occurred during the file upload' });
        };

        xhr.send(formData);
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
  