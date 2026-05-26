with open('src/data/puzzles.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if 'id: "room-3-switch-panel"' in line:
        skip = True
        if out and out[-1].strip() == '{':
            out.pop()
    if skip and 'id: "room-4-validator"' in line:
        skip = False
        out.append('  {\n')
        
    if not skip:
        new_line = line.replace('room-4', 'room-3').replace('room4', 'room3')
        out.append(new_line)

with open('src/data/puzzles.ts', 'w', encoding='utf-8') as f:
    f.writelines(out)
