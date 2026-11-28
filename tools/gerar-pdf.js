const { chromium } = require('playwright');
const pages = ['index','projects/defesa-civil','projects/jequie','projects/xequemath','projects/educahubplay','projects/hq-lab','projects/inventai','projects/labconect','projects/andre-fraga'];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
  let i = 0;
  for (const pg of pages) {
    await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(3000);
    // scroll to trigger lazy/scrolltriggers
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(1200);
    await p.addStyleTag({ content: `
      .reveal, [class*="reveal"], .char, .hero-title .char { opacity: 1 !important; transform: none !important; }
      .cursor-dot, .cursor-ring, #cursor-dot, #cursor-ring, .scroll-hint, #tip { display: none !important; }
      nav#mainnav, nav.fixed, .fixed { position: absolute !important; }
      .grain { display: none !important; } .aurora { display: none !important; } body { background-image: radial-gradient(ellipse at 15% 0%, rgba(124,245,197,.16), transparent 55%), radial-gradient(ellipse at 90% 60%, rgba(179,161,255,.14), transparent 55%) !important; }
      .marquee { animation: none !important; }
      details { display: block; }
      .glass, .kpi, .chart, .step, figure, img, table, tr, ul.feat li, .tl li, h1, h2, h3 { break-inside: avoid; page-break-inside: avoid; }
      h2, h3, .eyebrow, .group-title { break-after: avoid; page-break-after: avoid; }
      #numeros, #projects, #como { break-before: page; } #stack { break-inside: avoid; break-before: page; } #manifesto { padding-top: 2rem !important; padding-bottom: 2rem !important; }
      .min-h-screen { min-height: 0 !important; }
      section.min-h-screen { min-height: 1450px !important; }
      #projects { padding-top: 1.5rem !important; } #projects .mb-20 { margin-bottom: 1.5rem !important; } #projects h2 { font-size: 2.6rem !important; }
      .group-title { margin: 1.5rem 0 1rem !important; }
      body > div.wrap > footer { margin-top: .5rem !important; padding: .8rem 0 !important; }
      main.wrap h2 { margin-top: 2rem !important; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    `});
    await p.evaluate(() => { document.querySelectorAll('[style*="opacity: 0"]').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; }); if (window.gsap) gsap.globalTimeline.progress(1); });
    await p.evaluate(async () => {
      const imgs=[...document.images].filter(i=>i.complete && i.naturalWidth>0);
      for (const im of imgs) {
        const r=im.getBoundingClientRect(); const tw=Math.max(1,Math.round(r.width*1.6));
        if (im.naturalWidth <= tw*1.1) continue;
        const th=Math.round(im.naturalHeight*tw/im.naturalWidth);
        const c=document.createElement('canvas'); c.width=tw; c.height=th;
        c.getContext('2d').drawImage(im,0,0,tw,th);
        const png=/\.png/i.test(im.src);
        let url;
        if (png) { const d=c.getContext('2d').getImageData(0,0,tw,th).data; let alpha=false; for(let k=3;k<d.length;k+=4000){ if(d[k]<255){alpha=true;break;} } url = alpha ? c.toDataURL('image/png') : c.toDataURL('image/jpeg',0.8); }
        else url=c.toDataURL('image/jpeg',0.8);
        im.srcset=''; im.src=url; await im.decode().catch(()=>{});
      }
    });
    await p.waitForTimeout(400);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.pdf({ path: `/tmp/claude-0/s/pdf-${String(i).padStart(2,'0')}.pdf`, format: 'A4', scale: (['index','projects/defesa-civil','projects/jequie','projects/inventai'].includes(pg) ? 0.56 : 0.62), printBackground: true, margin: {top:0,bottom:0,left:0,right:0} });
    console.log(pg, h); i++;
  }
  await b.close();
})();
