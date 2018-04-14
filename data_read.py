import csv

styles = []
with open("beers.csv") as beers:
    reader = csv.reader(beers, delimiter=",")
    for row in reader:
        for i in row[5].split(" / "):
            if i not in styles:
                styles.append(i)
        print(row)

print(len(styles))
