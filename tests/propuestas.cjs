const {chromium}=require('playwright');const fs=require('fs');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const files=process.argv.length>2?process.argv.slice(2):['01-aura','02-forma','03-cinema','04-sistema','05-orbita','06-estudio'];
 const out=require('path').resolve(__dirname,'../propuestas-fisital/vistas-previas');fs.mkdirSync(out,{recursive:true});const errors=[];
 for(const file of files){
  const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});page.on('pageerror',e=>errors.push(file+': '+e.message));
  await page.goto('http://127.0.0.1:8088/'+file+'.html');await page.locator('h1').waitFor();await page.locator('.hero img').first().count().then(async n=>{if(n)await page.locator('.hero img').first().evaluate(i=>i.decode())});
  assert.equal(await page.locator('.product-card').count(),4);assert.equal(await page.locator('.work-card').count(),6);assert.equal(await page.locator('.client-card').count(),8);assert.equal(await page.locator('.news-card').count(),5);
  for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:1000});assert(await page.locator('body').evaluate(el=>el.scrollWidth<=innerWidth+2),'No horizontal overflow '+file+' @ '+width)}
  await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:out+'/'+file+'.jpg',type:'jpeg',quality:88});
  await page.locator('[data-filter="Foto"]').click();assert.equal(await page.locator('.work-card:visible').count(),3);await page.locator('[data-filter="Todos"]').click();assert.equal(await page.locator('.work-card:visible').count(),6);
  await page.locator('[data-project="0"]').first().click();await page.getByRole('dialog').waitFor();assert((await page.getByRole('dialog').innerText()).includes('Lanzamiento de producto'));await page.keyboard.press('Escape');
  await page.locator('[data-news="0"]').first().click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Cerrar',exact:true}).count().then(async n=>{if(n)await page.getByRole('button',{name:'Cerrar',exact:true}).click();else await page.getByRole('button',{name:'Cerrar'}).click()});
  await page.locator('[data-reel]').first().click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
  await page.locator('input[name=empresa]').fill('Empresa de prueba');await page.locator('input[name=tel]').fill('50688889999');await page.locator('.contact-form button').click();assert((await page.locator('.form-status').innerText()).includes('No se han enviado'));
  assert.equal(await page.locator('a[href="https://fisitaap.com"]').count(),1);assert.equal(await page.locator('a[href="https://markarh.com"]').count(),1);
  await page.setViewportSize({width:390,height:1100});await page.goto('http://127.0.0.1:8088/'+file+'.html');await page.getByRole('button',{name:/Menú/}).click();await page.locator('.nav-links a[href="#portafolio"]').click();assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('.work-card').count(),6);
  await page.goto('http://127.0.0.1:8088/'+file+'.html');await page.screenshot({path:out+'/'+file+'-movil.jpg',type:'jpeg',quality:85});
  console.log('PASS',file,': contenido completo, tamaños 320/390/768/1440, filtros, diálogos, enlaces, formulario demostrativo y menú móvil.');await page.close();
 }
 assert.deepEqual(errors,[]);const gallery=await browser.newPage({viewport:{width:1440,height:1100}});await gallery.goto('http://127.0.0.1:8088/');assert.equal(await gallery.locator('.card').count(),6);await gallery.screenshot({path:out+'/galeria.jpg',type:'jpeg',quality:85,fullPage:true});await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
