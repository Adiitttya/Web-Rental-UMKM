import sys
import zipfile
import json
import re
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def infer_genre(title):
    t = title.lower()
    if any(k in t for k in ['fc 2', 'fifa', 'pes', 'efootball', 'nba', 'ufc', 'wwe', 'motogp', 'f1', 'mxgp', 'boxing', 'sports', 'golf', 'tennis', 'bowling', 'olympic']):
        return 'Sports & Racing' if any(k in t for k in ['motogp', 'f1', 'mxgp', 'racing']) else 'Sports'
    if any(k in t for k in ['forza', 'gran turismo', 'mario kart', 'assetto', 'wrc', 'need for speed', 'nfs', 'hot wheels', 'dirt', 'burnout', 'ride ', 'car', 'nascar', 'drive']):
        return 'Racing & Simulator'
    if any(k in t for k in ['tekken', 'mortal kombat', 'street fighter', 'dragon ball', 'naruto', 'jump force', 'guilty gear', 'kof', 'brawl', 'smash']):
        return 'Fighting'
    if any(k in t for k in ['mario', 'zelda', 'kirby', 'luigi', 'pokemon', 'sonic', 'crash team', 'spyro', 'lego', 'rayman', 'astro bot', 'astrobot', 'spongebob', 'sackboy']):
        return 'Adventure & Family'
    if any(k in t for k in ['gta', 'grand theft auto', 'spider', 'god of war', 'wukong', 'assassin', 'call of duty', 'battlefield', 'red dead', 'resident evil', 'last of us', 'devil may cry', 'outlast', 'cyberpunk', 'elden ring', 'sekiro', 'ghost of tsushima']):
        return 'Action & RPG'
    if any(k in t for k in ['it takes two', 'overcooked', 'a way out', 'moving out', 'gang beast', 'unravel']):
        return 'Co-op & Party'
    return 'Action & Variety'

def parse_listgame():
    xlsx_path = 'public/listgame.xlsx'
    
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in ss_tree.findall('s:si', ns):
                text = ''.join([t.text for t in si.findall('.//s:t', ns) if t.text])
                shared_strings.append(text)

        all_hardware = []
        seen_hw_slugs = set()
        
        sheets_info = [
            ('sheet1.xml', 'Cabang 1 (Genuk)', 1),
            ('sheet2.xml', 'Cabang 2 (Gedongsongo)', 2),
            ('sheet3.xml', 'Cabang 3 (Salatiga)', 3)
        ]

        display_order = 1

        for fname, branch_name, branch_num in sheets_info:
            stree = ET.fromstring(z.read('xl/worksheets/' + fname))
            curr_dev = None
            dev_map = {}
            
            for row in stree.findall('.//s:row', ns):
                cells = {}
                for c in row.findall('s:c', ns):
                    r = c.attrib['r']
                    col = ''.join([char for char in r if char.isalpha()])
                    t = c.attrib.get('t')
                    v = c.find('s:v', ns)
                    val = v.text if v is not None else ''
                    if t == 's' and val.isdigit():
                        val = shared_strings[int(val)]
                    if val.strip():
                        cells[col] = val.strip()

                header_cand = cells.get('B') or cells.get('A')
                if header_cand:
                    u = header_cand.upper()
                    if any(x in u for x in ['PS ', 'PS3', 'PS4', 'PS5', 'NINTENDO', 'STEERING', 'WHEEL', 'PS PRO']) or (branch_num == 2 and ('PS4 NO' in u or 'PS3 NO' in u)):
                        if not any(x in header_cand for x in ['DSTERGAME', 'LISTGAME', 'Jl.', 'WA admin', 'JIKA ADA GAME']):
                            curr_dev = header_cand
                            if curr_dev not in dev_map:
                                dev_map[curr_dev] = []

                if branch_num == 3 and cells.get('A') == 'NO' and 'D' in cells:
                    num_val = cells['D'].replace('.0', '')
                    curr_dev = 'PS3 Salatiga #' + num_val
                    if curr_dev not in dev_map:
                        dev_map[curr_dev] = []

                for col, val in cells.items():
                    if col not in ['A', 'B', 'C'] and val != '✅' and not val.startswith('http') and len(val) > 1:
                        if curr_dev and val not in ['NO', 'DSTERGAME'] and not val.startswith('WA admin'):
                            dev_map[curr_dev].append(val)

            for dev_name, games in dev_map.items():
                if not games:
                    continue
                cat = 'playstation'
                u = dev_name.upper()
                if 'NINTENDO' in u or 'SWITCH' in u:
                    cat = 'nintendo'
                elif 'STEERING' in u or 'WHEEL' in u or 'LOGITECH' in u:
                    cat = 'logitech'
                
                base_slug = slugify(dev_name)
                if branch_num == 2:
                    base_slug += '-c2'
                elif branch_num == 3:
                    base_slug += '-c3'
                    
                slug = base_slug
                counter = 2
                while slug in seen_hw_slugs:
                    slug = f'{base_slug}-{counter}'
                    counter += 1
                seen_hw_slugs.add(slug)

                is_avail = 'TROUBLE' not in dev_name.upper()
                
                formatted_games = []
                seen_game_slugs = set()
                for idx, g_title in enumerate(games):
                    g_title_clean = g_title.strip()
                    g_slug_base = slugify(g_title_clean) + '-' + slug
                    g_slug = g_slug_base
                    g_counter = 2
                    while g_slug in seen_game_slugs:
                        g_slug = f'{g_slug_base}-{g_counter}'
                        g_counter += 1
                    seen_game_slugs.add(g_slug)

                    genre = infer_genre(g_title_clean)
                    is_pop = any(k in g_title_clean.lower() for k in ['fc 2', 'fifa', 'pes', 'gta', 'spiderman', 'mario kart', 'wukong', 'tekken 8', 'god of war', 'it takes two'])

                    formatted_games.append({
                        'title': g_title_clean,
                        'slug': g_slug,
                        'genre': genre,
                        'isPopular': is_pop,
                        'displayOrder': idx + 1
                    })

                all_hardware.append({
                    'id': slug,
                    'name': dev_name,
                    'slug': slug,
                    'branch': branch_name,
                    'categorySlug': cat,
                    'isAvailable': is_avail,
                    'displayOrder': display_order,
                    'games': formatted_games
                })
                display_order += 1

    print(f'Parsed {len(all_hardware)} hardwares with {sum(len(h["games"]) for h in all_hardware)} total games.')
    
    with open('scratch/parsed_games_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_hardware, f, ensure_ascii=False, indent=2)
    print('Saved to scratch/parsed_games_data.json')

if __name__ == '__main__':
    parse_listgame()
