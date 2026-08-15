import json

with open('src/data/game-catalog.json', encoding='utf-8') as f:
    data = json.load(f)

print("=== PLAYSTATION SORTED TABS ===")
ps_devs = [d for d in data if d['hardwareCategory'] == 'playstation']
for d in ps_devs:
    print(f"  [{d['genScore']}] {d['name']} ({d['rawName']}) -> {len(d['games'])} games")

print("\n=== NINTENDO SORTED TABS ===")
n_devs = [d for d in data if d['hardwareCategory'] == 'nintendo']
for d in n_devs:
    print(f"  [{d['genScore']}] {d['name']} ({d['rawName']}) -> {len(d['games'])} games")

print("\n=== LOGITECH SORTED TABS ===")
l_devs = [d for d in data if d['hardwareCategory'] == 'logitech']
for d in l_devs:
    print(f"  [{d['genScore']}] {d['name']} ({d['rawName']}) -> {len(d['games'])} games")
