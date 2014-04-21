ESB Communication Protocol
==================================

The base protocol for all communication is HTTP.

Service
-------

The service needs to include its service key in the HTTP header for every request.

```
Service-Key: XXXXXXXXXXX
```

In addition all rqeuests to the ESB must include the ESB access token.

```
Esb-Access-Token: XXXXXXXXXXXXXXXXX
```

In these first early development versions the server will always answer in JSON format thus is should be possible to get the responses in different formats. Because of that you should add the Accept header as well.

```
Accept: application/json
```

Service Discovery
-----------------

#### Servcie first request to ESB

The service send the following request to the ESB.

```
POST /discovery HTTP/1.1
Host: esb-server.com:8898
Service-Key: EXAMPLE-SERVICE
Esb-Access-Token: XXXXXXXXXXXXXXXXX
Accept: application/json
Content-Type: application/json
Content-Length: 39

{
	"ip": "127.0.0.1",
	"port": "8898"
}
```
The ESB Respons

```
HTTP/1.1 200 OK
Date: Sat, 12 Apr 2014 12:37:29 GMT
Connection: keep-alive
Content-Type: application/json
Content-Length: 34

{
	"services": ["OTHER-SERVICE"]
}
```
Or in case the service could not be registered

```
HTTP/1.1 403 Invalid access token
Date: Sat, 12 Apr 2014 12:37:29 GMT
Connection: keep-alive
```