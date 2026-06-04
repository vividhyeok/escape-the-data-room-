import fs from 'node:fs';
const lines = fs.readFileSync('src/components/InspectModal.tsx', 'utf8').split('\n');
const before = lines.slice(0, 101);
const after = lines.slice(656);
const newFunc = `function renderClueSurface(puzzle: Puzzle, object: RoomObject): React.JSX.Element {
  if (!puzzle.imageUrl) {
    return (
      <div className="clue-surface default-surface" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--neon-cyan)', fontSize: '1.2rem', marginBottom: '10px' }}>[IMAGE PENDING]</div>
        <pre>{puzzle.dataText}</pre>
      </div>
    );
  }
  
  return (
    <div className="clue-surface image-surface" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'transparent', border: 'none', boxShadow: 'none' }}>
      <img 
        src={puzzle.imageUrl} 
        alt={puzzle.title} 
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
        draggable={false}
      />
    </div>
  );
}`;
fs.writeFileSync('src/components/InspectModal.tsx', before.join('\n') + '\n' + newFunc + '\n' + after.join('\n'));
