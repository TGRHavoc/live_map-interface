---
layout: default
title: Frequently Asked Questions
nav_order: 999
parent: LiveMap Interface
---

# Frequently Asked Questions <!-- omit in toc -->

- [Server Not Connecting/Showing Up](#server-not-connectingshowing-up)
- [Not Able to Communicate with the FiveM server](#not-able-to-communicate-with-the-fivem-server)
- [Adding blips using a web request](#adding-blips-using-a-web-request)
- [Error Getting Config, Cannot load map! Multiple Choices](#error-getting-config-cannot-load-map-multiple-choices)
- [Localhost Not Working](#localhost-not-working)
- [Unable to Display Livemap when using HTTPS](#unable-to-display-livemap-when-using-https)
- [Error with Socket Connection](#error-with-socket-connection)
- [Interface Not Connecting to Server](#interface-not-connecting-to-server)
- [Blips Not Appearing](#blips-not-appearing)


## Server Not Connecting/Showing Up

- If your website is using HTTPS then, you need to set up a reverse proxy for the blip URL and the socket port in order for it to work.
If you don't know how to do this, just make the website use HTTP. 
- If the issue persists, make sure you have a "map" array in the config. See [config.example.json](https://github.com/TGRHavoc/live_map-interface/blob/master/config.example.json).

Additionally, if you wanted to use your own images, you would need the YTD files then, you can get a developer to run the extract_png.py file located [here](https://github.com/TGRHavoc/live_map-interface/tree/master/images/tiles).

## Not Able to Communicate with the FiveM server 

- Make sure the resource is actually starting on the server. Usually, setting the debug to debug or something should give you enough information to see if it's starting.
- If it is starting and listening, make sure it's allowed through the firewall.

## Adding blips using a web request

No, but you can add then manually. You can either go to each place and and do the command in game or, edit the json file manually.

## Error Getting Config, Cannot load map! Multiple Choices

Probably means that the user's cannot access /config.json on your webserver.
Make sure you can access it by going to http://{{WEB_SERVER}}/config.json and making sure it shows your config file.

## Localhost Not Working

You need to use the server's public IP in the config.json file for it to work for other users.

## Unable to Display Livemap when using HTTPS

1. It's not possible for the resource to make a secure connection to FiveM. Simply, uninstall the resource. 
2. If you do, then lookup on Google for "set up reverse proxy in <webserver>". 
3. Substitute with the webservers name. And to get the websocket running securely as well, just change the query to "set up websocket revserse proxy in <webserver>".

## Error with Socket Connection

Most likely a network issue. Make sure you have correctly opened your ports for the websocket connection. 

## Interface Not Connecting to Server

Port forward (if needed), allow though firewall and set the config to use the FiveM server's public IP address.

## Blips Not Appearing

This is most likely because you haven't done the /blips generate command in game (you need to be an admin).

