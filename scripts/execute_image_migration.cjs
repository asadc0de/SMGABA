const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function sanitizeFilename(originalName) {
  let name = decodeURIComponent(originalName);
  const ext = path.extname(name).toLowerCase() || '.jpg';
  let base = path.basename(name, path.extname(name));

  base = base
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[—–]/g, '-')
    .replace(/['’"”]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  base = base.replace(/\.jpeg$/, '').replace(/\.jpg$/, '').replace(/\.png$/, '');

  return `${base}${ext}`;
}

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ImageMigrator/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const origin = new URL(url).origin;
          redirectUrl = origin + redirectUrl;
        }
        return downloadFile(redirectUrl, destPath).then(resolve);
      }

      if (res.statusCode !== 200) {
        return resolve({ success: false, statusCode: res.statusCode, error: `HTTP ${res.statusCode}` });
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        const stat = fs.statSync(destPath);
        if (stat.size === 0) {
          fs.unlinkSync(destPath);
          return resolve({ success: false, statusCode: res.statusCode, error: '0 bytes downloaded' });
        }
        resolve({ success: true, size: stat.size });
      });

      fileStream.on('error', (err) => {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve({ success: false, error: err.message });
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.setTimeout(25000, () => {
      req.abort();
      resolve({ success: false, error: 'Request timeout after 25s' });
    });
  });
}

// Ensure public directories exist
const publicDirs = {
  team: path.resolve(process.cwd(), 'public/images/team'),
  awards: path.resolve(process.cwd(), 'public/images/awards'),
  resources: path.resolve(process.cwd(), 'public/images/resources'),
  solutions: path.resolve(process.cwd(), 'public/images/solutions'),
  blog: path.resolve(process.cwd(), 'public/images/blog'),
  stock: path.resolve(process.cwd(), 'public/images/stock'),
};

