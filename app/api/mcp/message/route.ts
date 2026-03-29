/**
 * MCP Streamable HTTP 消息接口 (POST)
 *
 * 外部 Agent 通过 POST 发送 JSON-RPC 消息。
 * Transport 根据 Mcp-Session-Id 头自动路由到对应会话。
 */

import { transport } from "@/lib/mcp/transport";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return transport.handleRequest(request);
}
