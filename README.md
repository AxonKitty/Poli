# Poli - Political Prediction Market

完整的去中心化预测市场平台，包含前端应用和智能合约。

## 项目结构

```
Poli/
├── poli-frontend/    # Next.js 前端应用
└── poli-contracts/   # Solidity 智能合约
```

## 快速开始

### 前端

```bash
cd poli-frontend
npm install
npm run dev
```

详细说明：[poli-frontend/README.md](./poli-frontend/README.md)

### 智能合约

```bash
cd poli-contracts
npm install
npm run compile
npm run deploy:mumbai
```

详细说明：[poli-contracts/README.md](./poli-contracts/README.md)

## 功能特性

- 🔗 **钱包连接** - MetaMask, Coinbase Wallet, WalletConnect
- 🌐 **Polygon 网络** - 主网和测试网支持
- 💰 **USDC 支付** - 稳定币下注和结算
- 📊 **实时数据** - 市场价格和交易动态
- 🎯 **智能合约** - 去中心化预测市场
- 👥 **交易者分析** - 11种标签分类系统

## 技术栈

- **前端**: Next.js 14, TypeScript, Wagmi, RainbowKit
- **合约**: Solidity, Hardhat, OpenZeppelin
- **区块链**: Polygon, USDC

## 文档

- [前端 README](./poli-frontend/README.md)
- [合约 README](./poli-contracts/README.md)
- [Web3 使用指南](./docs/web3_usage_guide.md)
- [项目结构说明](./docs/project_structure.md)

## 部署

### Vercel (前端)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AxonKitty/Poli/tree/main/poli-frontend)

### Polygon (合约)

```bash
cd poli-contracts
npm run deploy:polygon
```

## 许可证

MIT License
