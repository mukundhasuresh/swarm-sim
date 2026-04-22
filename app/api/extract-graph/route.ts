import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    // Mock response for demo (replace with real Anthropic call)
    // Real impl: npm i @anthropic-ai/sdk, use ANTHROPIC_API_KEY env
    const mockGraph = {
      entities: [
        { id: '1', name: 'Alice Johnson', type: 'person' as const, description: 'CEO of TechCorp' },
        { id: '2', name: 'TechCorp', type: 'org' as const, description: 'Technology company' },
        { id: '3', name: 'Product Launch', type: 'event' as const, description: 'New AI product announcement' },
        { id: '4', name: 'AI Ethics', type: 'concept' as const, description: 'Ethical considerations in AI development' },
      ],
      relationships: [
        { from: '1', to: '2', label: 'CEO of', strength: 'strong' as const },
        { from: '1', to: '3', label: 'announcing', strength: 'strong' as const },
        { from: '3', to: '4', label: 'raises concerns about', strength: 'medium' as const },
      ]
    };

    return NextResponse.json(mockGraph);
  } catch (error) {
    console.error('Graph extraction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

