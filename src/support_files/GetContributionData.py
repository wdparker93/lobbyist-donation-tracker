from asyncio.windows_events import NULL
from pip._vendor import requests
import json

# Strategy:
#  There are 99359 entries for contributions between 1992-01-01 and 2022-08-14
#  Get the results with json_object[results]
#  Build a dictionary with all the results
#  Once all 25 results have been processed from a page
#    1. Get the value of the next field which can be found in the parent level of results
#    2. Call the API with the value obtained in step 1
#    3. The value in next will be null on the last page -> Use this as the check condition in the while loop
#
#  Each first generation of results ((great x ?) grandparent) will have child components listed below
#    Parent: filer_type (lobbyist often)
#      Child1: registrant - Only one
#        a. name (contributor's company name)
#        b. city (Bham, etc.)
#        c. state (AL, etc.)
#        d. country (US, etc.)
#      Child2: lobbyist - Only one
#      Child3: contribution_items - One to many. -> This is the juicy one
#        a. honoree_name (senator, etc.)
#        b. payee_name (shell company for politician, campaign fund, etc.)
#        c. amount ($$)
#        d. date (when payment received)

#Try to connect to the API
response_API = requests.get('https://lda.senate.gov/api/v1/contributions/?filing_uuid=&filing_type=&filing_year=&filing_period=&filing_dt_posted_after=1992-01-01&filing_dt_posted_before=2022-08-14&registrant_id=&registrant_name=&lobbyist_id=&lobbyist_name=&contribution_date_after=1992-01-01&contribution_date_before=2022-08-14&contribution_amount_min=&contribution_amount_max=&contribution_type=&contribution_contributor=&contribution_payee=&contribution_honoree=')

#Check connection status
apiStatusCode = response_API.status_code
if apiStatusCode == 200:
    print('Connection Successful on Request for Page 1')
else:
    print('Connection Failed on Request for Page 1')
    exit()


#Handle the results and build a dictionary
outputSummary = {}

nextPageLink = 'do-While Starter'
for i in range(2):    #Test with small number of items
#while nextPageLink != NULL:
    #Get the data
    data = response_API.text
    json_object = json.loads(data)
    json_object_results = json_object["results"]

    #Do work and get the data into the dictionary
    for j in range(len(json_object_results)):
        primaryResultEntry = json_object_results[j]
        key = 'key' + str(j)    #Goes to final output
        filerType = primaryResultEntry["filer_type"]   #Goes to final output
        json_object_registrant = primaryResultEntry["registrant"]
        donatorName = json_object_registrant["name"]    #Goes to final output
        donatorCity = json_object_registrant["city"]    #Goes to final output
        donatorState = json_object_registrant["state"]  #Goes to final output
        donatorCountry = json_object_registrant["country"]  #Goes to final output
        contributionItems = primaryResultEntry["contribution_items"]
        contrItemSummary = [[0]*3]*len(contributionItems) #Goes to final output
        #Summarize each item
        for k in range(len(contributionItems)):
            itemValueArray = []
            #Get the values
            donationRecipient = (contributionItems[k])["honoree_name"]
            donationAmount = (contributionItems[k])["amount"]
            donationDate = (contributionItems[k])["date"]
            #Put them in the array
            itemValueArray.append(donationRecipient)
            itemValueArray.append(donationAmount)
            itemValueArray.append(donationDate)
            #Put them in the parent array
            contrItemSummary[k] = itemValueArray

        #Add data to the dictionary
        outputSummary[key] = [filerType, donatorName, donatorCity, donatorState, donatorCountry, contrItemSummary]
        print('PRINTING DICTIONARY')
        print(outputSummary)

    #Set up to get the next page...
    nextPageLink = json_object["next"]
    #As long as it's not the last one
    if (nextPageLink != NULL):
        response_API = requests.get(nextPageLink)
        apiStatusCode = response_API.status_code
        if apiStatusCode == 200:
            print('Connection Successful on Request for Page ' + str(i + 2))
        else:
            print('Connection Failed on Request for Page ' + str(i + 2))
            exit()
