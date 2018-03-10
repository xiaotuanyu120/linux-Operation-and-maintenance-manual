---
title: hyperledger: 1.11.0 P2P网络架构
date: 2017-12-20 10:13:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger]
---
### hyperledger: 1.11.0 P2P网络架构

### 1. P2P网络架构
历史上，大多数应用程序使用中央服务器（或多个服务器）。 对于一个用户/客户端发送消息到网络中的另一个用户/客户端，请求必须被发送到集线器或中央服务器，然后中央服务器将其指向正确的计算机。

点对点（P2P）网络最早由Napster（以及后来的BitTorrent）广泛使用，并且由通过互联网直接相互连接的计算机系统组成，没有中央服务器。 节点们对维护网络所需的计算能力和存储做出了贡献。 P2P网络通常被认为比集中式网络更安全，因为它们不存在遭受单点攻击的情况，而基于服务器为基础的网络，如果中央服务器被成功攻击，则整个网络的安全性都会受到影响 。 因此，大公司投入大量的财力资源来巩固中央服务器，而世界经济论坛2016年全球风险报告估计，全球经济网络空间犯罪总成本为4450亿美元。

免许可P2P系统不需要一定数量的节点在线，而且通常速度较慢。 许可的P2P网络必须保证正常运行并且要求通信链路上的高质量服务。

### 2. 什么是对等网络，以及节点间如何就区块链上的内容达成一致？
区块链网络是一组非正式地以对等体系结构组织的计算机。
共识是对等体同步区块链上数据的过程。
有许多共识机制或算法。
一个是工作量证明POW。 另一个是股权证明POS。
还有经过时间的证明(proof of elapsed time)，以及简化的拜占庭容错。
比特币使用工作量证明，而以太坊目前使用工作证明，但正在向股权证明前进。
Hyperledger Sawtooth 使用经过时间的证明(proof of elapsed time)。