for (const dir of Object.values(publicDirs)) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  console.log('--- STARTING IMAGE MIGRATION ---');

  const migrationMap = {};
  const failures = [];
  const downloadedFiles = new Set();

  // 1. Scan src/ for all WordPress and Unsplash images
  const exts = ['.ts', '.tsx', '.js', '.jsx', '.json'];
  const allFound = [];

  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.output' && file !== 'dist') {
          scanDir(fullPath);
        }
      } else if (exts.includes(path.extname(file))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

        const urlRegex = /https?:\/\/[^\s'"`)\\]+/gi;
        let match;
        while ((match = urlRegex.exec(content)) !== null) {
          let clean = match[0].replace(/[,;"'\\]+$/, '');
          if (clean.includes('supabase.co/storage')) continue;
          
          if (clean.includes('smgaba.com/wp-content/uploads') || clean.includes('images.unsplash.com')) {
            allFound.push({ url: clean, file: relPath });
          }
        }
      }
    }
  }

  scanDir(path.resolve(process.cwd(), 'src'));

  const uniqueUrls = [...new Set(allFound.map(i => i.url))];
  console.log(`Discovered ${uniqueUrls.length} unique external/WordPress URLs across src/.`);

  // 2. Process WordPress URLs
  const wpUrls = uniqueUrls.filter(u => u.includes('smgaba.com/wp-content/uploads'));
  console.log(`\nProcessing ${wpUrls.length} WordPress URLs...`);

  const resizeRegex = /-\d+x\d+(\.[a-zA-Z]+)$/;

  for (const rawUrl of wpUrls) {
    const cleanUrl = rawUrl.split('?')[0].replace(/\\+$/, '');
    const isResized = resizeRegex.test(cleanUrl);
    const originalUrl = isResized ? cleanUrl.replace(resizeRegex, '$1') : cleanUrl;

    const rawFilename = path.basename(originalUrl);
    const sanitizedFilename = sanitizeFilename(rawFilename);

    let category = 'blog';
    const filesUsing = allFound.filter(i => i.url === rawUrl).map(i => i.file);

    if (filesUsing.some(f => f.includes('teamMembers'))) {
      category = 'team';
    } else if (filesUsing.some(f => f.includes('LogoMarquee') || f.includes('nyc-hospitality') || f.includes('nysra'))) {
      category = 'awards';
    } else if (filesUsing.some(f => f.includes('resourcePosts'))) {
      category = 'resources';
    } else if (filesUsing.some(f => f.includes('industries') || f.includes('solutions') || f.includes('about-us'))) {
      category = 'solutions';
    }

    const localPath = path.join(publicDirs[category], sanitizedFilename);
    const publicUrl = `/images/${category}/${sanitizedFilename}`;

    migrationMap[rawUrl] = publicUrl;
    if (isResized) {
      migrationMap[cleanUrl] = publicUrl;
      migrationMap[originalUrl] = publicUrl;
    }

    if (!downloadedFiles.has(localPath)) {
      console.log(`Downloading [${category}] ${originalUrl} -> ${sanitizedFilename}...`);
      const res = await downloadFile(originalUrl, localPath);
      if (res.success) {
        downloadedFiles.add(localPath);
      } else {
        console.warn(`❌ FAILED: ${originalUrl} (${res.error})`);
        failures.push({ url: originalUrl, category, error: res.error });
      }
    }
  }

  // 3. Process Unsplash URLs
  const unsplashUrls = uniqueUrls.filter(u => u.includes('images.unsplash.com'));
  console.log(`\nProcessing ${unsplashUrls.length} Unsplash URLs...`);

  const unsplashByPhoto = new Map();
  for (const rawUrl of unsplashUrls) {
    const photoIdMatch = rawUrl.match(/(photo-[a-zA-Z0-9-]+)/);
    if (!photoIdMatch) continue;
    
    const photoId = photoIdMatch[1];
    if (!unsplashByPhoto.has(photoId)) {
      unsplashByPhoto.set(photoId, []);
    }
    unsplashByPhoto.get(photoId).push(rawUrl);
  }

  for (const [photoId, urls] of unsplashByPhoto.entries()) {
    const downloadUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=80`;
    const sanitizedFilename = `unsplash-${photoId.toLowerCase()}.jpg`;
    const localPath = path.join(publicDirs.stock, sanitizedFilename);
    const publicUrl = `/images/stock/${sanitizedFilename}`;

    for (const u of urls) {
      migrationMap[u] = publicUrl;
    }

    if (!downloadedFiles.has(localPath)) {
      console.log(`Downloading [stock] ${photoId} -> ${sanitizedFilename}...`);
      const res = await downloadFile(downloadUrl, localPath);
      if (res.success) {
        downloadedFiles.add(localPath);
      } else {
        console.warn(`❌ FAILED: ${downloadUrl} (${res.error})`);
        failures.push({ url: downloadUrl, category: 'stock', error: res.error });
      }
    }
  }

  // 4. Save Migration Map
  const mapPath = path.resolve(process.cwd(), 'src/data/image-migration-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(migrationMap, null, 2), 'utf8');
  console.log(`\nSaved migration map (${Object.keys(migrationMap).length} entries) to src/data/image-migration-map.json.`);

  // 5. Rewrite URLs across src/
  console.log('\nRewriting URLs in src/...');
  let replacedFiles = 0;

  // Sort keys from longest to shortest to avoid partial replacements
  const sortedOldUrls = Object.keys(migrationMap).sort((a, b) => b.length - a.length);

  function rewriteInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.output' && file !== 'dist') {
          rewriteInDir(fullPath);
        }
      } else if (exts.includes(path.extname(file)) && !fullPath.endsWith('image-migration-map.json')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        // Clean up any srcset attributes in blog HTML content
        if (fullPath.includes('blogPosts')) {
          const oldLen = content.length;
          content = content.replace(/srcset=\\"[^\\"]+\\"/g, '');
          content = content.replace(/srcset="[^"]+"/g, '');
          content = content.replace(/sizes=\\"[^\\"]+\\"/g, '');
          content = content.replace(/sizes="[^"]+"/g, '');
          if (content.length !== oldLen) modified = true;
        }

        for (const oldUrl of sortedOldUrls) {
          if (content.includes(oldUrl)) {
            const newUrl = migrationMap[oldUrl];
            content = content.split(oldUrl).join(newUrl);
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          replacedFiles++;
          console.log(`✔ Rewrote: ${path.relative(process.cwd(), fullPath)}`);
        }
      }
    }
  }

  rewriteInDir(path.resolve(process.cwd(), 'src'));
  console.log(`Rewrote references across ${replacedFiles} files in src/.`);

  // 6. Calculate Folder Sizes
  console.log('\n=== DIRECTORY SIZES IN public/images/ ===');
  let grandTotal = 0;
  for (const [cat, dirPath] of Object.entries(publicDirs)) {
    let catSize = 0;
    let fileCount = 0;
    if (fs.existsSync(dirPath)) {
      const dirFiles = fs.readdirSync(dirPath);
      for (const f of dirFiles) {
        const s = fs.statSync(path.join(dirPath, f));
        catSize += s.size;
        fileCount++;
      }
    }
    grandTotal += catSize;
    console.log(`- public/images/${cat}/ : ${fileCount} files, ${(catSize / (1024 * 1024)).toFixed(2)} MB`);
  }
  console.log(`TOTAL public/images/ size: ${(grandTotal / (1024 * 1024)).toFixed(2)} MB`);

  console.log('\n=== FAILURES REPORT ===');
  if (failures.length === 0) {
    console.log('No failures! All images downloaded successfully.');
  } else {
    console.log(`Encountered ${failures.length} failures:`);
    failures.forEach(f => console.log(`- [${f.category}] ${f.url}: ${f.error}`));
  }
}

run();
