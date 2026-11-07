"""Empaquetar únicamente la galería estática, sin respaldo PHP, credenciales o contactos."""
from pathlib import Path
import json,re,tarfile
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
source=root/'propuestas-fisital'
files=sorted(p for p in source.rglob('*') if p.is_file())
assert all(p.suffix.lower() in ['.html','.css','.js','.md','.png','.jpg'] for p in files)
content=(source/'assets/contenido.js').read_text()
data=json.loads(content.removeprefix('window.FISITAL_CONTENT=').strip().removesuffix(';'))
assert 'leads' not in data and 'pass' not in data['cfg']
assert len(data['products'])==4 and len(data['portfolio'])==6 and len(data['clients'])==8 and len(data['news'])==5
for p in files:
 assert p.name not in ['config.php','bootstrap.php','api.php','admin.php']
out=root/'descargas';out.mkdir(exist_ok=True)
zip_path=out/'fisitalcr-seis-propuestas-html.zip'
with ZipFile(zip_path,'w',ZIP_DEFLATED) as z:
 for p in files:
  i=ZipInfo(p.relative_to(root).as_posix());i.external_attr=0o100644<<16;i.compress_type=ZIP_DEFLATED;z.writestr(i,p.read_bytes())
with ZipFile(zip_path) as z:
 assert z.testzip() is None
 for p in files:assert z.read(p.relative_to(root).as_posix())==p.read_bytes()
tar_path=out/'fisitalcr-seis-propuestas-html.tar.gz'
with tarfile.open(tar_path,'w:gz') as t:
 for p in files:t.add(p,arcname=p.relative_to(root).as_posix(),recursive=False)
assert zip_path.stat().st_size<32*1024*1024
print(len(files),'archivos de galería; ZIP',zip_path.stat().st_size,'bytes; TAR.GZ',tar_path.stat().st_size,'bytes.')
print('Se excluyeron contactos, credenciales, PHP y la carpeta uploads.')
