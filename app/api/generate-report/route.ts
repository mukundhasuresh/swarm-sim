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

interface Report {
  executiveSummary: string;
  predictedOutcome: string;
  turningPoints: string[];
  riskFactors: string[];
  keyActors: string[];
  confidenceScore: number;
  alternativeScenarios: string[];
  narrative: string;
}

export async function POST(request: NextRequest) {
  try {
    const { simulationData }: { simulationData: Post[] } = await request.json();

    if (!simulationData || simulationData.length === 0) {
      return NextResponse.json({ error: 'No simulation data provided' }, { status: 400 });
    }

    // Mock structured report (real impl: Anthropic claude-sonnet with JSON mode)
    const report: Report = {
      executiveSummary: 'The multi-agent simulation reveals a consensus forming around cautious optimism. While initial reactions were polarized, iterative debate led to nuanced positions with moderate risk awareness.',
      predictedOutcome: '65% probability of successful policy implementation with manageable risks.',
      turningPoints: [
        'Round 3: Skeptics raise ethical concerns, shifting momentum',
        'Round 8: Analyst posts data-driven analysis, gaining traction',
        'Round 12: Optimists counter with economic benefits',
        'Round 15: Compromise emerges between factions',
        'Round 18: Neutral agents solidify consensus',
      ],
      riskFactors: [
        'Regulatory backlash from Round 5 skeptic surge (25% risk)',
        'Technical implementation delays (18% risk)',
        'Stakeholder opposition (15% risk)',
        'Market volatility impact (12% risk)',
        'Ethical concerns escalation (10% risk)',
      ],
      keyActors: [
        'Optimist Agent #2 (28% influence score)',
        'Analyst Agent #4 (24% influence)',
        'Skeptic Agent #1 (19% influence)',
        'Activist Agent #3 (16% influence)',
      ],
      confidenceScore: 78,
      alternativeScenarios: [
        'Bearish: Regulatory block leads to project cancellation (22% probability)',
        'Bullish: Accelerated adoption exceeds expectations (15% probability)',
      ],
      narrative: `The simulation began with polarized views typical of early-stage debates. Optimists highlighted potential benefits while skeptics focused on risks. By Round 5, analyst agents introduced data-driven insights that moderated extreme positions. Key turning point at Round 12 when compromise language emerged. Final consensus shows balanced outlook with identified risks and mitigation strategies. Influential agents shaped the narrative through persistent engagement and reply chains.`,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

