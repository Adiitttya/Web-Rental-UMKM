import json
import re

with open('scratch_listgame.json', encoding='utf-8') as f:
    raw_data = json.load(f)

# Focus on 'LIST GAME DSTERGAME 1' sheet as main catalog
sheet1 = raw_data.get('LIST GAME DSTERGAME 1', [])

sheet_map = {}
for r in sheet1:
    for c_ref, val in r:
        col_letter = ''.join([ch for ch in c_ref if ch.isalpha()])
        row_num = int(''.join([ch for ch in c_ref if ch.isdigit()]))
        if row_num not in sheet_map:
            sheet_map[row_num] = {}
        sheet_map[row_num][col_letter] = val.strip()

current_device = None
devices_data = [] # [{ id, name, category, games: [] }]

# We map device names to categories: 'playstation', 'nintendo', 'logitech'
def get_hardware_category(dev_name):
    name_upper = dev_name.upper()
    if 'NINTENDO' in name_upper or 'SWITCH' in name_upper:
        return 'nintendo'
    elif 'STEERING' in name_upper or 'WHEEL' in name_upper or 'LOGITECH' in name_upper:
        return 'logitech'
    else:
        return 'playstation'

current_device_obj = None

for r_num in sorted(sheet_map.keys()):
    row = sheet_map[r_num]
    col_b = row.get('B', '')
    col_d = row.get('D', '')
    col_e = row.get('E', '')
    
    # Check if B is a device header
    if col_b and not col_b.startswith('✅') and not col_b.startswith('DSTERGAME') and not col_b.startswith('Jl.') and not col_b.startswith('WA admin'):
        dev_name = col_b
        hw_cat = get_hardware_category(dev_name)
        
        # Check if already created or create new
        current_device_obj = {
            "id": re.sub(r'[^a-zA-Z0-9]', '-', dev_name.lower()).strip('-'),
            "name": dev_name,
            "hardwareCategory": hw_cat,
            "games": []
        }
        devices_data.append(current_device_obj)
    
    if current_device_obj:
        game_title = col_d or col_e
        if game_title and game_title != current_device_obj["name"] and not game_title.startswith('✅'):
            # clean up title (remove replacement chars if any)
            game_title_clean = game_title.replace('', "'").replace('  ', ' ').strip()
            if game_title_clean and game_title_clean not in current_device_obj["games"]:
                current_device_obj["games"].append(game_title_clean)

# Also check Cabang 2 & 3 if there are extra devices
for sheet_key in ['LISTGAME DSTERGAME CABANG 2', 'LISTGAME DSTERGAME CABANG 3']:
    sheet = raw_data.get(sheet_key, [])
    sheet_map_extra = {}
    for r in sheet:
        for c_ref, val in r:
            col_letter = ''.join([ch for ch in c_ref if ch.isalpha()])
            row_num = int(''.join([ch for ch in c_ref if ch.isdigit()]))
            if row_num not in sheet_map_extra:
                sheet_map_extra[row_num] = {}
            sheet_map_extra[row_num][col_letter] = val.strip()

    c_dev_obj = None
    for r_num in sorted(sheet_map_extra.keys()):
        row = sheet_map_extra[r_num]
        col_b = row.get('B', '')
        col_d = row.get('D', '')
        col_e = row.get('E', '')
        if col_b and not col_b.startswith('✅') and not col_b.startswith('DSTERGAME'):
            dev_name = col_b
            hw_cat = get_hardware_category(dev_name)
            c_dev_obj = {
                "id": re.sub(r'[^a-zA-Z0-9]', '-', dev_name.lower()).strip('-'),
                "name": dev_name,
                "hardwareCategory": hw_cat,
                "branch": sheet_key,
                "games": []
            }
            devices_data.append(c_dev_obj)
        if c_dev_obj:
            game_title = col_d or col_e
            if game_title and game_title != c_dev_obj["name"] and not game_title.startswith('✅'):
                g_clean = game_title.replace('', "'").replace('  ', ' ').strip()
                if g_clean and g_clean not in c_dev_obj["games"]:
                    c_dev_obj["games"].append(g_clean)

# Filter out device objects with no games
devices_data = [d for d in devices_data if len(d["games"]) > 0]

with open('src/data/game-catalog.json', 'w', encoding='utf-8') as out_f:
    json.dump(devices_data, out_f, ensure_ascii=False, indent=2)

print(f"Successfully generated src/data/game-catalog.json with {len(devices_data)} device variants!")
