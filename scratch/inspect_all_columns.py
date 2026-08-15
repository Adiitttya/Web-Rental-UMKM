import json

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

with open('scratch_column_check.txt', 'w', encoding='utf-8') as out:
    for r_num in sorted(sheet_map.keys()):
        row = sheet_map[r_num]
        col_b = row.get('B', '')
        if col_b:
            out.write(f"\n--- HEADER Row {r_num}: {col_b} ---\n")
        
        # Check values in columns C, D, E, F, G, H, I, J...
        other_cols = {k: v for k, v in row.items() if k not in ['A', 'B'] and v}
        if other_cols:
            out.write(f"  Row {r_num:3d}: {other_cols}\n")

print("Inspection output written to scratch_column_check.txt")
