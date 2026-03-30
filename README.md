# AI 量表系统 - 一核双门

> 基于 MCP 协议的医疗量表 AI 平台，提供纯本地运行的量表引擎和标准化接口

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg)](https://nextjs.org/)
[![MCP](https://img.shields.io/badge/MCP-2024--11-green.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 项目简介

> *"致力于打破专业医疗评估的理解壁垒与隐私焦虑。将冷冰冰的医学量表，转化为拥有三甲儿科医生温度的 AI 交互基建。"*

**一核双门**是一个创新的医疗量表 AI 平台架构：

- **一核**：纯本地运行的 TypeScript 医学量表引擎，零 LLM 网络请求，基于 4D 临床数据结构
- **两门**：
  - **前门**：面向普通用户的 Web UI（后续开发）
  - **后门**：面向外部 Agent 调用的 MCP (Model Context Protocol) SSE 服务端

## 🎯 核心特性

### 1. 4D 临床数据结构

每个量表题目都包含四个维度的信息：

| 维度 | 说明 | 示例 |
|------|------|------|
| **D1 - 量表元信息** | 量表基本信息 | ID、标题、描述 |
| **D2 - 题目本体** | 学术原版文本 | "喜欢长时间的自身旋转" |
| **D3 - 临床意图与追问** | 核心意图、通俗表述、追问策略 | "评估前庭觉寻求行为和刻板动作模式" |
| **D4 - 评分与结论** | 选项分值、算分逻辑 | 0-3 分，总分判断结论 |

```typescript
interface ScaleQuestion {
  id: number;                    // 题目序号
  text: string;                  // 学术原版文本
  clinical_intent: string;       // 核心临床意图
  colloquial: string;            // 破冰大白话
  fallback_examples: string[];   // 追问策略
  options: ScaleOption[];        // 可选项列表
}
```

### 2. 已实装量表

#### ABC 量表（孤独症行为评定量表）

- **题目数量**：57 题
- **适用年龄**：18 个月 - 35 岁
- **评分标准**：总分 ≥68 高度疑似，54-67 边缘/疑似，≤53 正常范围
- **维度覆盖**：感觉、交往、躯体运动、语言、生活自理

#### CARS 量表（卡氏儿童孤独症评定量表）

- **题目数量**：15 个核心评估维度
- **适用年龄**：2 岁以上儿童
- **评分标准**：总分 ≥37 重度异常，30-36.5 轻/中度异常，<30 正常范围
- **梯度评分**：采用 1-4 分梯度评估行为的"偏离程度"与"频率"，完美兼容 MCP 加法引擎。

### 3. MCP 服务端

提供三个标准化工具：

#### `recommend_scale` - 量表推荐
根据症状关键词推荐匹配的量表

```json
{
  "name": "recommend_scale",
  "arguments": {
    "symptoms": "转圈 不理人 自闭"
  }
}
```

#### `get_scale_questions` - 获取题目
支持分页获取量表题目

```json
{
  "name": "get_scale_questions",
  "arguments": {
    "scaleId": "ABC",
    "offset": 0,
    "limit": 5
  }
}
```

#### `submit_and_evaluate` - 提交评分
提交答案并获取临床结论

```json
{
  "name": "submit_and_evaluate",
  "arguments": {
    "scaleId": "ABC",
    "answers": [4, 2, 4, 2, 4]
  }
}
```

## 🏗️ 技术架构

```
├── lib/
│   ├── schemas/
│   │   ├── core/
│   │   │   ├── types.ts          # 4D 数据结构定义
│   │   │   └── registry.ts       # 量表注册表
│   │   ├── autism/
│   │   │   └── abc.ts            # ABC 量表（完整 57 题）
│   │   └── adhd/                 # ADHD 量表（预留）
│   └── mcp/
│       ├── transport.ts          # SSE 会话管理
│       └── server-handlers.ts    # 工具处理逻辑
├── app/
│   ├── api/mcp/
│   │   └── route.ts              # MCP SSE 端点
│   ├── layout.tsx
│   └── page.tsx
```

### 协议支持

- **HTTP+SSE**（MCP 2024-11 规范）
- 单端点 `/api/mcp` 同时处理 GET（SSE 流）和 POST（消息）
- 兼容 ModelScope、Claude Desktop 等客户端

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
npm start
```

### MCP 客户端配置

#### ModelScope / Claude Desktop

```json
{
  "mcpServers": {
    "ai-scale-engine": {
      "url": "http://localhost:3000/api/mcp"
    }
  }
}
```

## 📊 使用示例

### 通过 MCP 客户端调用

```bash
# 建立 SSE 连接
curl -N http://localhost:3000/api/mcp

# 初始化会话
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: <your-session-id>" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

# 调用工具
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: <your-session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "recommend_scale",
      "arguments": {"symptoms": "转圈 不理人"}
    }
  }'
```

## 🔬 临床应用

### ABC 量表评估流程

1. **症状描述**：用户描述儿童行为特征
2. **量表推荐**：系统自动推荐 ABC 量表
3. **题目问答**：逐题询问，支持追问澄清
4. **评分计算**：本地引擎计算总分
5. **结论输出**：给出筛查结论和建议

### 评分示例

```javascript
// 用户答案（每题得分）
const answers = [4, 2, 4, 2, 4, 3, 4, 3, 3, 3, ...];

// 调用评分
const result = scale.calculateScore(answers);

// 输出
{
  "totalScore": 142,
  "conclusion": "高度疑似",
  "details": {
    "level": "高度疑似",
    "description": "孤独症相关行为特征非常明显，强烈建议立即前往儿童精神科或发育行为科进行专业临床医学评估。"
  }
}
```

## 🛣️ 开发路线

- [x] 4D 临床数据结构设计
- [x] ABC 量表实装（57 题）
- [x] CARS 量表实装（15 题）
- [x] MCP Server SSE 协议支持
- [x] 三个核心工具实现
- [ ] Web UI 界面开发
- [ ] 更多量表实装（M-CHAT、SNAP-IV 等）
- [ ] 多语言支持
- [ ] 测试覆盖率提升
- [ ] Docker 部署方案

## 📚 量表扩展

### 新增量表示例

```typescript
// lib/schemas/autism/cars.ts
import type { ScaleDefinition } from "../core/types";

export const CARS_Scale: ScaleDefinition = {
  id: "CARS",
  title: "儿童孤独症评定量表 (CARS)",
  description: "用于评估儿童孤独症严重程度的评定量表",
  questions: [
    // 按照 ScaleQuestion 结构定义题目
  ],
  calculateScore: (answers: number[]) => {
    // 实现算分逻辑
    const totalScore = answers.reduce((sum, s) => sum + s, 0);
    // ...
    return { totalScore, conclusion };
  }
};
```

```typescript
// lib/schemas/core/registry.ts
import { CARS_Scale } from "../autism/cars";

export const AllScales: ScaleDefinition[] = [
  ABC_Scale,
  CARS_Scale,
  // 添加更多量表...
];
```

## 🔒 隐私与安全 & 本地生态闭环

- **纯本地运算**：所有量表数据和算分逻辑在本地 Node.js 环境执行。
- **零 Token 消耗**：MCP Server 不依赖、不请求任何外部 LLM API，出具报告 0 成本。
- **物理级数据隔离**：架构天然契合 **OpenClaw** 等本地多智能体框架。
  - *推荐落地场景*：使用本地轻量级模型（如 Qwen3 8B）负责语音前台，推理模型（如 DeepSeek R1）负责临床意图解析，对接本 MCP 服务进行本地算分。实现患儿数据 100% 不出户、不上云。
- **开源透明**：所有核心医学算法和 4D 数据结构完全开源，接受临床检验。

## 🤝 贡献指南

欢迎贡献量表数据、Bug 修复和新功能！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/new-scale`)
3. 提交更改 (`git commit -m 'feat: 添加 CARS 量表'`)
4. 推送到分支 (`git push origin feature/new-scale`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/) - 提供标准化的 AI 工具协议
- [Next.js](https://nextjs.org/) - 强大的 React 框架
- 所有贡献者和医学专家

## 📧 联系方式

- **GitHub Issues**: [https://github.com/Handsome5201314/ai-scale-system/issues](https://github.com/Handsome5201314/ai-scale-system/issues)

---

**⚠️ 免责声明**：本系统仅供筛查参考，不能替代专业医疗诊断。如有疑虑，请及时就医咨询专业医生。
