const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const templatesDir = path.join(__dirname, 'templates');
walkDir(templatesDir, (filePath) => {
  if (filePath.endsWith('.module.css') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove box-shadow entirely from all template CSS
    content = content.replace(/box-shadow:[^;]+;/g, '');
    
    // Remove hardcoded A4 sizes, backgrounds, and padding from the main wrapper classes.
    // We'll target classes like .page, .cv-page, .document, .container, .a4-page, etc.
    
    // Replace width: 210mm with width: 100%
    content = content.replace(/width:\s*210mm\s*!?;/g, 'width: 100%;');
    content = content.replace(/min-height:\s*297mm\s*!?;/g, 'min-height: 100%;');
    
    // Remove white backgrounds
    content = content.replace(/background-color:\s*#fff(?:fff)?\s*!?;/gi, '');
    content = content.replace(/background:\s*white\s*!?;/gi, '');
    content = content.replace(/background-color:\s*white\s*!?;/gi, '');

    // Now, let's remove padding from the top-level page containers.
    // The PreviewPanel provides the padding. If templates also have padding, it's double.
    // Let's find rules like .page { ... padding: ... }
    const pageClasses = ['.page', '.cv-page', '.document-container', '.a4-page', '.document', '.affidavit-page', '.lease-page', '.sale-deed-page'];
    
    for (const cls of pageClasses) {
      const regex = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*)padding:[^;]+;`, 'g');
      content = content.replace(regex, '$1'); // remove padding
      const regex2 = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*)margin:[^;]+;`, 'g');
      content = content.replace(regex2, '$1'); // remove margin just in case
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Cleaned overlapping styles from ${filePath}`);
    }
  }
});

// Also fix in components/preview/templates
const previewTemplatesDir = path.join(__dirname, 'components', 'preview', 'templates');
walkDir(previewTemplatesDir, (filePath) => {
  if (filePath.endsWith('.module.css') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/box-shadow:[^;]+;/g, '');
    content = content.replace(/width:\s*210mm\s*!?;/g, 'width: 100%;');
    content = content.replace(/min-height:\s*297mm\s*!?;/g, 'min-height: 100%;');
    content = content.replace(/background-color:\s*#fff(?:fff)?\s*!?;/gi, '');
    content = content.replace(/background:\s*white\s*!?;/gi, '');
    content = content.replace(/background-color:\s*white\s*!?;/gi, '');

    const pageClasses = ['.page', '.cv-page', '.document-container', '.a4-page', '.document', '.affidavit-page', '.lease-page', '.sale-deed-page', '.container', '.wrapper'];
    
    for (const cls of pageClasses) {
      const regex = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*)padding:[^;]+;`, 'g');
      content = content.replace(regex, '$1');
      const regex2 = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*)margin:[^;]+;`, 'g');
      content = content.replace(regex2, '$1');
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Cleaned overlapping styles from ${filePath}`);
    }
  }
});
