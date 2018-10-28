const basetime = Date.now();

window.onload = () => {
  init().catch(err => {
     log(err && err.stack || err);
  });
};

async function init() {
  log('initializing ipfs');
  await loadScript();
  
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
    },
    relay: {
      enabled: true,
      hop: {
        enabled: true
      }
    }    
  });
  
  await new Promise(resolve => ipfs.on('ready', resolve));
  let {version} = await ipfs.version();
  log('ipfs.version: ' + version);
  
  let fcids = [
    'QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF', // cats
    'QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D', // wiki logo
  ];

  for (let fcid of fcids) {
    log('ipfs.files.get ' + fcid);
    let files = await ipfs.files.get(fcid);
    log('ipfs.files.get -> ' + files);

    for (let file of files) {
      let data = file.content;
      if (data) {
        let blob = new Blob([data], {type: 'image/jpeg'});
        let url = URL.createObjectURL(blob);
        document.body.innerHTML += `<img src="${url}">`;
      }
    }
  }
}

function loadScript() {
  return new Promise((resolve, reject) => {
    let ver = location.search.slice(1) || 'latest';
    let url = `https://unpkg.com/ipfs@${ver}/dist/index.js`;
    log('script: ' + url);
    let script = document.createElement('script');
    script.src = url;
    script.onerror = reject;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

function log(str) {
  let time = (Date.now() - basetime)/1000;
  let tstr = time.toFixed(1);
  while (tstr.length < 5)
    tstr = '0' + tstr;
  str = '[+' + tstr + 's] ' + str;
  console.log(str);
  document.body.innerHTML += '<p>' + str;
}
