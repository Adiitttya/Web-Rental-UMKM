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
    # Remove unwanted single quotes, bad unicode replacement symbols, emojis, etc
    cleaned = title.replace("'", "").replace('"', '').replace('✅', '').replace('', '').replace('™', '').replace('®', '').strip()
    # Fix spacing
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned

def clean_device_name(dev_name):
    s = dev_name.strip()
    
    # PS 5.1 VIP Online/Netflix -> PS5 VIP Online / Netflix
    s = re.sub(r'PS\s*5\.\d+\s*', 'PS5 ', s, flags=re.IGNORECASE)
    # PS 4.1-HEN -> PS4 HEN
    s = re.sub(r'PS\s*4\.\d+-?\s*', 'PS4 ', s, flags=re.IGNORECASE)
    s = re.sub(r'PS\s*4\s*-\s*', 'PS4 ', s, flags=re.IGNORECASE)
    # PS PRO 4.1 -11 -> PS4 Pro 11.00
    s = re.sub(r'PS\s*PRO\s*4\.\d+\s*', 'PS4 Pro ', s, flags=re.IGNORECASE)
    # PS 3.1 -> PS3
    s = re.sub(r'PS\s*3\.\d+\s*', 'PS3 ', s, flags=re.IGNORECASE)
    
    s = re.sub(r'\s+', ' ', s).strip()
    
    if s.upper() == 'PS5 ONLINE':
        s = 'PS5 Online'
    elif s.upper() == 'PS5 OFFLINE':
        s = 'PS5 Offline'
    elif 'VIP' in s.upper():
        s = 'PS5 VIP Online / Netflix'
    elif s.upper() == 'NINTENDO SWITCH 1':
        s = 'Nintendo Switch 1'
    elif s.upper() == 'NINTENDO SWITCH 2':
        s = 'Nintendo Switch 2'
    elif 'STEERING' in s.upper() or 'LOGITECH' in s.upper():
        s = 'Steering Wheel Racing Simulator'
        
    return s

def get_hardware_category(dev_name):
    name_upper = dev_name.upper()
    if 'NINTENDO' in name_upper or 'SWITCH' in name_upper:
        return 'nintendo'
    elif 'STEERING' in name_upper or 'WHEEL' in name_upper or 'LOGITECH' in name_upper:
        return 'logitech'
    else:
        return 'playstation'

devices_data = []
current_device_obj = None

for r_num in sorted(sheet_map.keys()):
    row = sheet_map[r_num]
    col_b = row.get('B', '')
    col_d = row.get('D', '')
    col_e = row.get('E', '')
    
    if col_b and not col_b.startswith('✅') and not col_b.startswith('DSTERGAME') and not col_b.startswith('Jl.') and not col_b.startswith('WA admin'):
        raw_dev_name = col_b
        cleaned_dev_name = clean_device_name(raw_dev_name)
        hw_cat = get_hardware_category(raw_dev_name)
        
        dev_id = re.sub(r'[^a-zA-Z0-9]', '-', raw_dev_name.lower()).strip('-')
        
        current_device_obj = {
            "id": dev_id,
            "rawName": raw_dev_name,
            "name": cleaned_dev_name,
            "hardwareCategory": hw_cat,
            "games": []
        }
        devices_data.append(current_device_obj)
    
    if current_device_obj:
        raw_title = col_d or col_e
        if raw_title and raw_title != current_device_obj["rawName"] and not raw_title.startswith('✅'):
            c_title = clean_game_title(raw_title)
            if c_title and c_title not in current_device_obj["games"]:
                current_device_obj["games"].append(c_title)

devices_data = [d for d in devices_data if len(d["games"]) > 0]

with open('src/data/game-catalog.json', 'w', encoding='utf-8') as out_f:
    json.dump(devices_data, out_f, ensure_ascii=False, indent=2)

print(f"Successfully generated cleaned src/data/game-catalog.json with {len(devices_data)} devices!")
