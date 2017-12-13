# fivem-webinterface

This is the Web Interface for the FiveM addon [live_map](https://github.com/TGRHavoc/live_map).

<!-- TODO: Probably add some links or sommat to showcase it (e.g. http://illusivetea.me/livemap/)-->

## Prerequisites

In order to have this working, it is advised that you already have a webserver running and correctly configured.
You will also need to install [live_map](https://github.com/TGRHavoc/live_map) on your FiveM server and have it configured.

## How to install

- Download the [latest version](https://github.com/TGRHavoc/live_map-interface/archive/master.zip) and the [images (225 MB)](https://github.com/TGRHavoc/live_map-interface/releases/download/v0.1/map.images.zip).

- Extract the web interface to your website.

- Create a new directory for the map images (e.g. `images/map/`)

- Extract the images to the map directory (e.g. `images/map/`)

- Configure the interface by changing the values in `utils/config.php`

## Configuration

### utils/config.php
Pretty much everything can be configured inside the `utils/config.php` file.
The variables have a brief description so you can get an idea of what values need to be where.

### utils/server.php
So, this is a new file that you can configure to add more servers to the livemap.
If you have 3 servers you want to show, this is your config file.

The only thing you want to change is the `$servers` variable on line 32.
I'll try and give a detailed description on how you can use this below, hopefully you'll understand :)

This array follows a structure and you will need to follow the structure inorder to get multiple servers working.

The first thing the array wants, is a `"name" => array()` added to it.
"name" will be the name of the server shown to the user for easy identification.
The `array()` will be another array containing the information of the server.
If you don't supply any information (e.g. just use `array()`) then, it will default back to the values inside of the `utils/config.php` file.

The `array()` for the server can contain four key-pairs.
Below is a table showing what the array wants and a brief description of what the value should be.


| Name        |  Description |
| ----------- | ------------ |
| ip          | This should be the public IP for the server. Defined in `utils/config.php` as `$fivemIP` |
| fivemPort   | This should be the FiveM port for the server. Defined in `utils/config.php` as `$fivemPort` |
| socketPort  | This should be the socket port for the server. Defined in `utils/config.php` as `$socketPort` |
| liveMapName | This should be the name of the livemap resource on that server. Defined in `utils/config.php` as `$liveMapName` |

#### Examples
If you have 3 servers running on the default IP (defined in `utils/config.php`)
```php
private static $servers = array(
    "Server 1" => array(
        "fivemPort" => "30120",
        "socketPort" => "30130",
    ),
    "Server 2" => array(
        "fivemPort" => "30121",
        "socketPort" => "30131",
    ),
    "Server 3" => array(
        "fivemPort" => "30122",
        "socketPort" => "30131",
    )
);
```

Or, if you have different servers on different IPs but, use the same ports
```php
private static $servers = array(
    "Server 1" => array(
        "ip" => "127.0.0.1"
    ),
    "Server 2" => array(
        "ip" => "192.168.0.1"
    ),
    "Server 3" => array(
        "ip" => "192.168.10.1"
    )
);
```

Or, a mix of both
```php
private static $servers = array(
    "Server 1" => array(
        "ip" => "127.0.0.1",
        "fivemPort" => "30121",
        "socketPort" => "4040"
    ),
    "Server 2" => array(
        "ip" => "192.168.0.1"
    ),
    "Server 3" => array(
        "ip" => "192.168.10.1",
        "socketPort" => "20394",
        "liveMapName" => "some_shit_map"
    )
);

```

Below is the code I have running on the [demo map](http://map.tgrhavoc.me)
```php
private static $servers = array(
    "Havoc's Test server (tgrhavoc.me)" => array(),
    "This is an example of another server (it doesn't exist)" => array()
);
```


## Thanks

Special thanks to the people who helped me test this, flushing out any bugs that managed to sneak in.

- [AciD](https://github.com/xlxAciDxlx)
- [KjayCopper](https://github.com/KjayCopper)
- [IllusiveTea](https://github.com/IllusiveTea)
- [Tom Grobbe](https://github.com/TomGrobbe)
