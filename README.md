# SwarmSim 🚀

[![Screenshot](https://via.placeholder.com/1200x600/05060f/00f5d4?text=SwarmSim+Landing)](https://swarmsim.vercel.app)

## What is SwarmSim?

SwarmSim is a cutting-edge multi-agent AI simulation platform that lets you upload any document (PDFs, news articles, fiction) and instantly spawn thousands of AI agents that debate, evolve, and predict future outcomes. Watch as specialized personas (optimists, skeptics, analysts) interact over Twitter/Reddit-style channels, forming consensus or revealing risks. Get executive-ready prediction reports with confidence scores, turning points, and alternative scenarios. Perfect for policy analysis, financial forecasting, public opinion tracking, and creative writing continuation.

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/swarm-sim.git
cd swarm-sim
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open http://localhost:3000

## 📋 Setup

1. **Clone the repo** and install dependencies
2. **Copy `.env.example` to `.env.local`** and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
3. **Run development server**: `npm run dev`

**Demo mode**: The app works without API key using mock data for full UI showcase.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript
- **Styling**: Tailwind CSS 3, Headless UI, Framer Motion (animations)
- **AI Backend**: Anthropic Claude (Sonnet 3.5), mock demo mode
- **APIs**: Next.js API routes with rate limiting
- **Icons**: Lucide React
- **State**: React Context, Zustand (future)

## 🌟 Features

- **Landing Page**: Futuristic dark sci-fi design with animated stats
- **Console**: 3-panel layout (Simulations, Tabs, Config)
- **5-Step Flow**: Upload → GraphRAG → Agent Simulation → Report → Chat
- **Interactive**: Sliders, tabs, agent chat, toast notifications
- **Polish**: Glassmorphism, micro-interactions, loading states

## 📸 Screenshots

*(Add your screenshots here)*

## 🔒 License

MIT
