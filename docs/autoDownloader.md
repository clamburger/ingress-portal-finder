Automatic Downloader
======================

As of 1.0.3 it's possible to semi-autonomously export portal data for a given area. For example, you can set a cronjob or similar to get portal data every 24 hours and then analysis it later.

How it Works
----------------------
Firstly, you need the bounds of the area you want. You can get these by looking up the area normally and noting down the coordinate pairs. Once you have your bounds, you can then load the following URL (this can be done from the command line if you specify the chrome executable), adding your bounds on the end.

`chrome-extension://kpmfdegmoifaejdlmackcfbdhnjmiflf/view.html?download=`

Here's an example for Adelaide:

`chrome-extension://kpmfdegmoifaejdlmackcfbdhnjmiflf/view.html?download=-35.346390,137.775985,-34.508714,139.423934`

Loading this URL will:

1. Automatically open the Intel Map if needed
2. Immediately start searching using the specified bounds
3. Once loaded, all portals found will be saved to a local JSON file using the HTML5 [FileSystem API](http://www.html5rocks.com/en/tutorials/file/filesystem/). 

When you open the extension next there will be a message near the top of the window notifying you of the new download. You can then save the JSON file normally to anywhere on your machine, after which you can delete the generate files within the extension using the `[remove all]` link.

Limitations
----------------------
Following this method will open Chrome if you don't already have it open, and may interrupt you if you're using the machine at the time. Whilst we are able to close the extension window afterwards, we can't close the Intel Map, which means it'll hang around until you close it yourself.

You can't call the downloader more than once a minute; the latter download will overwrite the earlier one.