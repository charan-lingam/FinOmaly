
with open('frontend/src/index.css', 'a', encoding='utf-8') as f:
    f.write('''

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;

  /* Sidebar */
  --sidebar-bg: #1e293b;
  --sidebar-border: #334155;
  --sidebar-text: #94a3b8;
  --sidebar-text-active: #f1f5f9;
  --sidebar-hover: #334155;
  --sidebar-accent: #f1f5f9;
  --sidebar-accent-bg: #334155;

  /* Main content */
  --main-bg: #0f172a;
  --navbar-bg: #1e293b;
  --card-bg: #1e293b;

  /* Text */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Border */
  --border: #334155;

  /* TBD */
  --tbd-bg: rgba(245,158,11,0.05);
  --tbd-border: rgba(245,158,11,0.2);
  --tbd-text: #fcd34d;
}
''')
print('Appended .dark to index.css')

