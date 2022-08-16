from asyncio.windows_events import NULL
from pip._vendor import requests
import json
import os
import mysql.connector

#  Strategy:
#  There are ((99359 pages) * (<= 25 entries per page)) entries for contributions between 1992-01-01 and 2022-08-14
#  Get the results with json_object[results]
#  Build a dictionary with all the results
#  Once all 25 results have been processed from a page
#    1. Get the value of the next field which can be found in the parent level of results
#    2. Call the API with the value obtained in step 1
#    3. The value in next will be null on the last page -> Use this as the check condition in the while loop
#
#  Each first generation of results ((great x ?) grandparent) will have child components listed below
#    Parent (gen1): 
#      a. filer_type (lobbyist often)
#      b. no_contributions (true if no contributions were made)
#      Child1: registrant - Only one per result
#        a. name (donator's company name)
#        b. city (Bham, etc.)
#        c. state (AL, etc.)
#        d. country (US, etc.)
#      Child2: lobbyist - Only one per result
#        a. Not being used here.
#      Child3: contribution_items - One to many per result -> This is the juicy one
#        a. honoree_name (senator, etc.)
#        b. payee_name (shell company for politician, campaign fund, etc.)
#        c. amount ($$)
#        d. date (when payment received)

#Executes array of insertion queries to the database for each page of results
def insertToDatabase(insertQueryArr):
    dbConnection = mysql.connector.connect(user="root", password="password", host="localhost", database="congressional_voting_schema")
    if dbConnection.is_connected():
        print('Connection to MySQL DB Successful')
    else:
        print('ERROR: Did not connect to MySQL DB')
        exit()
    crsr = dbConnection.cursor()
    for i in range(len(insertQueryArr)):
        print(insertQueryArr[i])
        crsr.execute(insertQueryArr[i])
        dbConnection.commit()
    dbConnection.close()

#Check for NoneTypes and get rid of ' characters before inserting to DB
def sanitizeData(paramArray):
    for i in range(len(paramArray)):
        param = paramArray[i]
        if param is None:
            param = ""
        param = param.replace("'","")
        paramArray[i] = param
    return paramArray

#Takes the data from a summary of page output and generates a SQL query
#so the data can be inserted into a database
def generateSQLInsert(pageOutputSummary):
    insertQueryArr = []
    for key in pageOutputSummary.keys():
        DONATOR_TYPE = pageOutputSummary[key][0]
        DONATOR_NAME = pageOutputSummary[key][1]
        DONATOR_CITY = pageOutputSummary[key][2]
        DONATOR_STATE = pageOutputSummary[key][3]
        DONATOR_COUNTRY = pageOutputSummary[key][4]
        RECIPIENT_NAME_RAW = ''
        DONATION_AMOUNT = ''
        DONATION_DATE = ''
        #print(pageOutputSummary[key][5])
        #print(len(pageOutputSummary[key][5]))
        for i in range(len(pageOutputSummary[key][5])):
            paramArray = []
            contribution = pageOutputSummary[key][5][i]
            #print(contribution)
            RECIPIENT_SHELL_NAME_RAW = contribution[0]
            RECIPIENT_NAME_RAW = contribution[1]
            DONATION_AMOUNT = contribution[2]
            DONATION_DATE = contribution[3]
            paramArray.append(DONATOR_TYPE)
            paramArray.append(DONATOR_NAME)
            paramArray.append(DONATOR_CITY)
            paramArray.append(DONATOR_STATE)
            paramArray.append(DONATOR_COUNTRY)
            paramArray.append(RECIPIENT_SHELL_NAME_RAW)
            paramArray.append(RECIPIENT_NAME_RAW)
            #print(RECIPIENT_NAME_RAW)
            paramArray.append(DONATION_AMOUNT)
            paramArray.append(DONATION_DATE)
            paramArray = sanitizeData(paramArray)
            if RECIPIENT_NAME_RAW != "N/A" and RECIPIENT_SHELL_NAME_RAW != "N/A":
                sqlInsertString = """INSERT INTO contributions_data(DONATOR_TYPE, DONATOR_NAME, DONATOR_CITY, 
                    DONATOR_STATE, DONATOR_COUNTRY, RECIPIENT_SHELL_NAME_RAW, RECIPIENT_NAME_RAW, DONATION_AMOUNT, DONATION_DATE, 
                    RECIPIENT_NAME, RECIPIENT_ID, RECIPIENT_SHELL_NAME) VALUES """
                sqlInsertString += "('" + paramArray[0] + "', "
                sqlInsertString += "'" + paramArray[1] + "', "
                sqlInsertString += "'" + paramArray[2] + "', "
                sqlInsertString += "'" + paramArray[3] + "', "
                sqlInsertString += "'" + paramArray[4] + "', "
                sqlInsertString += "'" + paramArray[5] + "', "
                sqlInsertString += "'" + paramArray[6] + "', "
                sqlInsertString += "'" + paramArray[7] + "', "
                sqlInsertString += "'" + paramArray[8] + "', "
                sqlInsertString += "'', "
                sqlInsertString += "'', "
                sqlInsertString += "'');"
                #print(sqlInsertString)
                insertQueryArr.append(sqlInsertString)
    if len(insertQueryArr) > 0:
        insertToDatabase(insertQueryArr)

