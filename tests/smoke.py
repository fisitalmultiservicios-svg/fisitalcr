"""Prueba funcional contra una base de datos LOCAL VACÍA; nunca producción.
FISITAL_TEST_URL=http://127.0.0.1:8080 python3 tests/smoke.py
La configuración de pruebas usa setup_key='a'*48 y HTTPS desactivado solo localmente.
"""
import os, json, re, urllib.request, urllib.error, http.cookiejar, urllib.parse
BASE=os.environ.get('FISITAL_TEST_URL','http://127.0.0.1:8080')
class Client:
 def __init__(self):
  self.jar=http.cookiejar.CookieJar();self.http=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar));self.csrf=''
 def request(self,path,data=None,headers=None):
  h=headers or {};blob=None
  if data is not None:
   blob=json.dumps(data).encode();h={'Content-Type':'application/json','X-CSRF-Token':self.csrf,**h}
  req=urllib.request.Request(BASE+'/'+path,data=blob,headers=h)
  try:
   with self.http.open(req) as r:return r.status,r.read().decode()
  except urllib.error.HTTPError as e:return e.code,e.read().decode()
 def api(self,action,data=None):
  code,raw=self.request('api.php?action='+action,data);return code,json.loads(raw)
def expect(condition,message):
 assert condition,message
 print('PASS',message)
admin=Client();visitor=Client()
code,html=admin.request('instalar.php');expect(code==200,'Installer opens')
token=re.search(r'name="csrf" value="([a-f0-9]+)"',html).group(1)
form=urllib.parse.urlencode({'csrf':token,'setup_key':'a'*48,'password':'TestPassword!2026','confirm':'TestPassword!2026'}).encode()
with admin.http.open(urllib.request.Request(BASE+'/instalar.php',data=form)) as r: html=r.read().decode()
expect('Instalación completada.' in html,'Installer creates schema, seed and admin')
expect(admin.request('instalar.php')[0]==403,'Installer cannot run twice')
code,state=admin.api('session');admin.csrf=state['csrf']
expect('data' not in state,'Anonymous session exposes no content or contacts')
expect(admin.api('save',{'data':{},'revision':1})[0]==401,'Anonymous writes denied')
expect(admin.api('login',{'password':'wrong'})[0]==401,'Wrong password denied')
code,state=admin.api('login',{'password':'TestPassword!2026'});expect(code==200,'Password login works')
admin.csrf=state['csrf'];data=state['data'];revision=state['revision']
expect('pass' not in data['cfg'],'Password never returned')
code,html=visitor.request('index.php');expect(code==200 and 'Historias con calidad de cine' in html,'Public site renders')
visitor.csrf=re.search(r"'X-CSRF-Token':\s*\"([a-f0-9]+)\"",html).group(1)
expect(visitor.api('lead',{'empresa':'Prueba <segura>','tel':'+506 8888 7777','src':'Productos','website':''})[0]==201,'Public form stores a contact')
expect('Prueba <segura>' not in visitor.request('index.php')[1],'Contacts remain private')
code,state=admin.api('session');expect(len(state['data']['leads'])==1,'Admin reads submitted contact')
data['home']={'h1a':'Cambio desde MySQL'}
code,result=admin.api('save',{'data':data,'revision':revision});expect(code==200,'Admin saves content')
revision=result['revision']
expect('Cambio desde MySQL' in visitor.request('index.php')[1],'Another visitor receives published content')
expect(len(admin.api('session')[1]['data']['leads'])==1,'Stale content save preserves new contacts')
expect(admin.api('save',{'data':data,'revision':revision-1})[0]==409,'Concurrent edits rejected')
data['home']['logo']='javascript:alert(1)'
expect(admin.api('save',{'data':data,'revision':revision})[0]==400,'Unsafe media URL rejected')
data['home'].pop('logo')
expect(admin.request('api.php?action=save',{'data':data,'revision':revision},{'X-CSRF-Token':'bad'})[0]==403,'CSRF forgery rejected')
# Real multipart upload, including MIME validation.
def upload(filename,content,mime):
 boundary='FisitalTestBoundary'
 body=(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{filename}"\r\nContent-Type: {mime}\r\n\r\n').encode()+content+f'\r\n--{boundary}--\r\n'.encode()
 req=urllib.request.Request(BASE+'/api.php?action=upload',data=body,headers={'X-CSRF-Token':admin.csrf,'Content-Type':'multipart/form-data; boundary='+boundary})
 try:
  with admin.http.open(req) as r:return r.status,json.loads(r.read())
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read())
expect(upload('evil.php',b'<?php echo 1;?>','image/png')[0]==400,'Disguised executable upload rejected')
import base64
png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=')
code,result=upload('foto.png',png,'image/png');expect(code==201,'Image upload persists')
with visitor.http.open(BASE+'/'+result['url']) as r:expect(r.read()==png,'Another visitor retrieves uploaded image')
lead=admin.api('session')[1]['data']['leads'][0]
expect(admin.api('delete_lead',{'id':lead['id']})[0]==200,'Contact deletion works')
expect(not admin.api('session')[1]['data']['leads'],'Deleted contact removed')
data['cfg']['pass']='NewPassword!2026'
code,result=admin.api('save',{'data':data,'revision':revision});expect(code==200,'Password change works')
expect(admin.api('logout',{})[0]==200,'Logout works')
code,state=admin.api('session');admin.csrf=state['csrf']
expect(admin.api('login',{'password':'TestPassword!2026'})[0]==401,'Old password invalidated')
expect(admin.api('login',{'password':'NewPassword!2026'})[0]==200,'New password accepted')
print('All functional checks passed.')
