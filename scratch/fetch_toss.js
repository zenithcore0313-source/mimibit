import https from 'https';

https.get('https://toss.im/', (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const urls = html.match(/https:\/\/[^"'\s)]+\.(mp4|webm|png|jpg|webp)/gi) || [];
    const unique = [...new Set(urls)];
    console.log('Found assets:');
    unique.forEach(u => console.log(u));
  });
}).on('error', err => console.error(err));
