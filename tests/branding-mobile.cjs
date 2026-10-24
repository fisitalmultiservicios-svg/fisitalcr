// Ejecutar después de smoke.py, solo con los datos locales de pruebas.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext();const page=await context.newPage();const errors=[];
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 const base=process.env.FISITAL_TEST_URL||'http://127.0.0.1:8080';
 await Promise.all([page.waitForResponse(r=>r.url().includes('action=session')),page.goto(base+'/admin.php')]);
 await page.locator('#pw').fill('NewPassword!2026');await page.locator('#go').click();await page.locator('#app').waitFor({state:'visible'});
 await page.locator('[data-t=land]').click();
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
 const paths={};
 for(const field of ['logo','favicon']){
  const widget=page.locator('.mf').filter({has:page.locator('input[name='+field+']')});
  await widget.locator('input[type=file]').setInputFiles({name:field+'.png',mimeType:'image/png',buffer:png});
  await widget.locator('.st').filter({hasText:'Listo:'}).waitFor();
  paths[field]=await widget.locator('input[type=hidden]').inputValue();assert(paths[field].startsWith('uploads/'));
 }
 await Promise.all([page.waitForResponse(r=>r.url().includes('action=save')&&r.ok()),page.locator('#lsv').click()]);
 const visitor=await context.newPage();const response=await visitor.goto(base+'/index.php');const html=await response.text();
 assert(html.includes('src="'+paths.logo+'"'),'Selected logo is rendered by PHP');
 assert(html.includes('rel="icon" href="'+paths.favicon+'"'),'Favicon is rendered by PHP');
 await visitor.locator('nav img.logo').evaluate(i=>i.decode());
 assert.equal(await visitor.locator('nav img.logo').evaluate(i=>getComputedStyle(i).filter),'none','Logo keeps its colors');
 assert.equal(await visitor.locator('link[rel=icon]').getAttribute('href'),paths.favicon);
 await page.reload();await page.locator('#app').waitFor({state:'visible'});await page.locator('[data-t=land]').click();
 assert.equal(await page.locator('input[name=logo]').inputValue(),paths.logo,'Logo survives reloading panel');
 assert.equal(await page.locator('input[name=favicon]').inputValue(),paths.favicon,'Favicon survives reloading panel');
 await page.locator('[data-t=products]').click();await page.getByRole('button',{name:'Editar',exact:true}).first().click();
 const url='https://example.com/producto?origen=fisital&modo=demo';
 await page.locator('#df [name=url]').fill(url);
 await Promise.all([page.waitForResponse(r=>r.url().includes('action=save')&&r.ok()),page.locator('#df').getByRole('button',{name:'Guardar',exact:true}).click()]);
 await page.locator('#dg').waitFor({state:'hidden'});await visitor.reload();
 const link=visitor.locator('.product-link');assert.equal(await link.count(),1,'Products without URL have no link');assert.equal(await link.getAttribute('href'),url);assert.equal(await link.getAttribute('target'),'_blank');assert((await link.getAttribute('rel')).includes('noopener'));
 await context.route('https://example.com/**',route=>route.fulfill({body:'<title>Destino del producto</title>'}));
 const [popup]=await Promise.all([visitor.waitForEvent('popup'),link.click()]);await popup.waitForLoadState();assert.equal(popup.url(),url);await popup.close();
 for(const unsafe of ['javascript:alert(1)','http://example.com','uploads/'+'a'.repeat(40)+'.png']){
  const status=await page.evaluate(async bad=>{const state=await(await fetch('api.php?action=session')).json();state.data.products[0].url=bad;const r=await fetch('api.php?action=save',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},body:JSON.stringify({data:state.data,revision:state.revision})});return r.status},unsafe);
  assert.equal(status,400,'Unsafe product URL is rejected');
 }
 for(const width of [320,390,768,860]){
  await visitor.setViewportSize({width,height:844});const toggle=visitor.getByRole('button',{name:/Menú/});await toggle.waitFor({state:'visible'});
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert(await visitor.locator('nav .brand').isVisible(),'Logo remains visible on mobile');
  await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  for(const anchor of await visitor.locator('#site-menu a:visible').all()) assert(await anchor.isVisible(),'All menu destinations are available');
  await visitor.locator('#site-menu [data-v=portafolio]').click();await visitor.locator('#v-portafolio').waitFor({state:'visible'});assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await toggle.click();await visitor.locator('#site-menu [data-v=noticias]').click();await visitor.locator('#v-noticias').waitFor({state:'visible'});
  await toggle.click();await visitor.locator('#site-menu a[href="#productos"]').click();await visitor.locator('#v-inicio').waitFor({state:'visible'});
  await toggle.click();await visitor.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert(await toggle.evaluate(el=>el===document.activeElement));
  assert(await visitor.locator('body').evaluate(el=>el.scrollWidth<=innerWidth+2),'Page fits viewport '+width);
 }
 await visitor.setViewportSize({width:1280,height:900});assert(await visitor.locator('#site-menu').isVisible());assert(!(await visitor.getByRole('button',{name:/Menú/}).isVisible()));
 assert.deepEqual(errors,[],'No JavaScript runtime errors');
 console.log('PASS logo and favicon upload/persistence/server rendering; logo colors; product links/new tab and URL validation; mobile menu at 320/390/768/860 pixels, navigation, Escape, desktop and no horizontal overflow.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
