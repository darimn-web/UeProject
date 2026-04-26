import json
import random

# Major Romanian cities for "Others" distribution
cities = [
    {"name": "București", "coords": [44.4268, 26.1025], "weight": 20},
    {"name": "Cluj-Napoca", "coords": [46.7712, 23.5897], "weight": 8},
    {"name": "Timișoara", "coords": [45.7537, 21.2257], "weight": 7},
    {"name": "Iași", "coords": [47.1558, 27.5833], "weight": 7},
    {"name": "Constanța", "coords": [44.1706, 28.6635], "weight": 6},
    {"name": "Craiova", "coords": [44.3333, 23.8167], "weight": 5},
    {"name": "Brașov", "coords": [45.6500, 25.6000], "weight": 6},
    {"name": "Galați", "coords": [45.4500, 28.0500], "weight": 4},
    {"name": "Ploiești", "coords": [44.9333, 26.0333], "weight": 4},
    {"name": "Oradea", "coords": [47.0465, 21.9189], "weight": 5},
]

categories = [
    {"name": "Infrastructure", "prefix": "INF-", "names": ["Reabilitare Drum Județean", "Pod Local", "Pistă Biciclete", "Modernizare Stradă"]},
    {"name": "Culture", "prefix": "CUL-", "names": ["Cămin Cultural", "Biblioteca Comunală", "Restaurare Fațadă", "Centru de Tineret"]},
    {"name": "Health", "prefix": "HEA-", "names": ["Dispensar Medical", "Modernizare Secție", "Ambulanță Nouă", "Cabinet Stomatologic"]},
    {"name": "Environment", "prefix": "ENV-", "names": ["Extindere Canalizare", "Iluminat Public LED", "Parc Local", "Colectare Selectivă"]},
    {"name": "Education", "prefix": "EDU-", "names": ["Grădinița cu Program Prelungit", "Sala de Sport Școlară", "Laborator IT", "Reabilitare Școală"]},
]

others = []

for i in range(2000):
    city = random.choices(cities, weights=[c["weight"] for c in cities])[0]
    category = random.choice(categories)
    
    # Random distribution across the country, biased towards cities
    lat = city["coords"][0] + random.uniform(-0.15, 0.15)
    lng = city["coords"][1] + random.uniform(-0.15, 0.15)
    
    popular_name = f"{random.choice(category['names'])} {city['name']}"
    year = random.randint(2014, 2024)
    
    project_id = f"OTHER-{20260000 + i}"
    
    budget_val = random.uniform(0.1, 5.0)
    eu_val = budget_val * random.uniform(0.70, 0.90)
    
    description = f"{popular_name} a fost finanțat în {year} pentru a susține dezvoltarea locală a comunității."
    
    others.append({
        "id": project_id,
        "name": popular_name,
        "popular_name": popular_name,
        "year": year,
        "description": description,
        "budget": f"€{budget_val:.2f} Million",
        "eu_contribution": f"€{eu_val:.2f} Million",
        "coordinates": [lat, lng],
        "category": category["name"],
        "impact": "Îmbunătățirea serviciilor locale pentru cetățeni.",
        "official_link": "https://kohesio.ec.europa.eu/"
    })

with open('src/data/others.json', 'w', encoding='utf-8') as f:
    json.dump(others, f, indent=2, ensure_ascii=False)

print(f"Generated {len(others)} 'less important' projects in src/data/others.json")
