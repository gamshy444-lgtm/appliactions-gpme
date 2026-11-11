"""Download a Commons file (1280 px) and read its author + licence from the file page HTML.
Usage: getphoto.py <dest.jpg> "File:Name.jpg"  → appends a line to <dest dir>/CREDITS.txt"""
import sys, re, subprocess, urllib.parse, html, os
UA = "HistoriaBot/1.0 (https://github.com/gamshy444-lgtm/appliactions-gpme; educational)"
dest, title = sys.argv[1], sys.argv[2]; name = title.split(':', 1)[1].replace(' ', '_')
q = urllib.parse.quote(name)
subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, "-o", dest, f"https://commons.wikimedia.org/wiki/Special:FilePath/{q}?width=1280"], check=True)
kind = subprocess.run(["file", "-b", dest], capture_output=True, text=True).stdout
if 'image' not in kind: print('FAIL', dest, kind[:40]); os.remove(dest); sys.exit(1)
if 'PNG' in kind: subprocess.run(["/tmp/claude-0/-home-user-appliactions-gpme/f633cfba-3a7c-5966-874e-0eee0a44e957/scratchpad/bin/ffmpeg", "-y", "-loglevel", "error", "-i", dest, "-q:v", "2", dest + '.tmp.jpg']); os.replace(dest + '.tmp.jpg', dest)
page = subprocess.run(["curl", "-sL", "-m", "30", "-A", UA, f"https://commons.wikimedia.org/wiki/File:{q}"], capture_output=True, text=True).stdout
lic = re.findall(r'class="licensetpl_short[^"]*"[^>]*>([^<]+)<', page)
auth = re.search(r'id="fileinfotpl_aut"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>', page, re.S)
author = re.sub(r'\s+', ' ', re.sub('<[^>]+>', '', html.unescape(auth.group(1)))).strip()[:80] if auth else '?'
licence = html.unescape(lic[0]).strip() if lic else '?'
line = f"{os.path.basename(dest)} — {author} — {licence} — https://commons.wikimedia.org/wiki/File:{name}"
open(os.path.join(os.path.dirname(dest), 'CREDITS.txt'), 'a').write(line + '\n'); print(line)
