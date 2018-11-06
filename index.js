const basetime = Date.now();

const ipfsconfig = {
  config: {
    Addresses: {
      Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']
    }
  },
  relay: {enabled: true, hop: {enabled: true}},
  EXPERIMENTAL: {dht: true}
};

const portname = '/chat/1.0.0';

const fcids = [
  ['QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF', 'image/gif'], // cats
  ['QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D', 'image/svg+xml'], // wiki logo
];

const dhtcid = 'QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF';
const txtcid = 'QmXXtHtDwXFbCTzMDjacZxid6CCNY4m5oM6MgBhyPVT3Tr';

window.onload = () => {
  init().then(
    res => log('done'),
    err => log(err && err.stack || err));
};

async function init() {
  let qargs = parseQueryArgs();
  log('query args:', JSON.stringify(qargs));
  
  log('loading the ipfs script');
  await loadScript(qargs.ipfs);
  
  log('starting ipfs node: ' + JSON.stringify(ipfsconfig));
  window.IPFS = window.IPFS || window.Ipfs;
  window.ipfs = new IPFS(ipfsconfig);
  
  await new Promise(resolve => ipfs.on('ready', resolve));
  let {version} = await ipfs.version();
  log('ipfs.version: ' + version);
  
  let self = await ipfs.id();
  log('ipfs.id: ' + self.id);
  
  window.libp2p = ipfs._libp2pNode;

  for (let [fcid, mime] of fcids) {
    log('ipfs.files.get ' + fcid);
    let files = await ipfs.files.get(fcid);
    log('ipfs.files.get -> ' + files);

    for (let file of files) {
      let data = file.content;
      if (data) {
        let blob = new Blob([data], {type: mime});
        let url = URL.createObjectURL(blob);
        document.body.innerHTML += `<img src="${url}">`;
      }
    }
  }
    
  log('ipfs.files.get ' + txtcid);
  for (let data of await ipfs.files.get(txtcid))  
    log('ipfs.files.get -> ' + String.fromCharCode(...data.content));
  
  log('ipfs.dht.findprovs', dhtcid);
  ipfs.dht.findprovs(dhtcid).then(peers => {
    let ids = peers.map(p => p.id.toB58String());
    log('ipfs.dht.findprovs ->', JSON.stringify(ids));
  });
  
  log('libp2p.handle:', portname);
  libp2p.handle(portname, (protocol, conn) => {
    log(portname, protocol, conn);
  });
  
  let multiaddrs = libp2p.peerInfo.multiaddrs.toArray().map(ma => ma + '');
  log('libp2p.peerInfo.multiaddrs:', JSON.stringify(multiaddrs));
  
  if (!qargs.peer) {
    log('?peer=[...] is not set, so not dialing');
  } else {
    log('libp2p.dial', qargs.peer, portname);
    libp2p.dialProtocol(qargs.peer, portname, (err, conn) => {
      if (err) {
        log('libp2p.dial ->', err);  
      } else {
        log('libp2p.dial ->', conn);  
      }      
    });
  }
}

function loadScript(ver = 'latest') {
  return new Promise((resolve, reject) => {
    let url = ver.endsWith('.js') ? ver : `https://unpkg.com/ipfs@${ver}/dist/index.js`;
    log('script: ' + url);
    let script = document.createElement('script');
    script.src = url;
    script.onerror = reject;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

function parseQueryArgs() {
  let res = {};
  let str = location.search.slice(1);
  
  for (let kvpair of str.split('&')) {
    let [key, val] = kvpair.split('=');
    res[key] = val;
  }
  
  return res;
}

function log(...args) {
  let str = args.join(' ');
  let time = (Date.now() - basetime)/1000;
  let tstr = time.toFixed(1);
  while (tstr.length < 5)
    tstr = '0' + tstr;
  str = '[' + tstr + 's] ' + str;
  console.log(str);
  document.body.innerHTML += '<p>' + str;
}
