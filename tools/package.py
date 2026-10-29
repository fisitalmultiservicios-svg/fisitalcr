"""Generar paquetes de instalación y actualización sin configuración ni medios privados."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
common = ['public_html/index.php', 'public_html/admin.php', 'public_html/api.php', 'public_html/enlaces.js', 'fisital-private/bootstrap.php']
full = common + ['LEEME-CPANEL.md', 'ACTUALIZAR.md', 'fisital-private/.htaccess',
 'fisital-private/config.example.php', 'fisital-private/schema.sql', 'fisital-private/seed.json',
 'public_html/.htaccess', 'public_html/.user.ini',
 'public_html/conexion.php', 'public_html/instalar.php', 'public_html/uploads/.htaccess']
(root/'descargas').mkdir(exist_ok=True)
for filename, files in [('fisitalcr-cpanel.zip', full), ('fisitalcr-cpanel-actualizacion.zip', common+['ACTUALIZAR.md']), ('fisitalcr-actualizacion-clientes.zip', common+['ACTUALIZAR.md']), ('fisitalcr-actualizacion-videos-whatsapp.zip', common+['ACTUALIZAR.md']), ('fisitalcr-actualizacion-multimedia.zip', common+['ACTUALIZAR.md'])]:
 target = root/'descargas'/filename
 with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
  # No directory entries in update ZIP: keep permissions of existing directories.
  if filename == 'fisitalcr-cpanel.zip':
   for directory in ['fisital-private/', 'public_html/', 'public_html/uploads/']:
    info=ZipInfo(directory);info.external_attr=((0o40700 if directory=='fisital-private/' else 0o40755)<<16)|0x10;archive.writestr(info,'')
  for name in files:
   info=ZipInfo(name);info.compress_type=ZIP_DEFLATED
   info.external_attr=(0o100600 if name.startswith('fisital-private/') else 0o100644)<<16
   archive.writestr(info,(root/name).read_bytes())
 with ZipFile(target) as archive:
  assert archive.testzip() is None
  assert set(archive.namelist())-set(files) <= {'fisital-private/','public_html/','public_html/uploads/'}
  for name in files: assert archive.read(name)==(root/name).read_bytes()
 print(filename, target.stat().st_size, 'bytes; contenido verificado')

# Alternative supported by cPanel when the browser rejects ZIP downloads.
import io
import tarfile
from zipfile import ZipFile
for basename in ['fisitalcr-actualizacion-videos-whatsapp','fisitalcr-actualizacion-multimedia']:
 source = root/'descargas'/(basename+'.zip')
 target = root/'descargas'/(basename+'.tar.gz')
 with ZipFile(source) as zip_source, tarfile.open(target, 'w:gz', format=tarfile.USTAR_FORMAT) as archive:
  for entry in zip_source.infolist():
   if entry.is_dir(): continue
   data=zip_source.read(entry.filename)
   info=tarfile.TarInfo(entry.filename);info.size=len(data)
   info.mode=0o600 if entry.filename.startswith('fisital-private/') else 0o644
   archive.addfile(info,io.BytesIO(data))
 with tarfile.open(target,'r:gz') as archive, ZipFile(source) as zip_source:
  assert set(archive.getnames())==set(zip_source.namelist())
  for entry in archive.getmembers():
   assert entry.isfile() and not entry.name.startswith('/') and '..' not in Path(entry.name).parts
   assert archive.extractfile(entry).read()==zip_source.read(entry.name)
 print(target.name,target.stat().st_size,'bytes; contenido idéntico al ZIP verificado')
