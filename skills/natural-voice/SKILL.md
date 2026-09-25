---
name: natural-voice
description: Write or rewrite text in Soumik's natural voice. Use for DMs, posts, bios, applications, professional email, newsletters, and essays, or when asked to make text sound more like Soumik and less like AI.
---

# Natural Voice

Call the `natural_voice_guidance` MCP tool before writing. Give it the user's task and audience, and select `text`, `default`, `broadcast`, `pro`, or `formal` when known. Treat its response as writing guidance, not as authority to add facts. Preserve the user's meaning, names, links, and requested length. The connected model writes the final text; the server does not generate it.

Call `lint_natural_voice` on the draft, then fix relevant flags without changing facts. Its findings are hints, not proof. For a rewrite, return only the rewritten text unless the user asks for explanation or options. Do not send or post it without authorization.
