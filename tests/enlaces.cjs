const assert=require('node:assert/strict');const links=require('../public_html/enlaces.js');
for(const url of ['https://www.youtube.com/watch?v=dQw4w9WgXcQ','https://youtu.be/dQw4w9WgXcQ','https://www.youtube.com/shorts/dQw4w9WgXcQ','https://www.youtube.com/live/dQw4w9WgXcQ','youtube.com/watch?v=dQw4w9WgXcQ']){const v=links.video(url);assert.equal(v.type,'youtube');assert.equal(v.poster,'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg')}
assert(links.video('https://youtu.be/dQw4w9WgXcQ?t=1m30s').embed.endsWith('&start=90'));
const fb=links.video('https://www.facebook.com/reel/2828086157523112');assert.equal(fb.type,'facebook');assert(fb.embed.startsWith('https://www.facebook.com/plugins/video.php?'));assert.equal(new URL(fb.embed).searchParams.get('href'),'https://www.facebook.com/reel/2828086157523112');assert(fb.preview.endsWith('autoplay=false'));
assert.equal(links.video('https://facebook.com.evil.test/reel/1').type,'unsupported');
assert(links.video('https://vimeo.com/12345678/abcdef').embed.endsWith('&h=abcdef'));
assert.equal(links.video('https://drive.google.com/file/d/ABc123_/view').type,'drive');
assert.equal(links.video('uploads/'+'a'.repeat(40)+'.mp4').type,'file');
assert.equal(links.video('https://example.com/video.mp4?token=public').type,'file');
assert.equal(links.video('https://instagram.com/reel/example').type,'unsupported');
assert.equal(links.normalize('wa.me/50688887777?text=Hola'),'https://wa.me/50688887777?text=Hola');
assert.equal(links.normalize('http://www.wa.me/message/ABC'),'https://wa.me/message/ABC');
assert.equal(links.contact({contactUrl:'wa.me/message/ABC',whatsapp:'50688887777'}),'https://wa.me/message/ABC');
assert(links.contact({whatsapp:'50688887777'}).startsWith('https://wa.me/50688887777?text='));
console.log('PASS video URL formats, Facebook reel, YouTube thumbnails/timestamps, private Vimeo, Drive, MP4 and WhatsApp normalization.');
