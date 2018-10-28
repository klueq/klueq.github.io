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

ipfs.on('ready', () => {
  console.log('window.ipfs is ready');
});
