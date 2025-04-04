# srsc-kv-d1-plan

这是一个基于 Cloudflare Workers 和 Hono 构建的简单文件存储服务，使用 Cloudflare KVNamespace 进行数据持久化。

## 功能

*   **文件上传**: 通过 `/upload` 端点上传文件，文件内容和元数据（文件名、大小）将被存储在 KVNamespace 中。
*   **文件列表**: 通过 `/getAllFilesInfo` 端点获取所有已上传文件的信息列表。

## 技术栈

*   [Cloudflare Workers](https://workers.cloudflare.com/)
*   [Hono](https://hono.dev/) - 一个用于 Cloudflare Workers、Deno 和 Bun 的 Web 框架
*   [TypeScript](https://www.typescriptlang.org/)
*   [Cloudflare KVNamespace](https://developers.cloudflare.com/workers/runtime-apis/kv/) - 用于存储文件数据和元数据

## API 端点

### `POST /upload`

上传文件。请求体应为 JSON 格式，包含以下字段：

*   `name` (string): 文件名
*   `size` (number): 文件大小（字节）
*   `data` (string): 文件内容的 Base64 编码或其他字符串表示形式（具体取决于客户端如何发送）

**成功响应 (200 OK):**

```json
{
  "code": "200",
  "data": {
    "name": "example.txt",
    "size": 12345
  },
  "message": "File uploaded successfully"
}
```

**失败响应 (500 Internal Server Error):**

```json
{
  "error": "Failed to upload file"
}
```

### `GET /getAllFilesInfo`

获取所有已上传文件的信息列表。

**成功响应 (200 OK):**

```json
{
  "code": "200",
  "data": [
    { "name": "file1.txt", "size": 1024 },
    { "name": "image.png", "size": 51200 }
  ]
}
```

**失败响应 (500 Internal Server Error):**

```json
{
  "error": "Failed to retrieve files"
}
```

## 安装

1.  克隆仓库 (如果适用)
2.  安装依赖:
    ```bash
    npm install
    ```

## 本地开发

使用 Wrangler CLI 在本地运行 Worker:

```bash
npm run dev
# 或者
npm start
```

这将启动一个本地开发服务器。

## 测试

运行单元测试:

```bash
npm test
```

## 类型生成

为 Cloudflare 资源生成 TypeScript 类型:

```bash
npm run cf-typegen
```

## 部署

将 Worker 部署到 Cloudflare:

```bash
npm run deploy
```

确保你已经配置好了 `wrangler.jsonc` 文件，特别是 KVNamespace 的绑定 (`kvPan`)。