# 比特币白皮书阅读有感

- 为了解决去中心化这个必备特性，比特币使用了各种方法来保障这个特性。尤其是区块的设计，使用前块的Hash来将数据块串联起来，是个非常智慧的解决办法，让数据的一致性变得方便处理（无论是校验还是继续写入），这解决了不同网络节点之间的高效数据同步这个大问题。

- 在有完整数据记录的前提下，UXTO也就具备了基础，可以用所有的记录来对用户的余额进行计算，这样的好处是，对于余额的值，信任度是极高的。而后来的其他链，就像Substrate，余额是要信赖服务器的state记录的，信任度就要降低了一些，把从仅依赖区块数据，到依赖节点服务器的可靠运行。

- 白皮书地址：[https://bitcoin.org/files/bitcoin-paper/bitcoin_zh_cn.pdf](https://bitcoin.org/files/bitcoin-paper/bitcoin_zh_cn.pdf)