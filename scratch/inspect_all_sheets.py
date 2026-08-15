import json
import re

with open('scratch_listgame.json', encoding='utf-8') as f:
    raw_data = json.load(f)

print("Sheet names:", list(raw_data.keys()))

for sheet_name, sheet_rows in raw_data.items():
    sheet_map = {}
    for r in sheet_rows:
        for c_ref, val in r:
            col_letter = ''.join([ch for ch in c_ref if ch.isalpha()])
            row_num = int(''.join([ch for ch in c_ref if ch.isdigit()]))
            if row_num not in sheet_map:
                sheet_map[row_num] = {}
            sheet_map[row_num][col_letter] = val.strip()

    print(f"\n--- Sheet: {sheet_name} (Total Rows: {len(sheet_map)}) ---")
    
    # Check device headers found
    devices_found = []
    for r_num in sorted(sheet_map.keys()):
        row = sheet_map[r_num]
        col_b = row.get('B', '')
        if col_b and not col_b.startswith('✅') and not col_b.startswith('DSTERGAME') and not col_b.startswith('Jl.') and not col_b.startswith('WA admin'):
            devices_found.append((r_num, col_b))
    
    print(f"Devices found ({len(devices_found)}):")
    for r_num, dname in devices_found[:20]:
        print(f"  Row {r_num}: {dname}")
