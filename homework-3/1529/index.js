const { ApiPromise, WsProvider } = require('@polkadot/api');
const { mnemonicGenerate, mnemonicToMiniSecret, ed25519PairFromSeed, encodeAddress } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');

async function createAccount() {
  const mnemonic = mnemonicGenerate();
  const seed = mnemonicToMiniSecret(mnemonic);
  const keypair = ed25519PairFromSeed(seed);
  const address = encodeAddress(keypair.publicKey);

  console.log(`助记词: ${mnemonic}`);
  console.log(`地址: ${address}`);
}

async function checkBalance(api, address) {
  if (!address) {
    console.error('请提供一个地址');
    return;
  }

  const { data: { free } } = await api.query.system.account(address);
  console.log(`${address} 的余额: ${free.toHuman()}`);
}

async function transfer(api, fromAddress, toAddress, amount) {
  if (!fromAddress || !toAddress || !amount) {
    console.error('请提供发送方地址、接收方地址和转账金额');
    return;
  }

  // 注意: 这里需要安全地获取发送方的私钥或助记词
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = keyring.addFromUri('scout crystal produce repeat sun issue burger embody balance manage vibrant prefer');

  try {
    // 检查 API 结构
    if (!api.tx.balances || typeof api.tx.balances.transferKeepAlive !== 'function') {
        console.error('API 结构不正确，无法找到转账函数');
        console.log('可用的模块:', Object.keys(api.tx));
        if (api.tx.balances) {
        console.log('balances 模块中的可用函数:', Object.keys(api.tx.balances));
        }
        return;
    }
    
    const transfer = api.tx.balances.transferKeepAlive(toAddress, amount);
    const hash = await transfer.signAndSend(sender);
    console.log(`转账交易已提交，交易哈希: ${hash.toHex()}`);
  } catch (error) {
    console.error('转账失败:', error);
  }
}

async function main() {
  const provider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider });

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'create-account':
        await createAccount();
        break;
      case 'check-balance':
        await checkBalance(api, args[1]);
        break;
      case 'transfer':
        await transfer(api, args[1], args[2], args[3]);
        break;
      default:
        console.log('无效命令。使用 "create-account"、"check-balance <地址>" 或 "transfer <发送方地址> <接收方地址> <金额>"。');
    }
  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    await api.disconnect();
  }
}

main().catch(console.error);