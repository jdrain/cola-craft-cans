import csv

# read in the data
beer_ls= []
with open("beers.csv") as beers:
    reader = csv.reader(beers, delimiter=",")
    for row in reader:
        style_words = []
        for i in row[5].split(" "):
            if i not in style_words and i != "/":
                style_words.append(i)
        ls = row
        ls[5] = style_words
        beer_ls.append(ls)

beer_ls = beer_ls[1:]

breweries_ls = []
with open("breweries.csv") as breweries:
    reader = csv.reader(breweries, delimiter=",")
    for row in reader:
        # get id and state
        breweries_ls.append([row[0], row[1], row[3]])

breweries_ls = breweries_ls[1:]

# get the state of the brewery
for i in range(1, len(beer_ls)):
    print(beer_ls[i][6])
    ind = int(beer_ls[i][6])
    bid = int( breweries_ls[ int(beer_ls[i][6]) ][0] ) # brewery id
    brewery = breweries_ls[bid]
    beer_ls[i].append(brewery[1])
    beer_ls[i].append(brewery[2])

# run comparisons between style keywords
for i in range(0, len(beer_ls)):
    rankings = []
    for j in range(0, len(beer_ls)):
        if j != i:
            # run comparisons
            count = 0
            for k in beer_ls[i][5]:
                if k in beer_ls[j][5]:
                    count += 1
            rankings.append( (count, j) )
        else:
            rankings.append( (-1, j) )
    rankings.sort(key=lambda tup: tup[0])
    beer_ls[i].append(rankings)

for i in range(0,len(beer_ls)):
    print(beer_ls[i])

print(beer_ls[0])
