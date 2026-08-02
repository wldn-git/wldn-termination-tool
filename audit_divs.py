with open('mv-termination-selector.html', encoding='utf-8') as f:
    lines = f.readlines()

tabs = {}
current_tab = None
for i, line in enumerate(lines):
    for tab in ['tab-selector','tab-sop','tab-detail','tab-testing','tab-lug','tab-quiz','tab-ref']:
        if f'id="{tab}"' in line:
            current_tab = (tab, i)
            tabs[tab] = {'start': i, 'opens': 0, 'closes': 0}
    if current_tab:
        t = current_tab[0]
        tabs[t]['opens'] += line.count('<div')
        tabs[t]['closes'] += line.count('</div>')

print(f"{'Tab':<18} {'Start':>6} {'<div':>6} {'</div>':>7} {'Balance':>8}")
print('-'*50)
for tab, d in tabs.items():
    bal = d['opens'] - d['closes']
    flag = '  <-- UNBALANCED' if bal != 1 else ''
    print(f"{tab:<18} {d['start']+1:>6} {d['opens']:>6} {d['closes']:>7} {bal:>8}{flag}")
