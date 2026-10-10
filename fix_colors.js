const fs = require('fs');
['frontend/src/pages/Login.jsx', 'frontend/src/pages/Signup.jsx'].forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/backgroundColor: '#f8fafc'/g, \"backgroundColor: 'var(--main-bg)'\");
  c = c.replace(/backgroundColor: 'white'/g, \"backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)'\");
  c = c.replace(/color=\"#0f172a\"/g, \"color=\"var(--text-primary)\"\");
  c = c.replace(/color: '#64748b'/g, \"color: 'var(--text-secondary)'\");
  c = c.replace(/border: '1px solid #e2e8f0'/g, \"border: '1px solid var(--border)', backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)'\");
  c = c.replace(/borderTop: '1px solid #e2e8f0'/g, \"borderTop: '1px solid var(--border)'\");
  c = c.replace(/backgroundColor: '#e2e8f0'/g, \"backgroundColor: 'var(--border)'\");
  c = c.replace(/color: '#94a3b8'/g, \"color: 'var(--text-muted)'\");
  fs.writeFileSync(file, c);
});
