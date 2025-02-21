require("dotenv").config();
const { Dropbox } = require("dropbox");
const fs = require("fs");
// const { refreshDropboxToken } = require("./refreshTokenNTL");

async function refreshToken() {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token:
      "rz3n5_bhZvgAAAAAAAAAAZMK3Wfc-CV2rxof3x3lMl9zdSFscuUi_Km0XeZEssQb",
    client_id: "4wlwoffttm98qno",
    client_secret: "6xe8cx18dgq5oa5",
  });

  try {
    const response = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();
    console.log("New access token:", data.access_token);
    return data
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}

exports.handler = async function (event, context) {
  try {
    // Refresh Dropbox token and create a new Dropbox instance.
    const data = await  refreshToken();
    console.log("data", data);
    const ACCESS_TOKEN =data.access_token;
    // const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

    // List files in the root folder.
    // const folderContent = await dbx.filesListFolder({ path: "screentest1" });
    // console.log("Files in folder:", folderContent.entries);

    const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

    // List files in app folder
    const filesList = await dbx.filesListFolder({
      path: ''
    });
    console.log('Files:', filesList.result.entries);

    const filePaths = filesList.result.entries.map((entry) => entry.path_lower);
    // Download a specific file.
    // const filePath = "/Wisconsin-Ashland-18012340000-01-07-2025-contours.png";
    // const response = await dbx.filesDownload({ path: filePath });

    // Save the file locally.
    // fs.writeFileSync(
    //   response.result.name,
    //   response.result.fileBinary,
    //   "binary"
    // );
    // console.log(`File downloaded: ${response.result.name}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        // message: `File downloaded: ${response.result.name}`,
        files: filePaths,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString(),
      }),
    };
  }
};
