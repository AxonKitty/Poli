# 部署指南

## 前端部署到 Vercel

### 方法 1: 一键部署

1. 点击 Vercel 部署按钮
2. 授权 Vercel 访问你的 GitHub
3. 选择 `poli-frontend` 目录
4. 配置环境变量
5. 部署

### 方法 2: 手动部署

#### 1. 准备工作

```bash
# 确保项目已推送到 GitHub
cd poli-frontend
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Vercel 配置

登录 [Vercel](https://vercel.com)，导入项目：

1. 点击 "Add New Project"
2. 选择你的 GitHub 仓库
3. **重要**: 设置 Root Directory 为 `poli-frontend`
4. Framework Preset: Next.js
5. 配置环境变量

#### 3. 环境变量

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

#### 4. 部署

点击 "Deploy" 按钮，等待部署完成。

### 自定义域名

1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的域名
3. 配置 DNS 记录

## 智能合约部署到 Polygon

### 1. 准备环境

```bash
cd poli-contracts
npm install
cp .env.example .env
```

### 2. 配置 .env

```env
PRIVATE_KEY=your_private_key_here
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 3. 部署到测试网

```bash
# Mumbai 测试网
npm run deploy:mumbai
```

记录输出的合约地址。

### 4. 验证合约

```bash
npx hardhat verify --network mumbai <合约地址> <USDC地址>
```

### 5. 部署到主网

```bash
# 确保钱包有足够的 MATIC
npm run deploy:polygon
```

### 6. 更新前端配置

编辑 `poli-frontend/lib/contracts/addresses.ts`：

```typescript
export const CONTRACTS = {
  polygon: {
    predictionMarket: '0xYourMainnetAddress',
    // ...
  },
  polygonMumbai: {
    predictionMarket: '0xYourTestnetAddress',
    // ...
  },
}
```

提交并推送更改，Vercel 会自动重新部署。

## 测试清单

### 前端测试

- [ ] 页面加载正常
- [ ] 钱包连接功能
- [ ] 网络切换提示
- [ ] USDC 余额显示
- [ ] 响应式布局

### 合约测试

- [ ] 合约部署成功
- [ ] 在 Polygonscan 上验证
- [ ] 创建测试市场
- [ ] 测试下注功能
- [ ] 测试领取奖金

## 故障排除

### Vercel 部署失败

**问题**: Build 失败
**解决**:

- 检查 `package.json` 依赖
- 确保 TypeScript 编译通过
- 查看 Vercel 构建日志

### 合约部署失败

**问题**: Gas 不足
**解决**:

- 确保钱包有足够的 MATIC
- 调整 gas price

**问题**: RPC 错误
**解决**:

- 更换 RPC URL
- 检查网络连接

## 监控和维护

### 前端

- 使用 Vercel Analytics 监控性能
- 设置错误追踪（如 Sentry）
- 定期检查依赖更新

### 合约

- 监控合约事件
- 定期检查余额
- 备份私钥

## 安全建议

- ✅ 不要将私钥提交到 Git
- ✅ 使用环境变量存储敏感信息
- ✅ 主网部署前进行安全审计
- ✅ 设置合约 owner 为多签钱包
- ✅ 定期备份数据
