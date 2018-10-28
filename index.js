log('initializing ipfs');

window.IPFS = window.IPFS || window.Ipfs;
window.ipfs = new IPFS({
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  },  
  EXPERIMENTAL: {
    pubsub: true
  }
});

const fcid = 'QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF';

ipfs.on('ready', () => {
  log('window.ipfs is ready');
  log('ipfs.files.get ' + fcid);
  
  ipfs.files.get(fcid).then(
    res => log('ipfs.files.get -> ' + res),
    err => log('ipfs.files.get -> ' + err));
});

function log(str) {
  console.log(str);
  document.body.innerHTML += '<p>' + str;
}
