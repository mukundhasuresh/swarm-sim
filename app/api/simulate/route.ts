import { NextRequest, NextResponse } from 'next/server';

interface Post {
  agentId: string;
  agentName: string;
  agentType: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  round: number;
  replyTo?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { entities, agentCount, rounds, platforms }: {
      entities: any[];
      agentCount: number;
      rounds: number;
      platforms: string[];
    } = await request.json();

    if (!entities || !rounds) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Mock streaming simulation (real would use @anthropic-ai/sdk with stream: true)
    const agentTypes = ['optimist', 'skeptic', 'analyst', 'activist', 'neutral'];
    const mockPosts: Post[] = [];

    for (let r = 1; r <= rounds; r++) {
      for (let i = 0; i < Math.min(5, agentCount); i++) { // 5 posts per round for demo
        const agentType = agentTypes[i % agentTypes.length];
        const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
        const sentiment = sentiments[Math.floor(Math.random() * 3)];
        mockPosts.push({
          agentId: `agent-${i + 1}`,
          agentName: `${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Agent #${i + 1}`,
          agentType,
          content: `Round ${r}: Reacting to ${entities[0]?.name || 'scenario'}. This is a ${sentiment} take on the evolving discussion. ${Math.random() > 0.5 ? 'Replying to previous posts...' : ''}`,
          sentiment,
          round: r,
          replyTo: Math.random() > 0.7 ? `agent-${Math.floor(Math.random() * 5) + 1}` : undefined,
        });

        // Simulate streaming delay
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Stream posts one by one (SSE style, but simple array for demo)
    return NextResponse.json({ posts: mockPosts });
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

