import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const { id: rawId } = await params;
        const projectId = parseInt(rawId);

        const { data: articles } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        const members = (articles || []).map(art => ({
            '@id': `/api/project-articles/${art.id}`,
            '@type': 'ProjectArticle',
            id: art.id,
            article: {
                '@id': `/api/articles/${art.id}`,
                id: art.id,
                title: art.title,
                content: art.content,
                announce: art.announce,
                sourceUrl: art.source_url,
                sourceName: art.source_name,
                publishedAt: art.published_at,
                createdAt: art.created_at
            },
            favorite: false
        }));

        return NextResponse.json({
            '@context': '/api/contexts/ProjectArticle',
            '@id': `/api/project-articles/${projectId}`,
            '@type': 'hydra:Collection',
            'hydra:totalItems': members.length,
            'hydra:member': members,
            'hydra:view': {
                '@id': `/api/project-articles/${projectId}?page=1`,
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': `/api/project-articles/${projectId}?page=1`,
                'hydra:last': `/api/project-articles/${projectId}?page=1`
            }
        });
    } catch {
        return NextResponse.json({
            '@context': '/api/contexts/ProjectArticle',
            '@id': '/api/project-articles',
            '@type': 'hydra:Collection',
            'hydra:totalItems': 0,
            'hydra:member': []
        });
    }
}
