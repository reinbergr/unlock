
import net from "net";

const server = net.createServer();
const PROXY_HOST = "0.0.0.0";
const PROXY_PORT = 8124;

server.on("connection", clientToProxySocket => {

  // retrieve the starting packet
  clientToProxySocket.once("data", data => {

    const isTLSConnection = data.toString().indexOf("CONNECT") !== -1;
    let serverPort = 80;
    let serverAddress;

    if (isTLSConnection) {
      // Port changed if connection is TLS
      [serverAddress, serverPort] = data.toString().split("CONNECT ")[1].split(" ")[0].split(":");
    } else {
      serverAddress = data.toString().split("Host: ")[1].split('\r\n')[0];
    }

    const proxyToServerSocket = net.createConnection({
      host: serverAddress,
      port: serverPort
    }, () => {

      console.log(`[proxy->${serverAddress}]`);
      
      if (isTLSConnection) {
        clientToProxySocket.write("HTTP/1.1 200 OK\r\n\n");
      } else {
        proxyToServerSocket.write(data);
      }

      clientToProxySocket.pipe(proxyToServerSocket);
      proxyToServerSocket.pipe(clientToProxySocket);
    });

    proxyToServerSocket.on("error", err => console.log(`[proxy->${serverAddress}]`, err));
  });

  clientToProxySocket.on("error", err => console.log("[client->proxy]", err));
});

server.on("error", err => {throw err});
server.on("close", () => console.log("[client->proxy] connection closed"));
server.listen(PROXY_PORT, PROXY_HOST, () => console.log(`Proxy running at http://${PROXY_HOST}:${PROXY_PORT}`));