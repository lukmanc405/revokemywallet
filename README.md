# revokemywallet — Telegram Mini App

> **Safe Revoke • Powered by @revokemywalletbot by luke**

A non-custodial Telegram Mini App for revoking ERC-20/721/1155 token approvals across 8 EVM chains. All transactions are signed locally in your wallet — we never touch your private keys.

## Features

- 🔍 **Multichain Scan** — Scan all 8 chains in parallel simultaneously
- 🚫 **Batch Revoke** — Select multiple approvals and revoke in one session
- ⛽ **Gas Balance Check** — Warning if native token balance is insufficient
- 📜 **Revoke History** — Persistent history with explorer links
- 🌐 **8 Chains** — Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, zkSync
- 🎨 **Dark Theme** — Telegram-native dark UI with purple accent
- 🔐 **Non-Custodial** — Private keys never leave your wallet

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript (strict mode)
- **Styling:** Tailwind CSS + lucide-react icons
- **Web3:** Reown AppKit + wagmi + viem
- **Data:** @tanstack/react-query (scan cache)
- **State:** Zustand (persist to localStorage)
- **Telegram:** WebApp API (haptic, sendData, theme)

## Quick Start

```bash
# Clone
git clone https://github.com/lukmanc405/revokemywallet.git
cd revokemywallet

# Install
npm install

# Configure
cp .env.example .env
# Edit .env — add your Reown Project ID

# Run
npm run dev
```

## Environment Variables

```env
VITE_REOWN_PROJECT_ID=your_reown_project_id   # Get from https://cloud.reown.com
VITE_MORALIS_API_KEY=your_moralis_api_key      # Optional: for server-side scan
```

### Getting a Reown Project ID

1. Go to [Reown Cloud](https://cloud.reown.com)
2. Create a new project
3. Copy the Project ID
4. Add `http://localhost:5173` to allowed origins (for dev)
5. Add your production domain for deployment

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_REOWN_PROJECT_ID
```

Or connect your GitHub repo to Vercel dashboard:
1. Import repository
2. Framework: Vite (auto-detected)
3. Add env vars
4. Deploy

## Add Mini App to @revokemywalletbot

### Method 1: BotFather Menu Button

```
/menu
```

Use [@BotFather](https://t.me/BotFather):
1. `/mybots` → select @revokemywalletbot
2. Bot Settings → Menu Button
3. Set URL: `https://your-vercel-domain.vercel.app`

### Method 2: Inline Button (in code)

Add to your bot's code:

```javascript
// In revoke-bot/index.js — add to main menu
const miniAppUrl = 'https://your-vercel-domain.vercel.app';

bot.command('app', async (ctx) => {
  await ctx.reply('Open revokemywallet:', {
    reply_markup: {
      inline_keyboard: [[
        { text: '🚀 Open Mini App', web_app: { url: miniAppUrl } }
      ]]
    }
  });
});
```

### Method 3: Telegram Menu Button

```javascript
bot.api.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: '🚀 revokemywallet',
    web_app: { url: miniAppUrl }
  }
});
```

## Bot Communication (JSON Format)

The Mini App sends data to the bot via `Telegram.WebApp.sendData()`:

### Wallet Connected
```json
{
  "action": "wallet_connected",
  "address": "0x1234...abcd",
  "chainId": 1
}
```

### Scan Complete
```json
{
  "action": "scan_complete",
  "address": "0x1234...abcd",
  "chains": {
    "eth": { "total": 5, "spam": 3, "legit": 2 },
    "base": { "total": 12, "spam": 10, "legit": 2 }
  }
}
```

### Revoke Success
```json
{
  "action": "revoke_success",
  "txHashes": [
    {
      "txHash": "0xabc...",
      "chain": "eth",
      "token": "USDT",
      "spender": "0x1234...",
      "explorerUrl": "https://etherscan.io/tx/0xabc..."
    }
  ]
}
```

## Supported Chains

| Chain | ID | Explorer |
|-------|----|---------|
| Ethereum | 1 | etherscan.io |
| Base | 8453 | basescan.org |
| Arbitrum | 42161 | arbiscan.io |
| Optimism | 10 | optimistic.etherscan.io |
| Polygon | 137 | polygonscan.com |
| BSC | 56 | bscscan.com |
| Avalanche | 43114 | snowtrace.io |
| zkSync | 324 | explorer.zksync.io |

## Project Structure

```
revokemywallet/
├── src/
│   ├── components/          # UI components
│   │   ├── SplashScreen.tsx  # Welcome/onboarding
│   │   ├── Header.tsx        # Top bar
│   │   ├── WalletConnect.tsx # Reown AppKit button
│   │   ├── ChainSelector.tsx # Chain multi-select
│   │   ├── ScanButton.tsx    # Scan trigger
│   │   ├── ApprovalCard.tsx  # Single approval item
│   │   ├── ApprovalList.tsx  # Grouped approvals
│   │   ├── RevokeButton.tsx  # Revoke actions
│   │   ├── GasWarningModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── HistoryTab.tsx
│   │   ├── Tabs.tsx
│   │   └── Toast.tsx
│   ├── config/
│   │   ├── chains.ts         # 8 chain configs
│   │   └── reown.ts          # AppKit + wagmi setup
│   ├── hooks/
│   │   ├── useMultichainScan.ts  # React Query scan
│   │   ├── useRevoke.ts          # Revoke transactions
│   │   └── useTelegramWebApp.ts  # TG WebApp helpers
│   ├── providers/
│   │   ├── Web3Provider.tsx
│   │   └── TelegramProvider.tsx
│   ├── stores/
│   │   ├── walletStore.ts    # Connection state
│   │   ├── scanStore.ts      # Approvals + selection
│   │   └── historyStore.ts   # Persist to localStorage
│   ├── types/
│   │   └── index.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## License

MIT — Built by [@luke](https://t.me/redmart09) for the @revokemywalletbot community.

---

**⚠️ Security Notice:** revokemywallet is non-custodial. We never store, transmit, or have access to your private keys. All transaction signing happens locally in your connected wallet. Always verify transaction details before confirming.
