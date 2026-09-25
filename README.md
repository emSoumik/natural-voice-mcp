# Natural Voice MCP

A public, read-only MCP server for writing and rewriting in Soumik's natural voice. It runs on Cloudflare Workers over Streamable HTTP. This is an MCP service, not a hosted language model: the connected AI client drafts the text, and this server supplies the voice playbook and mechanical lint results.

## Connect

After deployment, add this Streamable HTTP endpoint to an MCP-compatible client:

```text
https://natural-voice-mcp.cold-mail-agent.workers.dev/mcp
```

For a client that accepts an MCP server URL:

```json
{
  "mcpServers": {
    "natural-voice": {
      "url": "https://natural-voice-mcp.cold-mail-agent.workers.dev/mcp"
    }
  }
}
```

The endpoint is public and needs no authentication. Do not send confidential drafts to a public service unless your own privacy requirements allow it. The Worker processes tool input in memory, has no database or analytics binding, and does not call a model or store drafts. Cloudflare may still process normal service logs according to your account settings.

## Install the Codex plugin

This repository includes a Codex plugin manifest, a remote MCP connection, and a small skill that invokes the two tools. Add its marketplace and install the plugin:

```sh
codex plugin marketplace add emSoumik/natural-voice-mcp --ref main
codex plugin add natural-voice@natural-voice-repo
```

The existing local `natural-voice` skill is not deleted or changed. A fresh Codex task may be needed to load the newly installed plugin.

## Tools

| Tool | Purpose |
| --- | --- |
| `natural_voice_guidance` | Returns the bundled voice playbook and examples for a writing task. Inputs: `request`, optional `register`. |
| `lint_natural_voice` | Checks a draft for mechanical voice issues. Inputs: `text`, `register`. Flags are hints, not factual or stylistic proof. |

Registers: `text`, `default`, `broadcast`, `pro`, `formal`. The default is for most posts. Use `pro` for professional email, including cold outreach.

The content comes from the user-provided `natural-voice.zip`. The public repository includes the writing guidance, real sample text, and original Python checker. The server bundles all guidance at build time, so it has no runtime GitHub dependency. It does not fabricate personal facts or send messages.

## Develop

Node.js 22 or newer:

```sh
npm ci
npm run check
npm run dev
```

The local endpoint is `http://localhost:8787/mcp` unless Wrangler prints a different port. `npm run check` generates the content module, type-checks, runs tests, and performs a Worker dry run. `npm run deploy` repeats those checks and deploys to the account in `wrangler.jsonc`.

To change the public voice material, edit `content/` and rerun `npm run build:content`. Do not edit the generated `src/playbook.ts`. Review public examples before every push. Do not add private client drafts, credentials, or contact data.

## Limits

The guidance tool gives a connected model instructions and examples; it does not produce a deterministic rewrite. The lint tool is a JavaScript port of the supplied Python checker and can have false positives. Preserve facts, names, links, and intended meaning during any model rewrite.

## License

MIT. See [LICENSE](LICENSE).
