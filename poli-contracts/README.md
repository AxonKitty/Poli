# Poli Prediction Market - Smart Contracts

智能合约部分，使用 Hardhat 开发框架。

## 项目结构

```
poli-contracts/
├── contracts/           # Solidity 合约
│   └── PredictionMarket.sol
├── scripts/            # 部署脚本
│   └── deploy.ts
├── test/              # 测试文件
├── hardhat.config.ts  # Hardhat 配置
├── package.json
└── .env.example       # 环境变量示例
```

## 安装依赖

```bash
npm install
```

## 环境配置

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

需要配置的变量：

- `PRIVATE_KEY`: 部署账户的私钥
- `MUMBAI_RPC_URL`: Mumbai 测试网 RPC
- `POLYGON_RPC_URL`: Polygon 主网 RPC
- `POLYGONSCAN_API_KEY`: Polygonscan API Key（用于验证合约）

## 编译合约

```bash
npm run compile
```

## 测试合约

```bash
npm run test
```

## 部署合约

### 部署到 Mumbai 测试网

```bash
npm run deploy:mumbai
```

### 部署到 Polygon 主网

```bash
npm run deploy:polygon
```

## 验证合约

部署后，使用以下命令验证合约：

```bash
# Mumbai
npm run verify:mumbai <合约地址> <USDC地址>

# Polygon
npm run verify:polygon <合约地址> <USDC地址>
```

## 合约功能

### PredictionMarket.sol

预测市场主合约，支持：

- ✅ 创建市场
- ✅ 下注（YES/NO）
- ✅ 结算市场
- ✅ 领取奖金
- ✅ 查询市场信息
- ✅ 查询用户持仓

### 主要函数

**创建市场**

```solidity
function createMarket(string memory _question, uint256 _endTime) external returns (uint256)
```

**下注**

```solidity
function placeBet(uint256 _marketId, bool _outcome, uint256 _amount) external
```

**结算市场**（仅 owner）

```solidity
function resolveMarket(uint256 _marketId, bool _outcome) external
```

**领取奖金**

```solidity
function claimWinnings(uint256 _marketId) external
```

**查询函数**

```solidity
function getMarketInfo(uint256 _marketId) external view returns (...)
function getUserPosition(uint256 _marketId, address _user) external view returns (...)
function getUserBets(address _user) external view returns (uint256[] memory)
function calculatePotentialWinnings(uint256 _marketId, address _user) external view returns (uint256)
```

## 部署后操作

1. **记录合约地址**
   - 部署成功后会显示合约地址
   - 复制这个地址

2. **更新前端配置**
   - 打开 `../poli-frontend/lib/contracts/addresses.ts`
   - 将合约地址更新到对应网络的配置中

3. **验证合约**
   - 在 Polygonscan 上验证合约
   - 这样用户可以直接在区块浏览器上查看合约代码

## 安全注意事项

⚠️ **重要提示**：

- 不要将 `.env` 文件提交到 Git
- 私钥要妥善保管
- 测试网先充分测试后再部署主网
- 主网部署前进行安全审计

## 相关链接

- [Hardhat 文档](https://hardhat.org/docs)
- [OpenZeppelin 合约](https://docs.openzeppelin.com/contracts)
- [Polygon 文档](https://docs.polygon.technology/)
- [Polygonscan](https://polygonscan.com/)
