# AI 量表系统 MCP 服务验证和配置指南

## 📋 系统要求

- Node.js 18+
- npm 或 yarn
- qclaw 环境

## 🚀 步骤一：启动 MCP 服务

### 1. 启动 Next.js 开发服务器

```powershell
# 进入项目目录
cd "c:/Users/lishuaishuai/Desktop/AI量表系统"

# 启动开发服务器
npm run dev
```

服务将在 `http://localhost:3000` 启动。

### 2. 验证服务是否就绪

打开新的终端窗口，执行：

```powershell
# 测试主页
curl http://localhost:3000

# 测试 MCP 端点（GET - 建立 SSE 连接）
curl -N http://localhost:3000/api/mcp
```

预期输出：
```
event: endpoint
data: /api/mcp
```

### 3. 测试 MCP 功能

#### 方法 A：使用 PowerShell 测试

```powershell
# 1. 建立 SSE 连接并获取 Session ID
$sessionId = $null
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/mcp" -Method GET
$sessionId = $response.Headers["X-Session-Id"]
Write-Host "Session ID: $sessionId"

# 2. 初始化会话
$body = @{
    jsonrpc = "2.0"
    id = 1
    method = "initialize"
    params = @{}
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Session-Id" = $sessionId
}

Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -Body $body -Headers $headers

# 3. 获取工具列表
$body = @{
    jsonrpc = "2.0"
    id = 2
    method = "tools/list"
    params = @{}
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -Body $body -Headers $headers
```

#### 方法 B：使用 cURL 测试

```bash
# 1. 建立 SSE 连接（新终端）
curl -N http://localhost:3000/api/mcp

# 2. 初始化会话（新终端，替换 <SESSION_ID>）
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: <SESSION_ID>" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

# 3. 获取工具列表
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: <SESSION_ID>" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# 4. 调用工具
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: <SESSION_ID>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "recommend_scale",
      "arguments": {"symptoms": "转圈 不理人"}
    }
  }'
```

---

## 🔧 步骤二：配置 qclaw 环境

### 方法 A：创建 MCP 配置文件

创建文件：`c:/Users/lishuaishuai/.qclaw/mcp_servers.json`

```json
{
  "mcpServers": {
    "ai-scale-engine": {
      "url": "http://localhost:3000/api/mcp",
      "description": "AI 量表系统 - 提供 ABC 等医学量表的评估服务",
      "tools": [
        "recommend_scale",
        "get_scale_questions",
        "submit_and_evaluate"
      ]
    }
  }
}
```

### 方法 B：在 qclaw 配置中添加

如果 qclaw 使用主配置文件，添加以下内容：

```json
{
  "mcp": {
    "servers": {
      "ai-scale-engine": {
        "url": "http://localhost:3000/api/mcp",
        "enabled": true
      }
    }
  }
}
```

---

## ✅ 步骤三：验证 qclaw 调用能力

### 1. 检查 qclaw 是否识别 MCP

```python
# 在 qclaw 环境中执行
from qclaw import MCPManager

# 列出可用的 MCP 服务器
mcp = MCPManager()
servers = mcp.list_servers()
print(servers)
```

### 2. 测试调用

```python
# 调用推荐量表工具
result = mcp.call_tool(
    server="ai-scale-engine",
    tool="recommend_scale",
    arguments={"symptoms": "转圈 不理人"}
)
print(result)
```

---

## 🧪 完整测试脚本

创建文件 `test_mcp.py`：

```python
import requests
import json

# 配置
MCP_URL = "http://localhost:3000/api/mcp"
SESSION_ID = None

def init_session():
    """初始化会话"""
    global SESSION_ID
    
    # 建立 SSE 连接
    response = requests.get(MCP_URL, stream=True)
    SESSION_ID = response.headers.get("X-Session-Id")
    print(f"✅ Session ID: {SESSION_ID}")
    
    # 初始化
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {}
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Session-Id": SESSION_ID
    }
    
    response = requests.post(MCP_URL, json=payload, headers=headers)
    print(f"✅ 初始化结果: {response.json()}")

def list_tools():
    """列出工具"""
    payload = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/list",
        "params": {}
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Session-Id": SESSION_ID
    }
    
    response = requests.post(MCP_URL, json=payload, headers=headers)
    print(f"✅ 工具列表: {json.dumps(response.json(), indent=2)}")

def call_recommend_scale(symptoms):
    """调用推荐量表工具"""
    payload = {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "tools/call",
        "params": {
            "name": "recommend_scale",
            "arguments": {"symptoms": symptoms}
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Session-Id": SESSION_ID
    }
    
    response = requests.post(MCP_URL, json=payload, headers=headers)
    print(f"✅ 推荐结果: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    print("🚀 开始测试 MCP 服务...")
    
    try:
        init_session()
        list_tools()
        call_recommend_scale("转圈 不理人 自闭")
        print("\n✅ 所有测试通过！")
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
```

运行测试：
```bash
python test_mcp.py
```

---

## 📊 服务状态检查清单

- [ ] Node.js 服务已启动（http://localhost:3000）
- [ ] MCP 端点可访问（GET /api/mcp 返回 SSE 流）
- [ ] 初始化成功（POST /api/mcp 返回 serverInfo）
- [ ] 工具列表正常（tools/list 返回 3 个工具）
- [ ] 工具调用成功（recommend_scale 返回 ABC 量表）
- [ ] qclaw MCP 配置已添加
- [ ] qclaw 可以调用 MCP 工具

---

## 🐛 常见问题

### Q1: 端口被占用

**问题**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决**:
```bash
# 查找占用进程
netstat -ano | findstr :3000

# 终止进程
taskkill /PID <进程ID> /F
```

### Q2: Session ID 未返回

**问题**: 响应头中没有 X-Session-Id

**解决**: 检查 `transport.ts` 中的响应头设置：
```typescript
headers: {
  "X-Session-Id": sessionId,
  // ...
}
```

### Q3: qclaw 无法连接

**问题**: qclaw 报错 "无法连接到 MCP 服务器"

**解决**:
1. 确认 MCP 服务正在运行
2. 检查防火墙设置
3. 验证 URL 配置是否正确

---

## 📝 生产部署建议

### 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start npm --name "ai-scale-system" -- run start

# 查看状态
pm2 status

# 查看日志
pm2 logs ai-scale-system
```

### 配置反向代理（Nginx）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/mcp {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔗 相关链接

- 项目仓库: https://github.com/Handsome5201314/ai-scale-system
- MCP 协议文档: https://modelcontextprotocol.io/
- Next.js 文档: https://nextjs.org/docs
