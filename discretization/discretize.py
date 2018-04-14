#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Apr 14 11:32:29 2018

@author: Jackson
"""

import pandas as pd
import matplotlib.pyplot as plt


#%% discretize abv
def discretize_abv():
    abvs = beers["abv"]
    
    # Discretizing
    binned_abvs = []
    bin_names = ["none", "low", "med", "high"]
    abv_named = []
    zeros = 0
    for i in range(len(abvs)):
        if abvs[i] == 0:
            zeros+=1
            binned_abvs.append(0)
            abv_named.append(bin_names[0])
        else:
            if abvs[i] <= .05:
                binned_abvs.append(1)
                abv_named.append(bin_names[1])
            else:
                if abvs[i] <= .065:
                    binned_abvs.append(2)
                    abv_named.append(bin_names[2])
                else:
                    binned_abvs.append(3)
                    abv_named.append(bin_names[3])

    print abv_named
    print "Zeros:",zeros
    print "____________________\n"
    
    # Counting Items in each bin
    ones = 0
    twos = 0
    threes = 0
    for abv in binned_abvs:
        if abv == 1:
            ones += 1
        else:
            if abv == 2:
                twos += 1
            else:
                threes += 1
    
    # Number of budgets in each bin
    print "Ones: ",ones
    print "Twos:",twos
    print "Threes:",threes
    bins = [0, 1, 2, 3]
    
    # Bar Graph
    X = range(len(bins))
    Y = [binned_abvs.count(bins[x]) for x in X]
    plt.bar(X,Y)
    plt.xticks(X, bin_names)
    plt.show
    
    # Writing Data
    new_data["abv_level"] = abv_named
    
    return

#%% IBU
    
def ibu():
    ibus = beers['ibu']
    
    # Discretizing
    binned = []
    bin_names = ["none", "low", "med", "high"]
    named = []
    zeros = 0
    for i in range(len(ibus)):
        if ibus[i]=="":
            print True
        if ibus[i] <= 25:
            binned.append(1)
            named.append(bin_names[1])
        else:
            if ibus[i] <= 53:
                binned.append(2)
                named.append(bin_names[2])
            else:
                if ibus[i] <= 138: # max ibu is 138
                    binned.append(3)
                    named.append(bin_names[3])
                else:
                    binned.append(0)
                    named.append(bin_names[0])

   
    # Counting Items in each bin
    ones = 0
    twos = 0
    threes = 0
    for abv in binned:
        if abv == 0:
            zeros +=1
        else: 
            if abv == 1:
                ones += 1
            else:
                if abv == 2:
                    twos += 1
                else:
                    if abv == 3:
                        threes += 1
    
    print named
    print "Zeros:",zeros
    print "____________________\n"
    
    
    # Number of budgets in each bin
    print "Ones: ",ones
    print "Twos:",twos
    print "Threes:",threes
    bins = [0, 1, 2, 3]
    
    # Bar Graph
    X = range(len(bins))
    Y = [binned.count(bins[x]) for x in X]
    plt.bar(X,Y)
    plt.xticks(X, bin_names)
    plt.show
    
    # Writing Data
    new_data["ibu_level"] = named
    return

#%% Data
beers = pd.read_csv('../beers.csv')
breweries = pd.read_csv('../breweries.csv')
new_data = {}

#%% Write to csv
discretize_abv()
ibu()
pd.DataFrame(index=beers['name'], data=new_data).to_csv(path_or_buf='./discretized_data.csv')