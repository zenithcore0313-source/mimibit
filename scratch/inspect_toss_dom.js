import https from 'https';

https.get('https://toss.im/', (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    // find video tag and its container
    const videoTag = html.match(/<video[^>]+>/gi);
    console.log('Video tag:', videoTag);
    const canvasTag = html.match(/<canvas[^>]+>/gi);
    console.log('Canvas tag:', canvasTag);
    // Find headings inside hero
    const h1 = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
    console.log('H1:', h1);
    const h2 = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi);
    console.log('H2:', h2 ? h2.slice(0, 5) : null);
  });
}).on('error', err => console.error(err));
