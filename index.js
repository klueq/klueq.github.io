window.onload = () => {
  init().catch(err => {
     log(err);
  });
};

async function init() {
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
  await new Promise(resolve => ipfs.on('ready', resolve));
  let {version} = await ipfs.version();
  log('ipfs.version: ' + version);
  
  log('window.ipfs is ready');
  log('ipfs.files.get ' + fcid);
  
  let files = await ipfs.files.get(fcid);
  log('ipfs.files.get -> ' + files);
  
  let blob = new Blob([files[1].content], {type: 'image/gif'});
  let url = URL.createObjectURL(blob);
  document.body.innerHTML += `<img src="${url}">`;
}

function log(str) {
  console.log(str);
  document.body.innerHTML += '<p>' + str;
}
