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

with open('scratch_ps4_inspection.txt', 'w', encoding='utf-8') as out:
    out.write("=== ROWS AROUND ROW 123 (PS 4.1-HEN 11.00 F EXT) ===\n")
    for r_num in range(120, 140):
        if r_num in sheet_map:
            out.write(f"Row {r_num:3d}: {sheet_map[r_num]}\n")

print("Wrote inspection to scratch_ps4_inspection.txt")
