const googleDriveCustomService = {
  createGoogleDoc: (fileName, parentId) => {
    const gapi = window && window.gapi;
    const resourceValues = {
      name: fileName,
      mimeType: 'application/vnd.google-apps.document',
    };
    if (parentId) {
      resourceValues.parents = [parentId];
    }
    return gapi.client.drive.files.create({
      resource: resourceValues,
      fields: 'id,webViewLink',
    });
  },
  createGoogleSheet: (fileName, parentId) => {
    const gapi = window && window.gapi;
    const resourceValues = {
      name: fileName,
      mimeType: 'application/vnd.google-apps.spreadsheet',
    };
    if (parentId) {
      resourceValues.parents = [parentId];
    }
    return gapi.client.drive.files.create({
      resource: resourceValues,
      fields: 'id,webViewLink',
    });
  },
  createGoogleSlide: (fileName, parentId) => {
    const gapi = window && window.gapi;
    const resourceValues = {
      name: fileName,
      mimeType: 'application/vnd.google-apps.presentation',
    };
    if (parentId) {
      resourceValues.parents = [parentId];
    }
    return gapi.client.drive.files.create({
      resource: resourceValues,
      fields: 'id,webViewLink',
    });
  },
  copyFile: (fileId, parentId) => {
    const gapi = window && window.gapi;
    return gapi.client.drive.files.copy({
      fileId: fileId,
      parents: [parentId],
      fields: 'id,name,webViewLink',
    });
  },
  transformSuccessResponse: (response) => {
    let resp;
    if (response.hasOwnProperty('result')) {
      resp = response.result;
    } else {
      resp = response;
    }
    resp.fileId = resp.id;
    resp.fileURL = '';
    if (resp.hasOwnProperty('webViewLink')) {
      resp.fileURL = resp.webViewLink;
    } else if (resp.hasOwnProperty('alternateLink')) {
      resp.fileURL = resp.alternateLink;
    }

    if (resp.hasOwnProperty('title')) {
      resp.name = resp.title;
    }
    return resp;
  },
  checkValidFileGoogleDrive: (fileExtension, mimeType) => {
    if (
      fileExtension === 'xls' ||
      fileExtension === 'xlsx' ||
      fileExtension === 'txt' ||
      fileExtension === 'rtf' ||
      fileExtension === 'numbers' ||
      fileExtension === 'key' ||
      fileExtension === 'doc' ||
      fileExtension === 'docx' ||
      fileExtension === 'ppt' ||
      fileExtension === 'pptx' ||
      fileExtension === 'pdf' ||
      fileExtension === 'pages' ||
      mimeType === 'application/vnd.google-apps.document' ||
      mimeType === 'application/vnd.google-apps.spreadsheet' ||
      mimeType === 'application/vnd.google-apps.presentation'
    ) {
      return true;
    }
    return false;
  },
  checkFileNameValid: (fileExtension) => {
    if (
      fileExtension === 'xls' ||
      fileExtension === 'xlsx' ||
      fileExtension === 'txt' ||
      fileExtension === 'rtf' ||
      fileExtension === 'numbers' ||
      fileExtension === 'key' ||
      fileExtension === 'doc' ||
      fileExtension === 'docx' ||
      fileExtension === 'ppt' ||
      fileExtension === 'pptx' ||
      fileExtension === 'pdf' ||
      fileExtension === 'pages' ||
      fileExtension === 'jpg' ||
      fileExtension === 'jpeg'
    ) {
      return true;
    }
    return false;
  },
  insertFile: (fileData, parentId, callback) => {
    const gapi = window && window.gapi;
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    const reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = (e) => {
      const contentType = fileData.type || 'application/octet-stream';
      const metadata = {
        title: fileData.name,
        mimeType: contentType,
        parents: [{ id: parentId }],
      };
      const base64Data = btoa(reader.result);
      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

      const request = gapi.client.request({
        path: '/upload/drive/v2/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      });
      if (!callback) {
        callback = (file) => {
          console.log(file);
        };
      }
      request.execute((file) => {
        console.log(file);
        callback(file)
      });
    };
  },
};
export default googleDriveCustomService;
