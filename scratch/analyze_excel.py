import json

with open('scratch_listgame.json', encoding='utf-8') as f:
    data = json.load(f)

with open('scratch_analysis.txt', 'w', encoding='utf-8') as out:
    for sheet_name, rows in data.items():
        out.write(f"\n=========================================\nSHEET: {sheet_name}\n=========================================\n")
        # Collect columns
        cols = {}
        for r in rows:
            for c_ref, val in r:
                # get column letter
                col_letter = ''.join([ch for ch in c_ref if ch.isalpha()])
                row_num = int(''.join([ch for ch in c_ref if ch.isdigit()]))
                if col_letter not in cols:
                    cols[col_letter] = {}
                cols[col_letter][row_num] = val
        
        for col_letter in sorted(cols.keys(), key=lambda x: (len(x), x)):
            col_cells = cols[col_letter]
            out.write(f"\n--- Column {col_letter} (total non-empty: {len([v for v in col_cells.values() if v.strip()])}) ---\n")
            # print top 30 non-empty values
            non_empty = [(r, v.strip()) for r, v in sorted(col_cells.items()) if v.strip()]
            for r, v in non_empty[:40]:
                out.write(f"  Row {r}: {v}\n")

print("Analysis written to scratch_analysis.txt")
