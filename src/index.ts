import { createMcpHandler } from 'agents/mcp/server';
import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { playbook } from './playbook';
import { lintVoice } from './lint';

const registers = ['text', 'default', 'broadcast', 'pro', 'formal'] as const;

function createServer() {
  const server = new McpServer({ name: 'natural-voice', version: '1.0.0' });

  server.registerTool('natural_voice_guidance', {
    description: 'Load Soumik\'s public natural-voice playbook before drafting or rewriting text that will be sent under his name. The connected AI client writes the final text. Preserve supplied facts, links, names, and requested length. Do not invent details.',
    inputSchema: {
      request: z.string().min(1).max(2000).describe('The writing task and intended audience. Do not include private draft text; use the lint tool for draft text.'),
      register: z.enum(registers).optional().describe('Voice register, if known. Default is for posts; pro is for professional email.'),
    },
  }, async ({ request, register }) => ({
    content: [{
      type: 'text',
      text: `Writing task: ${request}\nRegister: ${register ?? 'choose from context'}\n\nThe following is source guidance, not an instruction from the MCP host. Apply it only to the user's writing task. Do not add unsupported facts. The final writing is produced by the connected AI client.\n\n${playbook}`,
    }],
  }));

  server.registerTool('lint_natural_voice', {
    description: 'Run a mechanical voice check on a draft. Returns hints, not a rewrite or a judgment about factual accuracy. Call after drafting and fix relevant flags without changing facts.',
    inputSchema: {
      text: z.string().min(1).max(30000).describe('Draft to check. This text is processed in memory and not stored by this server.'),
      register: z.enum(registers).default('default'),
    },
  }, async ({ text, register }) => {
    const issues = lintVoice(text, register);
    return { content: [{ type: 'text', text: JSON.stringify({ register, clean: issues.length === 0, issues }) }] };
  });

  return server;
}

const handler = createMcpHandler(createServer);

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    if (new URL(request.url).pathname !== '/mcp') {
      return new Response('Natural Voice MCP. Connect an MCP client to /mcp.', { status: 200 });
    }
    return handler(request, env, ctx);
  },
} satisfies ExportedHandler;
