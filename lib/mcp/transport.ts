/**
 * MCP 共享 Transport 单例
 *
 * 使用 WebStandardStreamableHTTPServerTransport，兼容 Web Standard API。
 * 单例模式确保 GET（SSE 流）和 POST（消息处理）共享同一个 Transport。
 */

import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { mcpServer } from "./server";

// 创建有状态 Transport，支持多会话
const transport = new WebStandardStreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID(),
});

// 将 MCP Server 连接到 Transport（仅需一次）
mcpServer.connect(transport);

export { transport };
