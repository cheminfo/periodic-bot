# periodic-bot

> [Bot's link](http://telegram.me/periodic_bot)

Telegram bot that provides information about the elements of the periodic table.

## Deployment (Docker)

```bash
cp compose.example.yaml compose.yaml
cp .env.example .env
# edit .env and set TELEGRAM_TOKEN=<your token>
docker compose pull && docker compose up -d
# or build from the current checkout instead of pulling:
docker compose up -d --build
```

Obtain a bot token from [@BotFather](https://t.me/BotFather).

### Private ghcr.io image

If the `ghcr.io/cheminfo/periodic-bot` package is private, authenticate on the host once before `docker compose pull`:

```bash
# Create a PAT at https://github.com/settings/tokens with the `read:packages` scope,
# then set GHCR_TOKEN in .env (see .env.example).
set -a && . ./.env && set +a
echo "$GHCR_TOKEN" | docker login ghcr.io -u <your-github-username> --password-stdin
```

The credential is stored by Docker and reused on subsequent pulls.

## Local development

```bash
npm install
cp .env.example .env   # set TELEGRAM_TOKEN
npm run dev            # node --watch
```

Run the checks:

```bash
npm test
```

## Related

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
