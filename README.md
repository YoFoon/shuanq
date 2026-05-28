# shuanq.top

"集体栓Q"病毒式落地页 —— 访客打开看到滚动的栓Q语录和全站计数器，一键提交自己的栓Q瞬间。

## 技术栈

- **框架**: Astro 5 (SSR) + React
- **数据库**: Turso (LibSQL)
- **部署**: Node.js standalone

## 本地开发

```bash
npm install
npm run dev
```

需要配置环境变量：

```env
TURSO_DATABASE_URL=libsql://xxx
TURSO_AUTH_TOKEN=xxx
```

## 构建

```bash
npm run build
```

产物在 `dist/` 目录，启动入口为 `dist/server/entry.mjs`。

## 部署（宝塔面板）

1. 上传项目到服务器
2. 安装依赖：`npm install --production`
3. 构建：`npm run build`
4. PM2 管理器添加项目，启动文件填 `dist/server/entry.mjs`
5. 环境变量配置：

```env
HOST=0.0.0.0
PORT=4321
TURSO_DATABASE_URL=libsql://xxx
TURSO_AUTH_TOKEN=xxx
```

6. 网站反向代理指向 `http://127.0.0.1:4321`

## API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/quotes` | GET | 获取语录列表 |
| `/api/quotes` | POST | 提交新语录 |
| `/api/count` | GET | 获取栓Q总计数 |
| `/api/shuanq` | POST | 计数 +1 |
