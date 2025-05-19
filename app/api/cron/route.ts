import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    console.log('coucou')
    console.log(req.headers.get('Authorization'))
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('coucou')
    return NextResponse.json({ ok: true });
}