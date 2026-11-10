# Release parameters (release-seal)

The generic steps live in the global `release-seal` skill. This file only records the parameters and exceptions for this project.

## Version

- Semantic versioning `X.Y.Z`. `package.json` `version` is the single source; bump it in the release commit.
- There is no upload and no JitPack/npm publishing: the mini program is a sample, not a store release.

## Pre-release checks

```bash
npm ci && npx tsc --noEmit
```

If the WeChat DevTools are logged in, also run `npm run test:e2e` and review the screenshots under `.tmp/round3/shots/`.

## Tag

- Bare version tag without a `v` prefix, annotated, message `wechat-miniprogram-demo X.Y.Z`, created on the release commit and pushed to `origin`.

## GitHub Release

- Title is the version number. Notes in English, sections such as "Added / Changed / Fixed" as needed. No attachments.

## Afterwards

- No product doc or ROADMAP; the GitHub Release is the source of truth for release notes.
