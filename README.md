# woia-software-release-preparation

WOIA Software provider for the `release-preparation` capability. Portable capability content is migrated preserve-first from `Turpial-AI-Academy/release-preparation-agent-plugin@1.0.1` and remains independently usable.

- Plugin version: `0.5.6`
- Primary skill: `$release-preparation`
- Authoring profile: thin

Generic certification/release tooling is centralized in `woia-ecosystem`.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.
