import json

with open('src/data/game-catalog.json', encoding='utf-8') as f:
    data = json.load(f)

for d in data[:15]:
    print(f"Device: '{d['name']}' (raw: '{d['rawName']}') -> {len(d['games'])} games")
    print("   First 3 games:", d['games'][:3])
