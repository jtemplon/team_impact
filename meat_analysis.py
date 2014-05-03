import requests
import json

data = {}
data["payload"] = {"datasource":"faostat",
        "domainCode":"FB",
        "lang":"E",
        "areaCodes":["231", "351", "215", "110", "21", "5000"],
        "itemCodes":["2501", "2731", "2732", "2733", "2734", "2761", "2762", "2763", "2764"],
        "elementListCodes":["645"],
        "years":["2009"],
        "flags":True,
        "codes":True,
        "units":True,
        "nullValues":False,
        "thousandSeparator":",",
        "decimalSeparator":".",
        "decimalPlaces":2,
        "limit":-1}

data["payload"] = json.dumps(data["payload"])
r = requests.post('http://faostat3.fao.org/faostat-api/rest/procedures/data', data)
food_data = r.json()

pop_dict = {"Brazil": 193247000, "China": 1365580000, "Japan": 126552000, 
                   "United Republic of Tanzania": 43525000, "United States of America": 307687000,
                   "World": 6656860000}

meat_mapper = {"Bovine Meat": "cow", "Demersal Fish": "fish", "Freshwater Fish": "fish", "Marine Fish, Other": "fish",
               "Mutton & Goat Meat": "goat", "Pelagic Fish": "fish", "Pigmeat": "pig", "Poultry Meat": "chicken"}

kg_to_animals = {"cow": 295, "pig": 70, "goat": 23, "chicken": 1.8, "fish": 0.8}

countries = {}

for c in food_data:
    country = c[2]
    meat_name = c[4]
    value = c[10]
    meat_type = meat_mapper[meat_name]
    if country in countries.keys():
        if meat_type in countries[country].keys():
            countries[country][meat_type] += float(value)
        else:
            countries[country][meat_type] = float(value)
    else:
        countries[country] = {}
        if meat_type in countries[country].keys():
            countries[country][meat_type] += float(value)
        else:
            countries[country][meat_type] = float(value)

for ck in countries.keys():
    for ak in countries[ck].keys():
        countries[ck][ak] = int(countries[ck][ak] * pop_dict[ck] / float(kg_to_animals[ak]))

#This is to print data.
# for ck in countries.keys():
#     for ak in countries[ck].keys():
#         print "%s|%s|%s" %(ck, ak, countries[ck][ak])

meat_data = json.dumps(countries)
f = open("meat_data.json", "w")
f.write(meat_data)
f.close()