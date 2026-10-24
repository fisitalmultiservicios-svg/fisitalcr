// Ejecutar después de smoke.py, únicamente sobre la base local de pruebas.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
 const dialogs=[];page.on('dialog',async d=>{dialogs.push(d.message());await d.accept()});
 const base=process.env.FISITAL_TEST_URL||'http://127.0.0.1:8080';
 await Promise.all([page.waitForResponse(r=>r.url().includes('action=session')),page.goto(base+'/admin.php')]);
 await page.locator('#pw').fill('NewPassword!2026');await page.locator('#go').click();await page.locator('#app').waitFor({state:'visible'});
 await page.locator('[data-t=land]').click();await page.locator('[name=h1a]').fill('Fisital probado en navegador');await page.locator('#lsv').click();
 await page.waitForFunction(()=>document.querySelector('#lsv')!==null);await page.waitForTimeout(300);
 assert(dialogs.includes('Landing guardada'),'UI confirms actual database save');
 const visitor=await browser.newPage();visitor.on('pageerror',e=>errors.push(e.message));await visitor.goto(base+'/index.php');
 assert.equal(await visitor.locator('[data-h=h1a]').innerText(),'Fisital probado en navegador');
 await visitor.locator('a[data-v=portafolio]').click();await visitor.locator('#v-portafolio').waitFor({state:'visible'});
 await visitor.locator('.chip').last().click();
 await visitor.locator('a[data-v=noticias]').click();await visitor.locator('#v-noticias').waitFor({state:'visible'});
 await visitor.locator('#v-noticias form [name=empresa]').fill('Contacto desde navegador');await visitor.locator('#v-noticias form [name=tel]').fill('50688889999');await visitor.locator('#v-noticias form button').click();await visitor.getByText('¡Gracias! Te contactaremos pronto.').waitFor();
 // Refresh the session to retrieve the new lead.
 await page.reload();await page.locator('#app').waitFor({state:'visible'});await page.locator('[data-t=leads]').click();await page.getByText('Contacto desde navegador').waitFor();
 for(const tab of ['portfolio','news','products','reel','cfg']){await page.locator('[data-t='+tab+']').click();await page.locator('main h1').waitFor()}
 await page.locator('[data-t=news]').click();await page.getByRole('button',{name:'Editar',exact:true}).nth(1).click();await page.locator('#df [name=feat]').check();await page.locator('#df').getByRole('button',{name:'Guardar',exact:true}).click();await page.locator('#dg').waitFor({state:'hidden'});assert(await page.evaluate(async()=>{const j=await(await fetch('api.php?action=session')).json();return j.data.news[1].feat===true&&j.data.news.filter(n=>n.feat).length===1}),'Existing news can become featured');
 await page.locator('[data-t=portfolio]').click();await page.getByRole('button',{name:'+ Agregar'}).click();await page.locator('#df [name=title]').fill('Proyecto de prueba');
 await page.locator('#df input[type=file]').first().setInputFiles({name:'foto.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')});
 await page.getByText('Listo: foto.png').waitFor();await page.locator('#df button[type=submit]').count().then(async n=>{if(n)await page.locator('#df button[type=submit]').click();else await page.locator('#df').getByRole('button',{name:'Guardar',exact:true}).click()});
 await page.locator('#dg').waitFor({state:'hidden'});await page.getByRole('cell',{name:'Proyecto de prueba',exact:true}).waitFor();
 await visitor.reload();await visitor.locator('a[data-v=portafolio]').click();await visitor.getByRole('heading',{name:'Proyecto de prueba',exact:true}).waitFor();
 await visitor.setViewportSize({width:390,height:844});assert(await visitor.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+2),'Mobile page fits viewport');
 assert.deepEqual(errors,[],'No JavaScript runtime errors');
 await page.locator('#out').click();await page.locator('#login').waitFor({state:'visible'});
 console.log('PASS browser: login, all editor sections, database save, public rendering, portfolio filters, contact submission, image upload, project creation, mobile layout, logout; no JavaScript errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
