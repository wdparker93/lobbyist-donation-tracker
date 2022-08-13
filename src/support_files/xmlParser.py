import xml.etree.ElementTree as ET
import os

#Parse the XML
cwd = os.getcwd()
myTree = ET.parse(cwd + '\src\support_files\current_senator_data.xml')
myRoot = myTree.getroot()

#Arrays that hold XML values
SENATOR_KEY = []
LAST_NAME = []
FIRST_NAME = []
PARTY = []
STATE = []
ADDRESS = []
PHONE = []
EMAIL = []
WEBSITE = []
CLASS = []
BIOGUIDE_ID = []

#Get values from the XML
for item in myRoot.findall('./member'):
    for child in item:
        if(child.tag == 'member_full'):
            SENATOR_KEY.append(child.text)
        elif(child.tag == 'last_name'):
            LAST_NAME.append(child.text)
        elif(child.tag == 'first_name'):
            FIRST_NAME.append(child.text)
        elif(child.tag == 'party'):
            PARTY.append(child.text)
        elif(child.tag == 'state'):
            STATE.append(child.text)
        elif(child.tag == 'address'):
            ADDRESS.append(child.text)
        elif(child.tag == 'phone'):
            PHONE.append(child.text)
        elif(child.tag == 'email'):
            EMAIL.append(child.text)
        elif(child.tag == 'website'):
            WEBSITE.append(child.text)
        elif(child.tag == 'class'):
            CLASS.append(child.text)
        elif(child.tag == 'bioguide_id'):
            BIOGUIDE_ID.append(child.text)

#Build the SQL query
sqlInsertQuery = """INSERT INTO current_senator_data(SENATOR_KEY, LAST_NAME, FIRST_NAME, 
PARTY, STATE, ADDRESS, PHONE, EMAIL, WEBSITE, CLASS, BIOGUIDE_ID)
VALUES """

for i in range(len(SENATOR_KEY)):
    sqlInsertQuery += '('
    sqlInsertQuery += "'" + SENATOR_KEY[i] + "', "
    sqlInsertQuery += "'" + LAST_NAME[i] + "', "
    sqlInsertQuery += "'" + FIRST_NAME[i] + "', "
    sqlInsertQuery += "'" + PARTY[i] + "', "
    sqlInsertQuery += "'" + STATE[i] + "', "
    sqlInsertQuery += "'" + ADDRESS[i] + "', "
    sqlInsertQuery += "'" + PHONE[i] + "', "
    sqlInsertQuery += "'" + EMAIL[i] + "', "
    sqlInsertQuery += "'" + WEBSITE[i] + "', "
    sqlInsertQuery += "'" + CLASS[i] + "', "
    sqlInsertQuery += "'" + BIOGUIDE_ID[i] + "')"
    if i < (len(SENATOR_KEY) - 1):
        sqlInsertQuery += ", "

#Print the query so it can get run
print(sqlInsertQuery)