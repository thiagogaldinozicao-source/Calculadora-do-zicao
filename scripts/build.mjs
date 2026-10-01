// Copia o app web pra pasta www/ (que o Capacitor empacota no app iOS).
import { rmSync, mkdirSync, cpSync } from 'node:fs';
rmSync('www', { recursive: true, force: true });
mkdirSync('www');
for (const f of ['index.html', 'manifest.webmanifest', 'privacidade.html', 'icons', 'fonts']) {
  cpSync(f, `www/${f}`, { recursive: true });
}
console.log('www/ pronto');
