# PipSpeak

Pipspeak is a Google Chrome Extension designed to incorporate SoundCloud-style commenting into YouTube.com. The extension places a commenting interface below the video and allows users to comment text or a select number of reaction emojis at a specific time in the video. These comments are then meant to be displayed to all viewers with the extension and show up at the specific time at which a user comments. Currently, multiple comments are just appended together. Below the commenting interface is a frequency graph showing where the most comments in a video were made.

## Setting up PipSpeak for Development/Testing

PipSpeak is not yet on the Google Chrome Webstore. If you would like to test the extension, follow these steps:

1. Clone this repository.
2. Enable Developer Mode under Settings->Extensions in Google Chrome. It is a checkbox on the top right on the Extensions page.
3. Click the "Load Unpacked Extension" box. Select the PipSpeak folder.
4. Go into ./boot.js and replace the extension ID: `var ext_id = 'akbppkonfpajpmnenablocifpbhckeoe';` on line 38 needs to be set to your own personal extension ID. This ID is shown under the Extensions page within the PipSpeak extension block.
5. Reload the extension, using either `Ctrl+R` or the Reload link within the PipSpeak extension block.
6. Now, navigate to [YouTube](http://YouTube.com/) and open a video.
7. Once the page has reloaded, hard refresh it once or twice (`Ctrl+R`) so that all of the module components have loaded. You should see a flat red line for the frequency graph.
8. You may now start testing the application.

Currently, the prototype uses a local database so all comments must be made and viewed within the same browser and computer. You can test multiple users commenting by logging in and out of different YouTube accounts to assign different usernames to the comments. By default, if you aren't logged in, the default username is "Anonymous". Also note that the comments database only reloads upon refresh, so if you want to update the frequency graph and comments after posting your own comments you will need to refresh the page.

Thanks!