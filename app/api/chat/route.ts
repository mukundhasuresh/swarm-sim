import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  agentName: string;
  agentType?: string;
  simulationData?: any[];
}

export async function POST(request: NextRequest) {
  try {
    const { messages, agentName, agentType, simulationData }: ChatRequest = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Mock responses (real: Anthropic with dynamic system prompt based on agent)
    const agentResponses = {
      'ReportAgent': [
        "As ReportAgent, I've analyzed the full simulation trajectory. The consensus shows moderate optimism tempered by risk awareness from skeptic agents.",
        "Key insight: Round 12 marked the turning point where analysts' data bridged optimists and skeptics.",
        "Confidence in predicted outcome is 74% based on final sentiment convergence patterns."
      ],
      'Optimist Agent': [
        "From my perspective as an Optimist Agent, the scenario shows strong potential despite initial hurdles. The economic benefits outweigh the risks.",
        "Collaborating with analysts helped refine my position - implementation challenges are manageable."
      ],
      'Skeptic Agent': [
        "As Skeptic Agent, I remain cautious. Early rounds showed valid concerns about ethics and regulation that weren't fully addressed.",
        "While compromise emerged, the risks we highlighted in Round 5 could still derail progress."
      ]
    };

    const lastUserMsg = messages[messages.length - 1].content;
    const responseKey = agentName || 'ReportAgent';
    const mockResponse = agentResponses[responseKey as keyof typeof agentResponses]?.[Math.floor(Math.random() * (agentResponses[responseKey as keyof typeof agentResponses]?.length || 1))] || 
      `Simulated response from ${agentName || 'agent'} about "${lastUserMsg}". The debate evolved through multiple rounds with diverse viewpoints.`;

    // Simulate streaming (real would stream tokens)
    await new Promise(resolve => setTimeout(resolve, 1200));

    return NextResponse.json({ 
      response: mockResponse,
      conversation: [...messages, { role: 'assistant' as const, content: mockResponse }]
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

