import sys
import re

with open('frontend/src/pages/TrendExplorer.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'<div style=\{\{ padding: 60, textAlign: \'center\', color: \'#94a3b8\' \}\}>\s*<Loader className=\"spin\" style=\{\{ marginBottom: 8 \}\} />\s*<div>Loading trend data.*?</div>\s*</div>', re.DOTALL)

new_content = pattern.sub('<div style={{ padding: \'60px 24px\', textAlign: \'center\', color: \'#94a3b8\' }}>\\n            <WaveLoader message=\"Loading trend data...\" />\\n          </div>', content)

if content != new_content:
    with open('frontend/src/pages/TrendExplorer.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Replaced TrendExplorer')
else:
    print('Not found in TrendExplorer')

with open('frontend/src/pages/NewAnalysis.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

new_content2 = content2.replace(\"import { FileSpreadsheet, Loader } from 'lucide-react'\", \"import { FileSpreadsheet } from 'lucide-react'\")

if content2 != new_content2:
    with open('frontend/src/pages/NewAnalysis.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content2)
    print('Replaced NewAnalysis')
else:
    print('Not found in NewAnalysis')
