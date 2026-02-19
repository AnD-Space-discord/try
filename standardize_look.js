const fs = require('fs');
const path = require('path');

function processDirectory(dir, isSubdir = true) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Don't recurse into non-content folders
            if (['labs', 'BLOGS', 'blog'].includes(file)) {
                processDirectory(filePath, true);
            }
        } else if (file.endsWith('.html')) {
            updateFile(filePath, isSubdir);
        }
    });
}

function updateFile(filePath, isSubdir) {
    let content = fs.readFileSync(filePath, 'utf8');
    const prefix = isSubdir ? '../' : '';

    // 1. Update Head (Add FontAwesome if missing)
    if (!content.includes('font-awesome')) {
        content = content.replace('</head>', '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>');
    }

    // 2. Update Nav
    const navRegex = /<nav>[\s\S]*?<\/nav>/;
    const newNav = `  <nav>
    <a href="${prefix}index.html">Home</a>
    <div class="nav-item">
      <a href="${prefix}labs.html">Labs <i class="fas fa-chevron-down"></i></a>
      <div class="dropdown-content">
        <a href="${prefix}labs/switching.html">Switching</a>
        <a href="${prefix}labs/routing.html">Routing</a>
        <a href="${prefix}labs/security.html">Security</a>
        <a href="${prefix}labs/ip-services.html">IP Services</a>
        <a href="${prefix}labs.html">All Labs</a>
      </div>
    </div>
    <div class="nav-item">
      <a href="${prefix}blog.html">Blog <i class="fas fa-chevron-down"></i></a>
      <div class="dropdown-content">
        <a href="${prefix}blog/switching.html">Switching</a>
        <a href="${prefix}blog/routing.html">Routing</a>
        <a href="${prefix}blog/security.html">Security</a>
        <a href="${prefix}blog/ip-services.html">IP Services</a>
        <a href="${prefix}blog.html">All Topics</a>
      </div>
    </div>
    <a href="${prefix}contact.html">Contact</a>
  </nav>`;
    content = content.replace(navRegex, newNav);

    // 3. Update Header
    const headerRegex = /<header class="hero" style="[^"]*">([\s\S]*?)<\/header>|<header class="hero">([\s\S]*?)<\/header>|<header class="lab-header">([\s\S]*?)<\/header>|<header class="blog-header">([\s\S]*?)<\/header>|<header>([\s\S]*?)<\/header>/;
    content = content.replace(headerRegex, (match, p1, p2, p3, p4, p5) => {
        const inner = p1 || p2 || p3 || p4 || p5 || '';
        if (filePath.includes('.lab.html')) {
            return `  <header class="lab-header">
    ${inner.trim()}
  </header>`;
        }
        if (filePath.includes('BLOGS/')) {
            return `  <header class="blog-header">
    ${inner.trim()}
  </header>`;
        }
        return `  <header class="hero">
    ${inner.trim()}
  </header>`;
    });

    // 4. Wrap main content
    if (filePath.includes('.lab.html')) {
        content = content.replace(/<main[^>]*>/, '<main class="lab-main">');
    } else if (filePath.includes('BLOGS/')) {
        // Wrap content in article if not already wrapped
        if (!content.includes('blog-article')) {
            content = content.replace(/<main[^>]*>/, '<main class="blog-main">\n      <div class="blog-article">');
            content = content.replace(/<\/main>/, '      </div>\n    </main>');
        } else {
            content = content.replace(/<main[^>]*>/, '<main class="blog-main">');
        }

        // Add separators before h2 tags (except the first one if it's right at the start)
        content = content.replace(/<h2/g, '<div class="section-divider"></div>\n        <h2');
        // Fix: remove double divider at the top
        content = content.replace(/<div class="blog-article">\n        <div class="section-divider"><\/div>/, '<div class="blog-article">');
    }

    // 5. Standard footer
    const footerRegex = /<footer>[\s\S]*?<\/footer>/;
    const newFooter = `  <footer>
    <p>© 2026 Architecture & Developer Space</p>
  </footer>`;
    content = content.replace(footerRegex, newFooter);

    // 6. Clean up scripts and add theme manager
    // Remove all existing theme-manager script tags
    content = content.replace(/<script src="[^"]*theme-manager\.js"><\/script>/g, '');
    // Remove trailing scripts after <footer> if they are redundant (optional, but let's at least ensure one theme-manager exists)
    if (!content.includes('</body>')) {
        content += `\n<script src="${prefix}js/theme-manager.js"></script>\n</body>`;
    } else {
        content = content.replace('</body>', `<script src="${prefix}js/theme-manager.js"></script>\n</body>`);
    }

    // Remove double body/html closings if any
    content = content.replace(/<\/body>[\s\S]*<\/body>/g, '</body>');
    content = content.replace(/<\/html>[\s\S]*<\/html>/g, '</html>');


    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.relative(__dirname, filePath)}`);
}

// Run for root level files
const rootFiles = fs.readdirSync(__dirname);
rootFiles.forEach(file => {
    if (file.endsWith('.html')) {
        updateFile(path.join(__dirname, file), false);
    }
});

// Run for labs, BLOGS, and blog
processDirectory(path.join(__dirname, 'labs'), true);
processDirectory(path.join(__dirname, 'BLOGS'), true);
processDirectory(path.join(__dirname, 'blog'), true);
