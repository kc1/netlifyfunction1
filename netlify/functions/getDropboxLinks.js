require("dotenv").config();
const { Dropbox } = require("dropbox");
const fs = require("fs");
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    // const myObjArray = JSON.parse(event.body);
  // console.log(myObjArray);


  try {

    const postArray = JSON.parse(event.body);
    console.log("posted", postArray);

    // Set refresh token URL based on system
    const isChromeos = process.platform === 'linux' && process.env.CHROME_RUNTIME;
    const refreshTokenUrl = isChromeos 
      ? "http://localhost:8888/.netlify/functions/refreshTokenNTL"
      : "https://comfy-crisp-d74946.netlify.app/.netlify/functions/refreshTokenNTL";
    const response = await fetch(refreshTokenUrl);

    if (!response.ok) {
      // Log the error response
      console.error("Error from refreshTokenNTL:", await response.text());
      throw new Error(
        `Failed to refresh token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Refreshed token data:", data);

    // Use the new access token from data.message.access_token
    const ACCESS_TOKEN = data.message.access_token;
    const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    const filesList = await dbx.filesListFolder({
      path: "",
    });
    console.log("Files:", filesList.result.entries);
    // return
    // Sort entries in descending order by server_modified date
    const sortedEntries = filesList.result.entries.sort((a, b) => {
      return new Date(b.server_modified) - new Date(a.server_modified);
    });

    console.log("Files:", sortedEntries);

    const filePaths = sortedEntries.map((entry) => entry.path_lower);
    console.log("filePaths:", filePaths);
    //
    // Download a specific file.
    const filePath = "/Wisconsin-Ashland-18012340000-01-07-2025-contours.png";
    // const response = await dbx.filesDownload({ path: filePath });

    let resultArr = [];
    for (var i = 0; i < postArray.length; i++) {
      let myRow = postArray[i];
      if (myRow.APN != "") {
        const searchString = (
          myRow.state +
          "_" +
          myRow.county +
          "_" +
          myRow.APN
        ).toLowerCase();
        // Filter files that start with the search string
        console.log(searchString);

        var matchingFiles = filePaths.filter(function (file) {
          return file.includes(searchString);
        });

        console.log("matchingFiles: ");
        console.log(matchingFiles);
        if (matchingFiles.length) {
          var waterFile = matchingFiles.find((file) => file.includes("water"));
          var contourFile = matchingFiles.find((file) =>
            file.includes("contours")
          );

            let sharedWaterLink;
            try {
              sharedWaterLink = await dbx.sharingListSharedLinks({
              path: waterFile,
              direct_only: true
              });
              if (sharedWaterLink.result.links.length > 0) {
              sharedWaterLink = { result: { url: sharedWaterLink.result.links[0].url } };
              } else {
              sharedWaterLink = await dbx.sharingCreateSharedLinkWithSettings({
                path: waterFile,
              });
              }
            } catch (error) {
              sharedWaterLink = await dbx.sharingCreateSharedLinkWithSettings({
              path: waterFile,
              });
            }

            try {
              const sharedContourLinks = await dbx.sharingListSharedLinks({
              path: contourFile,
              direct_only: true
              });
              if (sharedContourLinks.result.links.length > 0) {
              sharedContourLink = { result: { url: sharedContourLinks.result.links[0].url } };
              } else {
              sharedContourLink = await dbx.sharingCreateSharedLinkWithSettings({
                path: contourFile,
              });
              }
            } catch (error) {
              sharedContourLink = await dbx.sharingCreateSharedLinkWithSettings({
              path: contourFile,
              });
            }
          // const sharedContourLink =
          //   await dbx.sharingCreateSharedLinkWithSettings({
          //     path: contourFile,
          //   });
          myRow.WaterURL = sharedWaterLink.result.url;
          myRow.ContourURL = sharedContourLink.result.url;
          resultArr.push(myRow);
        }
      }
    }
    console.log("resultArr:", resultArr);




    return {
      statusCode: 200,
      body: JSON.stringify(resultArr),
    };
  } catch (error) {
    console.error("Error calling refreshTokenNTL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString(),
      }),
    };
  }
};
