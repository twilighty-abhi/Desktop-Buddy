# Contributing

Thanks for contributing to Desktop buddy.

## Setup

1. Fork and clone the repo.
2. Install dependencies:

```bash
npm install
```

3. Run app:

```bash
npm start
```

## Branch and commit style

1. Create a feature branch from `main`.
2. Keep commits focused and small.
3. Use clear commit messages. Example:
   - `feat(reminders): add quiet hours support`
   - `fix(notification): handle disabled toast permissions`

## Pull requests

1. Fill the pull request template.
2. Include testing steps.
3. Add screenshots for UI updates.
4. Do not commit generated output from `release/` or `node_modules/`.

## Release process

1. Update changelog/release notes.
2. Tag versions with `vX.Y.Z`.
3. Push tag to trigger release workflow.