################################################################################################
#Program starting point
################################################################################################
#Connect to the API
response_API = requests.get('https://lda.senate.gov/api/v1/contributions/')

#Check connection status
pageCounter = 1
apiStatusCode = response_API.status_code
if apiStatusCode == 200:
    print('Connection Successful on Request for Page ' + str(pageCounter))
else:
    print('Connection Failed on Request for Page ' + str(pageCounter))
    exit()

progressTrackerFile = os.getcwd() + '\src\support_files\progress_tracker.txt'

nextPageLink = 'do-While Starter'
#for i in range(1):    #Test with small number of items
while nextPageLink != NULL:
    #Get the data and build the dictionary
    data = response_API.text
    json_object = json.loads(data)
    json_object_results = json_object["results"]
    #The final dictionary
    pageOutputSummary = {}

    #Do work and get the data into the dictionary
    for j in range(len(json_object_results)):
        primaryResultEntry = json_object_results[j]
        noContributionsMade = primaryResultEntry["no_contributions"]
        #print(noContributionsMade)
        if noContributionsMade == False:
            key = 'key' + str(j)    #Goes to final output
            filerType = primaryResultEntry["filer_type"]   #Goes to final output
            json_object_registrant = primaryResultEntry["registrant"]
            donatorName = json_object_registrant["name"]    #Goes to final output
            donatorCity = json_object_registrant["city"]    #Goes to final output
            donatorState = json_object_registrant["state"]  #Goes to final output
            donatorCountry = json_object_registrant["country"]  #Goes to final output
            contributionItems = primaryResultEntry["contribution_items"]
            contrItemSummary = [[0]*4]*len(contributionItems) #Goes to final output
            #Summarize each item
            for k in range(len(contributionItems)):
                itemValueArray = []
                #Get the values
                donationRecipientShell = (contributionItems[k])["payee_name"]
                donationRecipient = (contributionItems[k])["honoree_name"]
                #print(donationRecipient)
                donationAmount = (contributionItems[k])["amount"]
                donationDate = (contributionItems[k])["date"]
                #Put them in the array
                itemValueArray.append(donationRecipientShell)
                itemValueArray.append(donationRecipient)
                itemValueArray.append(donationAmount)
                itemValueArray.append(donationDate)
                #Put them in the parent array
                contrItemSummary[k] = itemValueArray
            #Add data to the dictionary
            pageOutputSummary[key] = [filerType, donatorName, donatorCity, donatorState, donatorCountry, contrItemSummary]
    #print('PRINTING DICTIONARY')
    #print(pageOutputSummary)
    generateSQLInsert(pageOutputSummary)
    pageCounter += 1

    #Set up to get the next page...
    nextPageLink = json_object["next"]
    #As long as it's not the last one
    if (nextPageLink != NULL):
        response_API = requests.get(nextPageLink)
        apiStatusCode = response_API.status_code
        if apiStatusCode == 200:
            print('Connection Successful on Request for Page ' + str(pageCounter))
            with(open(progressTrackerFile, "w")) as f:
                print("Last next link: " + str(nextPageLink), file = f)
        else:
            print('Connection Failed on Request for Page ' + str(pageCounter))
            exit()
