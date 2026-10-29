/* Enlaces de video y WhatsApp. Los reproductores se crean solo al hacer clic. */
(function(root){
'use strict';
function normalize(value){
 var s=String(value||'').trim();
 if(/^(?:https?:\/\/)?(?:www\.)?wa\.me(?:\/|$)/i.test(s))return s.replace(/^(?:https?:\/\/)?(?:www\.)?wa\.me/i,'https://wa.me');
 if(/^(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be|vimeo\.com)\//i.test(s))return 'https://'+s;
 return s;
}
function seconds(s){if(/^\d+$/.test(s||''))return Number(s);var m=String(s||'').match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);return m?Number(m[1]||0)*3600+Number(m[2]||0)*60+Number(m[3]||0):0}
function video(value){
 var source=normalize(value),u;try{u=new URL(source,'https://local.invalid/')}catch(e){return {type:'unsupported',source:source}}
 if(u.protocol!=='https:')return {type:'unsupported',source:source};
 var host=u.hostname.toLowerCase(),parts=u.pathname.split('/').filter(Boolean),id='',start=seconds(u.searchParams.get('start')||u.searchParams.get('t'));
 if(host==='youtu.be')id=parts[0]||'';
 else if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host))id=['shorts','live','embed'].includes(parts[0])?parts[1]||'':u.searchParams.get('v')||'';
 if(/^[\w-]{11}$/.test(id))return {type:'youtube',source:source,id:id,ratio:parts[0]==='shorts'?9/16:16/9,embed:'https://www.youtube.com/embed/'+id+'?autoplay=1&playsinline=1&rel=0'+(start?'&start='+start:''),poster:'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'};
 if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)){
  var index=parts[0]==='video'?1:0;id=parts[index]||'';var hash=u.searchParams.get('h')||parts[index+1]||'';
  if(/^\d+$/.test(id))return {type:'vimeo',source:source,id:id,embed:'https://player.vimeo.com/video/'+id+'?autoplay=1&playsinline=1'+(/^[a-z0-9]+$/i.test(hash)?'&h='+hash:''),poster:''};
 }
 if(['facebook.com','www.facebook.com','m.facebook.com','web.facebook.com','fb.watch'].includes(host)){
  var original='https://'+(host==='fb.watch'?'fb.watch':'www.facebook.com')+u.pathname+u.search;
  var embed='https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(original)+'&show_text=false&width=500&autoplay=true';
  return {type:'facebook',source:source,ratio:parts[0]==='reel'||parts[0]==='reels'?9/16:16/9,embed:embed,preview:embed.replace('autoplay=true','autoplay=false'),poster:''};
 }
 if(host==='drive.google.com'){
  id=parts[0]==='file'&&parts[1]==='d'?parts[2]:u.searchParams.get('id');
  if(/^[\w-]+$/.test(id||''))return {type:'drive',source:source,embed:'https://drive.google.com/file/d/'+id+'/preview',poster:'https://drive.google.com/thumbnail?id='+id+'&sz=w800'};
 }
 if(/\.(?:mp4|webm)$/i.test(u.pathname))return {type:'file',source:source,poster:''};
 return {type:'unsupported',source:source,poster:''};
}
function contact(cfg){var c=cfg||{},custom=normalize(c.contactUrl);if(custom)return custom;var n=String(c.whatsapp||'').replace(/\D/g,'');return n?'https://wa.me/'+n+'?text='+encodeURIComponent(c.waMsg||'Hola Fisital, me gustaría más información.'):'mailto:'+(c.email||'hola@fisital.com')}
function ratio(info,format){return format==='Vertical'?9/16:format==='Horizontal'?16/9:(info.ratio||16/9)}
var api={normalize:normalize,video:video,contact:contact,ratio:ratio};root.FisitalLinks=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
