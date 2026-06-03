import { ImageResponse } from 'next/og';

export const alt = 'Mit-Mak Motors — Trusted. Awarded. Unmatched.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0A0A',
          padding: '72px',
          backgroundImage:
            'radial-gradient(120% 120% at 100% 0%, rgba(225,6,0,0.35) 0%, rgba(10,10,10,0) 55%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', width: 56, height: 44, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '44px solid #E10600' }} />
            <div style={{ position: 'absolute', right: 0, bottom: 0, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '44px solid #9A0400' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: 4 }}>MIT-MAK MOTORS</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 800, lineHeight: 1, color: '#fff', letterSpacing: -3 }}>TRUSTED.</div>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 800, lineHeight: 1, color: '#7C8088', letterSpacing: -3 }}>AWARDED.</div>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 800, lineHeight: 1, color: '#E10600', letterSpacing: -3 }}>UNMATCHED.</div>
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#B9BCC2' }}>
          Premium pre-owned · Pretoria · Delivered FREE nationwide
        </div>
      </div>
    ),
    { ...size },
  );
}
