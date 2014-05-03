import requests
import json
import csv

data = {}
data["payload"] = {"datasource":"faostat",
        "domainCode":"FB",
        "lang":"E",
        "areaCodes":["231", "351", "215", "110", "21", "5000"],
        "itemCodes":["2501", "2731", "2732", "2733", "2734", "2761", "2762", "2763", "2764", "2511", "2805", "2531", "2605"],
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
               "Mutton & Goat Meat": "goat", "Pelagic Fish": "fish", "Pigmeat": "pig", "Poultry Meat": "chicken",
               "Vegetables, Other": "vegetable", "Wheat and products": "wheat", "Rice (Milled Equivalent)": "rice",
               "Potatoes and products": "potato"}

kg_to_animals = {"cow": 295, "pig": 70, "goat": 23, "chicken": 1.8, "fish": 0.8, "vegetable": 1, "wheat": 1,
                 "rice": 1, "potato": 1}

countries = {}

#This is where I meats and sum
for c in food_data:
    country = c[2]
    meat_name = c[4]
    value = c[10]
    meat_type = meat_mapper[meat_name]
    if country in countries.keys():
        if meat_type in countries[country]["foods"].keys():
            countries[country]["foods"][meat_type] += float(value)
        else:
            countries[country]["foods"][meat_type] = float(value)
    else:
        countries[country] = {"foods":{}}
        if meat_type in countries[country].keys():
            countries[country]["foods"][meat_type] += float(value)
        else:
            countries[country]["foods"][meat_type] = float(value)

#This is where we add water usage
water_usage = {"World":{}, "Brazil":{}, "China":{}, "Japan":{}, "United States of America":{}, 
               "United Republic of Tanzania": {}}
watercsv = open("Water_Footprints_Animals_mod.csv", "rU")
for l in csv.reader(watercsv.readlines()[1:]):
     animal = l[0]
     water_usage["World"][animal] = float(l[1])
     water_usage["Brazil"][animal] = float(l[2])
     water_usage["China"][animal] = float(l[3])
     water_usage["Japan"][animal] = float(l[4])
     water_usage["United Republic of Tanzania"][animal] = float(l[5])
     water_usage["United States of America"][animal] = float(l[6])
#print water_usage
for ck in countries.keys():
    countries[ck]["water_footprint_per_capita"] = 0
    for ak in countries[ck]["foods"].keys():
        if ak == "fish":
            pass
        else:
            countries[ck]["water_footprint_per_capita"] += int(countries[ck]["foods"][ak]*water_usage[ck][ak])
watercsv.close()

#Now we add in some other random data for countries to add context
metacsv = open("fof_diet.csv", "rU")
for l in csv.reader(metacsv.readlines()[1:]):
    country = l[0]
    countries[country]["kcal/day"] = l[1]
    countries[country]["protein"] = l[2]
    countries[country]["fat"] = l[3]
    countries[country]["income"] = l[4]
metacsv.close()

#Add in the population and figure out the number of animals
for ck in countries.keys():
    countries[ck]["population"] = pop_dict[ck]
    for ak in countries[ck]["foods"].keys():
        countries[ck]["foods"][ak] = int(countries[ck]["foods"][ak] * pop_dict[ck] / float(kg_to_animals[ak]))


#This is to print data.
# for ck in countries.keys():
#     for ak in countries[ck].keys():
#         print "%s|%s|%s" %(ck, ak, countries[ck][ak])

meat_data = json.dumps(countries, indent=4)
f = open("meat_data.json", "w")
f.write(meat_data)
f.close()