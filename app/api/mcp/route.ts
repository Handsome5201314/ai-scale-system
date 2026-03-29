/**
 * MCP Streamable HTTP 接口 (GET)
 *
 * 外部 Agent 通过 GET 建立事件流连接，
 * 接收服务端推送的 SSE 事件。
 */

import { transport } from "@/lib/mcp/transport";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return transport.handleRequest(request);
}
