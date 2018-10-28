window.IPFS = window.IPFS || window.Ipfs;
window.ipfs = new IPFS;

ipfs.on('ready', () => {
  console.log('window.ipfs is ready');
});
