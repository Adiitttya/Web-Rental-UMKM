import json
import re

with open('scratch_listgame.json', encoding='utf-8') as f:
    raw_data = json.load(f)

sheet1 = raw_data.get('LIST GAME DSTERGAME 1', [])

sheet_map = {}
for r in sheet1:
    for c_ref, val in r:
        col_letter = ''.join([ch for ch in c_ref if ch.isalpha()])
        row_num = int(''.join([ch for ch in c_ref if ch.isdigit()]))
        if row_num not in sheet_map:
            sheet_map[row_num] = {}
        sheet_map[row_num][col_letter] = val.strip()

def clean_game_title(title):
    if not title:
        return ""
    cleaned = title.replace("'", "").replace('"', '').replace('✅', '').replace('', '').replace('™', '').replace('®', '').strip()
    cleaned = re.sub(r'[\u2600-\u27bf\U0001f300-\U0001f9ff]', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def clean_device_name(dev_name):
    s = dev_name.strip()
    
    if 'VIP' in s.upper():
        return 'PS5 VIP Online / Netflix'
    
    s = re.sub(r'PS\s*5\.\d+\s*', 'PS5 ', s, flags=re.IGNORECASE)
    s = re.sub(r'PS\s*4\.\d+-?\s*', 'PS4 ', s, flags=re.IGNORECASE)
    s = re.sub(r'PS\s*4\s*-\s*', 'PS4 ', s, flags=re.IGNORECASE)
    s = re.sub(r'PS\s*PRO\s*4\.\d+\s*', 'PS4 Pro ', s, flags=re.IGNORECASE)
    s = re.sub(r'PS\s*3\.\d+\s*', 'PS3 ', s, flags=re.IGNORECASE)
    s = re.sub(r'\s+', ' ', s).strip()
    
    if s.upper() == 'PS5 ONLINE':
        return 'PS5 Online'
    if s.upper() == 'PS5 OFFLINE':
        return 'PS5 Offline'
    if s.upper() == 'NINTENDO SWITCH 1':
        return 'Nintendo Switch 1'
    if s.upper() == 'NINTENDO SWITCH 2':
        return 'Nintendo Switch 2'
    if 'STEERING' in s.upper() or 'LOGITECH' in s.upper():
        return 'Steering Wheel Racing Simulator'
        
    return s

def get_hardware_category(dev_name):
    name_upper = dev_name.upper()
    if 'NINTENDO' in name_upper or 'SWITCH' in name_upper:
        return 'nintendo'
    elif 'STEERING' in name_upper or 'WHEEL' in name_upper or 'LOGITECH' in name_upper:
        return 'logitech'
    else:
        return 'playstation'

def get_device_generation_score(dev_name, category):
    upper = dev_name.upper()
    if category == 'playstation':
        if 'PS5' in upper or 'PS 5' in upper:
            return 300
        elif 'PS4' in upper or 'PS 4' in upper or 'PRO' in upper:
            return 200
        elif 'PS3' in upper or 'PS 3' in upper:
            return 100
        return 50
    elif category == 'nintendo':
        if '2' in upper:
            return 200
        return 100
    return 100

devices_data = []
current_device_obj = None

for r_num in sorted(sheet_map.keys()):
    row = sheet_map[r_num]
    col_b = row.get('B', '')
    
    if col_b and not col_b.startswith('✅') and not col_b.startswith('DSTERGAME') and not col_b.startswith('Jl.') and not col_b.startswith('WA admin') and not 'HAK MEMBER' in col_b.upper():
        raw_dev_name = col_b
        cleaned_dev_name = clean_device_name(raw_dev_name)
        hw_cat = get_hardware_category(raw_dev_name)
        dev_id = re.sub(r'[^a-zA-Z0-9]', '-', raw_dev_name.lower()).strip('-')
        
        current_device_obj = {
            "id": dev_id,
            "rawName": raw_dev_name,
            "name": cleaned_dev_name,
            "hardwareCategory": hw_cat,
            "genScore": get_device_generation_score(cleaned_dev_name, hw_cat),
            "games": []
        }
        devices_data.append(current_device_obj)

    if current_device_obj:
        for col_let, cell_val in row.items():
            if col_let in ['A', 'B']:
                continue
            cleaned_title = clean_game_title(cell_val)
            if cleaned_title and cleaned_title != current_device_obj["rawName"] and cleaned_title != current_device_obj["name"] and not cleaned_title.startswith('✅') and len(cleaned_title) > 1:
                if cleaned_title not in current_device_obj["games"]:
                    current_device_obj["games"].append(cleaned_title)

# Filter out empty devices
devices_data = [d for d in devices_data if len(d["games"]) > 0]

# Sort games inside each device alphabetically A-Z
for dev in devices_data:
    dev["games"].sort(key=lambda g: g.upper())

# Sort devices: 1. Generation Score (-genScore), 2. Alphabetical Name A-Z
def sort_key(dev):
    return (-dev["genScore"], dev["name"].upper(), dev["rawName"].upper())

devices_data.sort(key=sort_key)

with open('src/data/game-catalog.json', 'w', encoding='utf-8') as out_f:
    json.dump(devices_data, out_f, ensure_ascii=False, indent=2)

print(f"Successfully generated alphabetically sorted src/data/game-catalog.json with {len(devices_data)} devices!")
