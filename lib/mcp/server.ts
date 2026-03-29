/**
 * MCP Server 骨架 — 医疗量表的"后门"服务
 *
 * 职责：读取 registry 中的量表，注册 3 大 Tools，
 * 供外部 Agent 通过 Streamable HTTP 协议调用。
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { AllScales } from "@/lib/schemas/core/registry";

// ─── 实例化 MCP Server ───────────────────────────────────────────
export const mcpServer = new Server(
  {
    name: "ai-scale-engine",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ─── 注册 Tool 列表 ──────────────────────────────────────────────
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "recommend_scale",
      description:
        "根据用户描述的症状关键词，从已注册的量表中推荐最匹配的量表。",
      inputSchema: {
        type: "object" as const,
        properties: {
          symptoms: {
            type: "string",
            description: "用户描述的症状关键词（逗号或空格分隔）",
          },
        },
        required: ["symptoms"],
      },
    },
    {
      name: "get_scale_questions",
      description:
        "获取指定量表的题目列表，支持分页。返回题目原文本、通俗表述、选项等信息。",
      inputSchema: {
        type: "object" as const,
        properties: {
          scaleId: {
            type: "string",
            description: "量表 ID（如 PHQ-9）",
          },
          offset: {
            type: "number",
            description: "起始题号偏移（从 0 开始），默认 0",
          },
          limit: {
            type: "number",
            description: "返回题目数量上限，默认 5",
          },
        },
        required: ["scaleId"],
      },
    },
    {
      name: "submit_and_evaluate",
      description:
        "提交用户对某量表的所有答案，由本地引擎计算总分并返回临床结论。",
      inputSchema: {
        type: "object" as const,
        properties: {
          scaleId: {
            type: "string",
            description: "量表 ID",
          },
          answers: {
            type: "array",
            items: { type: "number" },
            description: "用户选择的每题分数（顺序与题目一致）",
          },
        },
        required: ["scaleId", "answers"],
      },
    },
  ],
}));

// ─── 症状 → 量表关键词映射 ──────────────────────────────────────
const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  ABC: [
    "转圈", "旋转", "刻板", "不理人", "不应名", "说话", "语言",
    "自闭", "孤独症", "眼神", "社交", "重复", "兴趣狭窄",
  ],
};

// ─── Tool 调用处理器 ────────────────────────────────────────────
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    // ── recommend_scale：根据症状推荐量表 ──
    case "recommend_scale": {
      const parsed = z.object({ symptoms: z.string() }).parse(args);

      const matchedScales = AllScales.filter((scale) => {
        const keywords = SYMPTOM_KEYWORDS[scale.id];
        if (!keywords) return false;
        return keywords.some((kw) => parsed.symptoms.includes(kw));
      });

      if (matchedScales.length > 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                matchedScales.map((s) => ({ id: s.id, title: s.title })),
                null,
                2
              ),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: "暂无完全匹配的量表，建议先使用 ABC 筛查。",
          },
        ],
      };
    }

    // ── get_scale_questions：获取量表题目（分页） ──
    case "get_scale_questions": {
      const parsed = z
        .object({
          scaleId: z.string(),
          offset: z.number().optional().default(0),
          limit: z.number().optional().default(5),
        })
        .parse(args);

      const scale = AllScales.find((s) => s.id === parsed.scaleId);
      if (!scale) {
        return {
          content: [
            {
              type: "text" as const,
              text: `未找到量表: "${parsed.scaleId}"`,
            },
          ],
          isError: true,
        };
      }

      const paged = scale.questions.slice(parsed.offset, parsed.offset + parsed.limit);
      const hasMore = parsed.offset + parsed.limit < scale.questions.length;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { questions: paged, total: scale.questions.length, hasMore },
              null,
              2
            ),
          },
        ],
      };
    }

    // ── submit_and_evaluate：提交答案并评分 ──
    case "submit_and_evaluate": {
      const parsed = z
        .object({
          scaleId: z.string(),
          answers: z.array(z.number()),
        })
        .parse(args);

      const scale = AllScales.find((s) => s.id === parsed.scaleId);
      if (!scale) {
        return {
          content: [
            {
              type: "text" as const,
              text: `未找到量表: "${parsed.scaleId}"`,
            },
          ],
          isError: true,
        };
      }

      const result = scale.calculateScore(parsed.answers);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`未知工具: ${name}`);
  }
});
