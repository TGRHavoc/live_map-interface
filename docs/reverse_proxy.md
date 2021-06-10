---
layout: default
title: Reverse Proxy
nav_order: 1
parent: Configuration
grand_parent: LiveMap Interface
---
{% raw %}
# Reverse Proxy <!-- omit in toc -->

If you want to set up **secure** website for your LiveMap interface, you will need to use a reverse proxy.
Below are some examples of how you can set up the reverse proxy for some of the more popular webservers.

The examples below will allow you to add the following [reverse proxy object](config.md#reverse-proxy-object) to your config.

```json
"reverseProxy": {
    "blips": "https://{{YOUR_WEBSITE}}/blips",
    "socket": "wss://{{YOUR_WEBSITE}}/ws"
}
```

Where `{{YOUR_WEBSITE}}` is the URL for your LiveMap interface.

In the examples, please make sure you replace the variables with their _real_ values.

- `{{FIVEM_IP}}` = The public IP for your FiveM server.
- `{{SOCKET_PORT}}` = The configured [socket port for LiveMap](https://docs.tgrhavoc.co.uk/livemap-resource/config/#socket_port)
  
## Examples: <!-- omit in toc -->

- [Apache](#apache)
- [NGINX](#nginx)
- [IIS](#iis)
- [Others](#others)


## Apache

In your `VirtualHost` block for your website, you will need to add the following:

```conf
ProxyRequests on
RequestHeader set X-Forwarded-Proto "http"	
ProxyPass /blips http://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips
ProxyPassReverse /blips http://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips

RewriteEngine on
RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
RewriteCond %{HTTP:CONNECTION} ^Upgrade$ [NC]
RewriteRule /ws ws://{{FIVEM_IP}}:{{SOCKET_PORT}}/%{REQUEST_URI} [P]
```

So the full block would look like:
```conf
<VirtualHost *>
  ServerName myserver.local
  
    ProxyRequests on
    RequestHeader set X-Forwarded-Proto "http"	
    ProxyPass /blips http://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips
    ProxyPassReverse /blips http://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips

    RewriteEngine on
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$ [NC]
    RewriteRule /ws ws://{{FIVEM_IP}}:{{SOCKET_PORT}}/%{REQUEST_URI} [P]
</VirtualHost>
```

## NGINX

Inside your `server` block for your website you will need to add
```conf
location /blips {
    proxy_pass http://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips;
}

location /ws {
    proxy_pass http://{{FIVEM_IP}}:{{SOCKET_PORT}}/;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

The full block would look like:
```conf
server {
    listen              443 ssl;
    listen              [::]:443 ssl;

    server_name         myserver.local;
    root                /some/location/for/livemap-interface;
    index index.html;

    location /blips {
        proxy_pass http://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips;
    }

    location /ws {
        proxy_pass http://{{FIVEM_IP}}:{{SOCKET_PORT}}/;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## IIS

Inside your `web.config` file you will need to add:

```conf
<rewrite>
    <rules>
        <rule name="WebsocketRule" stopProcessing="true">
            <match url="/ws" />
            <action type="Rewrite" url="ws://{{FIVEM_IP}}:{{SOCKET_PORT}}/" />
        </rule>
        <rule name="BlipRule" stopProcessing="true">
            <match url="/blips" />
            <action type="Rewrite" url="http://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips" />
        </rule>
    </rules>
</rewrite>
```

The full file would look like:
```conf
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="WebsocketRule" stopProcessing="true">
                    <match url="/ws" />
                    <action type="Rewrite" url="ws://{{FIVEM_IP}}:{{SOCKET_PORT}}/" />
                </rule>
                <rule name="BlipRule" stopProcessing="true">
                    <match url="/blips" />
                    <action type="Rewrite" url="{C:1}://{{FIVEM_IP}}:{{SOCKET_PORT}}/blips" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

Note: You may need to install [URL Rewrite](http://www.iis.net/downloads/microsoft/url-rewrite) for IIS first.


## Others

If your webserver isn't listed here them, unfortunately your best bet is to research how to set up a reverse proxy on your webserver.
After you have got yours working and, want to help other's with the same webserver, why don't you [edit this page on Github](https://github.com/TGRHavoc/live_map-interface/edit/develop/docs/reverse_proxy.md) with the information needed?

{% endraw %}
