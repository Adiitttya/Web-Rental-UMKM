import json

with open('scratch_listgame.json', encoding='utf-8') as f:
    data = json.load(f)

for sheet_name, rows in data.items():
    print(f"=== SHEET: {sheet_name} ===")
    sheet_map = {}
    for r in rows:
        for c_ref, val in r:
            col_letter = ''.join([ch for ch in c_ref if ch.isalpha()])
            row_num = int(''.join([ch for ch in c_ref if ch.isdigit()]))
            if row_num not in sheet_map:
                sheet_map[row_num] = {}
            sheet_map[row_num][col_letter] = val.strip()

    current_device = None
    devices = {}
    for r_num in sorted(sheet_map.keys()):
        row = sheet_map[r_num]
        col_b = row.get('B', '')
        col_d = row.get('D', '')
        col_e = row.get('E', '')
        col_c = row.get('C', '')
        
        # Check if B has a header/device name
        if col_b and not col_b.startswith('✅') and not col_b.startswith('DSTERGAME'):
            current_device = col_b
            if current_device not in devices:
                devices[current_device] = []
        
        if current_device:
            game_title = col_d or col_e
            if game_title and game_title != current_device and not game_title.startswith('✅'):
                devices[current_device].append(game_title)

    for dev_name, games in devices.items():
        if games:
            print(f"Device: '{dev_name}' -> {len(games)} games. First 2: {games[:2]}")
