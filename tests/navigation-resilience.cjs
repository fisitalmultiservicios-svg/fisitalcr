// Ejecutar después de smoke.py, únicamente en la instalación local de pruebas.
const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');const cp=require('node:child_process');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const setup=await browser.newPage();const base=process.env.FISITAL_TEST_URL||'http://127.0.0.1:8080';
 await Promise.all([setup.waitForResponse(r=>r.url().includes('action=session')),setup.goto(base+'/admin.php')]);await setup.locator('#pw').fill('NewPassword!2026');await setup.locator('#go').click();await setup.locator('#app').waitFor({state:'visible'});
 await setup.evaluate(async()=>{const s=await(await fetch('api.php?action=session')).json();s.data.portfolio[0].video='https://www.facebook.com/reel/2828086157523112';s.data.portfolio[0].img='';const r=await fetch('api.php?action=save',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':s.csrf},body:JSON.stringify({data:s.data,revision:s.revision})});if(!r.ok)throw Error(await r.text())});
 const old=cp.execFileSync('git',['show','ecb882e:public_html/enlaces.js'],{encoding:'utf8'});assert(!old.includes('function ratio('));
 for(const [name,source,status] of [['current',fs.readFileSync('public_html/enlaces.js','utf8'),200],['old',old,200],['missing','',404],['failed','window.FisitalLinks={video:function(){throw Error("Simulated media failure")}};',200]]){
  const ctx=await browser.newContext();await ctx.route('**/enlaces.js?*',r=>r.fulfill({status,contentType:'application/javascript',body:source}));await ctx.route('https://www.facebook.com/**',r=>r.fulfill({body:'<title>Proveedor simulado</title>'}));const p=await ctx.newPage();
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   await p.setViewportSize(viewport);await p.goto(base+'/index.php');
   for(const target of ['portafolio','noticias']){if(viewport.width<860)await p.getByRole('button',{name:/Menú/}).click();await p.locator('nav a[data-v='+target+']').click();await p.locator('#v-'+target).waitFor({state:'visible'});assert.equal(await p.locator('.view.on').getAttribute('id'),'v-'+target)}
   if(viewport.width<860)await p.getByRole('button',{name:/Menú/}).click();await p.locator('nav a[href="#servicios"]').click();await p.locator('#v-inicio').waitFor({state:'visible'});
   await p.goto(base+'/index.php#portafolio');await p.locator('#v-portafolio').waitFor({state:'visible'});
  }
  console.log('PASS public navigation with media helper:',name);await ctx.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
