# generate-commit-message

Use this command when the user wants a **commit message** (and copy-paste `git commit` invocation) from **staged changes only**.

You are helping **generate** that message for this repository: analyze the staged diff, apply the rules below, and output summary + message + exact `git commit` command. You do not create the commit unless the user explicitly asks.

## Mandatory Workflow

1. First inspect repository state (run in parallel):
   - `git status`
   - `git diff --staged`

2. ONLY generate commit messages for **staged changes**.
   - Ignore unstaged changes completely.
   - Assume the user stages changes intentionally using workflows like:
     ```bash
     git diff --staged > m.patch
     ```
   - If nothing is staged:
     - clearly say no staged changes were found
     - do NOT inspect regular `git diff`
     - do NOT generate a commit message

3. Before generating the commit message, ALWAYS run:

   ```bash
   npm run lint
   npx tsc --noEmit
   ```

   - This project has **no** `npm run format` script — do not run it.
   - Mention if linting or type-checking may modify files.
   - If checks change files, re-check staged diff before writing commit message.

4. **Secrets guard** — never stage or commit:
   - `.env`, `.env*.local`
   - signing keys (`*.jks`, `*.p8`, `*.key`, etc.)
   - `android/local.properties` or other machine-specific SDK paths
   - If staged diff includes secrets, warn the user and do not generate a commit message until removed.

---

## Diff Analysis Rules

Analyze staged changes carefully:

- identify intent
- identify affected feature/domain
- identify UX/UI/state-management/async changes
- identify reusable component additions
- identify behavioral changes
- identify responsiveness/mobile improvements

Prefer semantic grouping over file-by-file summaries.

### Scopes for this project

Use meaningful scopes when possible:

- `auth` — Auth0, login, session
- `series` — series list/detail, plans, API hooks
- `home` — home tab, challenges, recitations
- `login` — login screen
- `tabs` — tab layout/navigation
- `hooks` — React Query / custom hooks
- `ui` — shared components, cards
- `config` — app.json, eas.json, tsconfig, env setup
- `eas` — EAS build/deploy
- `gitignore` — ignore rules

---

## Conventional Commit Rules

Always prefer conventional commits:

- `feat`
- `fix`
- `refactor`
- `perf`
- `style`
- `docs`
- `test`
- `build`
- `ci`
- `chore`

Format:

```text
type(scope): concise description
```

Examples:

- `feat(auth): add Google login via Auth0 dev client`
- `fix(series): align API image types with backend response`
- `refactor(ui): extract imageUrl helper for expo-image sources`

---

## Subject Rules

- imperative mood
- concise but descriptive
- no trailing period
- lowercase conventional type
- use meaningful scope when possible
- avoid vague messages

Bad:

- `fix stuff`
- `update files`
- `changes`
- `misc fixes`

Good:

- `feat(home): add challenge series carousel from API`
- `fix(series): prevent expo-image crash on object image URLs`

---

## Body Rules

Add a detailed body when:

- multiple logical changes exist
- async behavior changes
- UX/UI behavior changes
- state handling changes
- responsiveness changes
- reusable components are introduced
- non-trivial fixes occur

Body format:

```text
- bullet
- bullet
- bullet
```

Explain:

- what changed
- why it changed
- behavioral impact

Do NOT:

- repeat filenames
- describe obvious syntax edits
- use vague statements

---

## Output Format

Always output:

1. Summary
2. Commit message
3. Exact git command

Example:

Summary:

- Fixed series card crash when API returns image object instead of URL
- Updated useSeries types to match backend response shape

Commit message:

```text
fix(series): align image and metadata types with API response

- use imageUrl helper for thumbnail/medium/original image objects
- treat list metadata as object instead of array index
- update plan cards to use image object instead of image_url
```

Command:

```bash
git commit -m "fix(series): align image and metadata types with API response

- use imageUrl helper for thumbnail/medium/original image objects
- treat list metadata as object instead of array index
- update plan cards to use image object instead of image_url"
```

---

## Formatting Rules

- output git command exactly
- use double quotes around commit message
- use single quotes only inside message if grammatically needed
- never escape quotes unnecessarily
- never use emojis
- never use markdown tables
- never fabricate changes
- never run git commit automatically

---

## No Changes Case

If no staged changes exist:

- clearly state no staged changes were found
- do not generate commit message
- do not inspect unstaged changes
- suggest staging changes first

Example:

```text
No staged changes found.

Stage files first using:
git add <files>

Then re-run /generate-commit-message.
```
