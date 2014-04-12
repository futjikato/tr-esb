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

In these first early development versions the server will always anser in JSON format thus is should be possible to get the responses in diffrent formats. Because of that you should add the Accept header as well.

```
Accept: application/json
```

Service Discovery
-----------------

#### Servcie first request to ESB

The service send the following request to the ESB.

```
GET /discovery HTTP/1.1
Host: example.com:8898
Service-Key: EXAMPLE-SERVICE
Esb-Access-Token: XXXXXXXXXXXXXXXXX
Accept: application/json
```
The ESB Respons

```
HTTP/1.1 200 OK
Date: Sat, 12 Apr 2014 12:37:29 GMT
Connection: keep-alive
Content-Length: 33
Content-Type: application/json

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