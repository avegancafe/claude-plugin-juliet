# juliet

Claude Code tooling for [Juliet](https://github.com/avegancafe/Juliet), the
scripted macOS + Fedora setup at `~/.config/Juliet`. This is the shared
baseline for anyone running Juliet; Kyle's personal tooling lives in the
`avegancafe` plugin.

It lives in its own repo, [`avegancafe/claude-plugin-juliet`](https://github.com/avegancafe/claude-plugin-juliet),
and is listed in [`avegancafe-marketplace`](https://github.com/avegancafe/avegancafe-marketplace)
(it was vendored there under `plugins/juliet/` until 1.0.0; its history came with it).

## Install

```bash
/plugin marketplace add avegancafe/avegancafe-marketplace
/plugin install juliet@avegancafe-marketplace
```

## Agent

| Agent | Purpose |
|-------|---------|
| `noelle` | Thin entry point for computer-config work. Invoking it means "I'm changing my computer config — work within Juliet". All behavior lives in the skills below, which it preloads. |

## Skills

| Skill | Purpose |
|-------|---------|
| `juliet-config` | Core workflow: orient in Juliet, decide managed vs ad-hoc and shared vs personal, cover both OSes, no sudo, report back. |
| `juliet-extension` | The Juliet vs extension-repo split (`juliet-kyle`, `juliet-j2`): where each kind of change goes and why an extension edit applies only after a push. |
| `juliet-cross-platform` | macOS ↔ Fedora mapping: Brewfile ↔ DNFfile/Flatpakfile, OS-gating, equivalent tools. |
| `juliet-bootstrap-step` | Add or change a `setup-*` step in `bin/bootstrap.d/` for system-level changes. |
| `add-app-config` | Add configuration for a new application under `symlinked/`. |
| `add-fish-alias` | Create a fish alias or function. |

Skills use absolute `~/.config/Juliet/...` paths, so they work from any directory.

## Mod: bamboo

Juliet puts the Bamboo theme on every app. `bamboo` does the same for Claude Code,
from [bamboo.nvim](https://github.com/ribru17/bamboo.nvim)'s palette as Juliet uses it.

| Where | What you get | How it turns on |
|-------|--------------|-----------------|
| Desktop and mobile apps | A whole look, light and dark: Bamboo's backgrounds, cream text and green accent. Dark is `vulgaris`; light is cream paper with moss. | By itself, when a session starts. |
| Terminal | A `Bamboo` theme for the dark terminal Juliet sets up. | Pick **Bamboo** in `/theme`, once. |

The terminal theme is stored as `"theme": "custom:juliet:bamboo"` in settings.

To keep the apps' own look, turn off **Paint the desktop and mobile apps in Bamboo**
in `/config`. It applies from the next session.

| File | Purpose |
|------|---------|
| [`hooks/bamboo.ts`](hooks/bamboo.ts) | The hooks module: sets the look at `session.start`. |
| [`hooks/bamboo-look.ts`](hooks/bamboo-look.ts) | The palette, mapped onto the apps' design system. Change colors here. |
| `hooks/make-colors.js`, `.d.ts` | Claude Code's own generator, copied as is. Copy it again from the `plugin-authoring` skill when Claude Code updates. |
| [`themes/bamboo.json`](themes/bamboo.json) | The terminal theme. |
| [`tests/bamboo.test.ts`](tests/bamboo.test.ts) | Run with `claude plugin test .` |

The tests can't see paint. After a color change, look at the desktop app in both
modes, with a long code block on screen.

## Releasing

Bump `version` in [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) and merge to `main`.
[`release.yml`](.github/workflows/release.yml) then sends a `plugin-released` event to
`avegancafe-marketplace`, whose sync workflow updates this plugin's entry there.

It needs the `MARKETPLACE_DISPATCH_TOKEN` repo secret: a fine-grained PAT scoped to
`avegancafe/avegancafe-marketplace` only, with Contents read & write.

```bash
gh secret set MARKETPLACE_DISPATCH_TOKEN -R avegancafe/claude-plugin-juliet
```

Without it the release run fails and the marketplace entry stops tracking new versions.
