# Frequently Asked Questions

- [Server Not Connecting/Showing Up](#server-not-connectingshowing-up)
- [Not able to communicate with the FiveM server](#not-able-to-communicate-with-the-fivem-server)


### Server Not Connecting/Showing Up

- If your website is using HTTPS then, you need to set up a reverse proxy for the blip URL and the socket port in order for it to work.
If you don't know how to do this, just make the website use HTTP. 
- If the issue persists, make sure you have a "map" array in the config. See [config.example.json](https://github.com/TGRHavoc/live_map-interface/blob/master/config.example.json).

Additionally, if you wanted to use your own images, you would need the YTD files then, you can get a developer to run the extract_png.py file located [here](https://github.com/TGRHavoc/live_map-interface/tree/master/images/tiles).

### Not able to communicate with the FiveM server 
- Make sure the resource is actually starting on the server. Usually, setting the debug to debug or something should give you enough information to see if it's starting.
- If it is starting and listening, make sure it's allowed through the firewall.


    

