const basetime = Date.now();

const config = {
  relay: {enabled: true, hop: {enabled: true}},
  Addresses: {Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']},
  EXPERIMENTAL: {pubsub: true},
};

const fcids = [
  ['QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF', 'image/gif'], // cats
  ['QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D', 'image/svg+xml'], // wiki logo
];

const txtcid = 'QmXXtHtDwXFbCTzMDjacZxid6CCNY4m5oM6MgBhyPVT3Tr';

window.onload = () => {
  init().then(
    res => log('done'),
    err => log(err && err.stack || err));
};

async function init() {
  log('loading the ipfs script');
  await loadScript();
  
  log('starting ipfs node: ' + JSON.stringify(config));
  window.IPFS = window.IPFS || window.Ipfs;
  window.ipfs = new IPFS({ config });
  
  await new Promise(resolve => ipfs.on('ready', resolve));
  let {version} = await ipfs.version();
  log('ipfs.version: ' + version);

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
