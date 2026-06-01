// Static fallback roster — overwritten automatically by the weekly sync workflow.
// Source: https://github.com/unitedstates/congress-legislators
// To update manually: run the Weekly LDA Data Sync workflow in GitHub Actions.
export const SENATORS = [
  // Alabama
  { id: 'katie-britt', firstName: 'Katie', lastName: 'Britt', state: 'AL', party: 'R', aliases: ['Katie Britt', 'K. Britt'] },
  { id: 'tommy-tuberville', firstName: 'Tommy', lastName: 'Tuberville', state: 'AL', party: 'R', aliases: ['Tommy Tuberville'] },
  // Alaska
  { id: 'lisa-murkowski', firstName: 'Lisa', lastName: 'Murkowski', state: 'AK', party: 'R', aliases: ['Lisa Murkowski'] },
  { id: 'dan-sullivan', firstName: 'Dan', lastName: 'Sullivan', state: 'AK', party: 'R', aliases: ['Dan Sullivan', 'Daniel Sullivan'] },
  // Arizona
  { id: 'mark-kelly', firstName: 'Mark', lastName: 'Kelly', state: 'AZ', party: 'D', aliases: ['Mark Kelly'] },
  { id: 'ruben-gallego', firstName: 'Ruben', lastName: 'Gallego', state: 'AZ', party: 'D', aliases: ['Ruben Gallego'] },
  // Arkansas
  { id: 'john-boozman', firstName: 'John', lastName: 'Boozman', state: 'AR', party: 'R', aliases: ['John Boozman'] },
  { id: 'tom-cotton', firstName: 'Tom', lastName: 'Cotton', state: 'AR', party: 'R', aliases: ['Tom Cotton', 'Thomas Cotton'] },
  // California
  { id: 'alex-padilla', firstName: 'Alex', lastName: 'Padilla', state: 'CA', party: 'D', aliases: ['Alex Padilla', 'Alejandro Padilla'] },
  { id: 'adam-schiff', firstName: 'Adam', lastName: 'Schiff', state: 'CA', party: 'D', aliases: ['Adam Schiff'] },
  // Colorado
  { id: 'michael-bennet', firstName: 'Michael', lastName: 'Bennet', state: 'CO', party: 'D', aliases: ['Michael Bennet', 'Mike Bennet'] },
  { id: 'john-hickenlooper', firstName: 'John', lastName: 'Hickenlooper', state: 'CO', party: 'D', aliases: ['John Hickenlooper'] },
  // Connecticut
  { id: 'richard-blumenthal', firstName: 'Richard', lastName: 'Blumenthal', state: 'CT', party: 'D', aliases: ['Richard Blumenthal', 'Dick Blumenthal'] },
  { id: 'chris-murphy', firstName: 'Chris', lastName: 'Murphy', state: 'CT', party: 'D', aliases: ['Chris Murphy', 'Christopher Murphy'] },
  // Delaware
  { id: 'lisa-blunt-rochester', firstName: 'Lisa', lastName: 'Blunt Rochester', state: 'DE', party: 'D', aliases: ['Lisa Blunt Rochester'] },
  { id: 'chris-coons', firstName: 'Chris', lastName: 'Coons', state: 'DE', party: 'D', aliases: ['Chris Coons', 'Christopher Coons'] },
  // Florida
  { id: 'rick-scott', firstName: 'Rick', lastName: 'Scott', state: 'FL', party: 'R', aliases: ['Rick Scott', 'Richard Scott'] },
  { id: 'ashley-moody', firstName: 'Ashley', lastName: 'Moody', state: 'FL', party: 'R', aliases: ['Ashley Moody'] },
  // Georgia
  { id: 'jon-ossoff', firstName: 'Jon', lastName: 'Ossoff', state: 'GA', party: 'D', aliases: ['Jon Ossoff', 'Jonathan Ossoff'] },
  { id: 'raphael-warnock', firstName: 'Raphael', lastName: 'Warnock', state: 'GA', party: 'D', aliases: ['Raphael Warnock'] },
  // Hawaii
  { id: 'mazie-hirono', firstName: 'Mazie', lastName: 'Hirono', state: 'HI', party: 'D', aliases: ['Mazie Hirono'] },
  { id: 'brian-schatz', firstName: 'Brian', lastName: 'Schatz', state: 'HI', party: 'D', aliases: ['Brian Schatz'] },
  // Idaho
  { id: 'mike-crapo', firstName: 'Mike', lastName: 'Crapo', state: 'ID', party: 'R', aliases: ['Mike Crapo', 'Michael Crapo'] },
  { id: 'jim-risch', firstName: 'Jim', lastName: 'Risch', state: 'ID', party: 'R', aliases: ['Jim Risch', 'James Risch'] },
  // Illinois
  { id: 'dick-durbin', firstName: 'Dick', lastName: 'Durbin', state: 'IL', party: 'D', aliases: ['Dick Durbin', 'Richard Durbin'] },
  { id: 'tammy-duckworth', firstName: 'Tammy', lastName: 'Duckworth', state: 'IL', party: 'D', aliases: ['Tammy Duckworth'] },
  // Indiana
  { id: 'todd-young', firstName: 'Todd', lastName: 'Young', state: 'IN', party: 'R', aliases: ['Todd Young'] },
  { id: 'jim-banks', firstName: 'Jim', lastName: 'Banks', state: 'IN', party: 'R', aliases: ['Jim Banks', 'James Banks'] },
  // Iowa
  { id: 'chuck-grassley', firstName: 'Chuck', lastName: 'Grassley', state: 'IA', party: 'R', aliases: ['Chuck Grassley', 'Charles Grassley'] },
  { id: 'joni-ernst', firstName: 'Joni', lastName: 'Ernst', state: 'IA', party: 'R', aliases: ['Joni Ernst'] },
  // Kansas
  { id: 'jerry-moran', firstName: 'Jerry', lastName: 'Moran', state: 'KS', party: 'R', aliases: ['Jerry Moran', 'Gerald Moran'] },
  { id: 'roger-marshall', firstName: 'Roger', lastName: 'Marshall', state: 'KS', party: 'R', aliases: ['Roger Marshall'] },
  // Kentucky
  { id: 'mitch-mcconnell', firstName: 'Mitch', lastName: 'McConnell', state: 'KY', party: 'R', aliases: ['Mitch McConnell', 'Addison McConnell'] },
  { id: 'rand-paul', firstName: 'Rand', lastName: 'Paul', state: 'KY', party: 'R', aliases: ['Rand Paul', 'Randal Paul'] },
  // Louisiana
  { id: 'bill-cassidy', firstName: 'Bill', lastName: 'Cassidy', state: 'LA', party: 'R', aliases: ['Bill Cassidy', 'William Cassidy'] },
  { id: 'john-kennedy', firstName: 'John', lastName: 'Kennedy', state: 'LA', party: 'R', aliases: ['John Kennedy', 'John Neely Kennedy'] },
  // Maine
  { id: 'susan-collins', firstName: 'Susan', lastName: 'Collins', state: 'ME', party: 'R', aliases: ['Susan Collins'] },
  { id: 'angus-king', firstName: 'Angus', lastName: 'King', state: 'ME', party: 'I', aliases: ['Angus King'] },
  // Maryland
  { id: 'chris-van-hollen', firstName: 'Chris', lastName: 'Van Hollen', state: 'MD', party: 'D', aliases: ['Chris Van Hollen', 'Christopher Van Hollen'] },
  { id: 'angela-alsobrooks', firstName: 'Angela', lastName: 'Alsobrooks', state: 'MD', party: 'D', aliases: ['Angela Alsobrooks'] },
  // Massachusetts
  { id: 'elizabeth-warren', firstName: 'Elizabeth', lastName: 'Warren', state: 'MA', party: 'D', aliases: ['Elizabeth Warren'] },
  { id: 'ed-markey', firstName: 'Ed', lastName: 'Markey', state: 'MA', party: 'D', aliases: ['Ed Markey', 'Edward Markey'] },
  // Michigan
  { id: 'gary-peters', firstName: 'Gary', lastName: 'Peters', state: 'MI', party: 'D', aliases: ['Gary Peters'] },
  { id: 'elissa-slotkin', firstName: 'Elissa', lastName: 'Slotkin', state: 'MI', party: 'D', aliases: ['Elissa Slotkin'] },
  // Minnesota
  { id: 'amy-klobuchar', firstName: 'Amy', lastName: 'Klobuchar', state: 'MN', party: 'D', aliases: ['Amy Klobuchar'] },
  { id: 'tina-smith', firstName: 'Tina', lastName: 'Smith', state: 'MN', party: 'D', aliases: ['Tina Smith'] },
  // Mississippi
  { id: 'roger-wicker', firstName: 'Roger', lastName: 'Wicker', state: 'MS', party: 'R', aliases: ['Roger Wicker'] },
  { id: 'cindy-hyde-smith', firstName: 'Cindy', lastName: 'Hyde-Smith', state: 'MS', party: 'R', aliases: ['Cindy Hyde-Smith', 'Cindy Hyde Smith'] },
  // Missouri
  { id: 'josh-hawley', firstName: 'Josh', lastName: 'Hawley', state: 'MO', party: 'R', aliases: ['Josh Hawley', 'Joshua Hawley'] },
  { id: 'eric-schmitt', firstName: 'Eric', lastName: 'Schmitt', state: 'MO', party: 'R', aliases: ['Eric Schmitt'] },
  // Montana
  { id: 'steve-daines', firstName: 'Steve', lastName: 'Daines', state: 'MT', party: 'R', aliases: ['Steve Daines', 'Steven Daines'] },
  { id: 'tim-sheehy', firstName: 'Tim', lastName: 'Sheehy', state: 'MT', party: 'R', aliases: ['Tim Sheehy', 'Timothy Sheehy'] },
  // Nebraska
  { id: 'deb-fischer', firstName: 'Deb', lastName: 'Fischer', state: 'NE', party: 'R', aliases: ['Deb Fischer', 'Debra Fischer'] },
  { id: 'pete-ricketts', firstName: 'Pete', lastName: 'Ricketts', state: 'NE', party: 'R', aliases: ['Pete Ricketts', 'John Ricketts'] },
  // Nevada
  { id: 'catherine-cortez-masto', firstName: 'Catherine', lastName: 'Cortez Masto', state: 'NV', party: 'D', aliases: ['Catherine Cortez Masto'] },
  { id: 'jacky-rosen', firstName: 'Jacky', lastName: 'Rosen', state: 'NV', party: 'D', aliases: ['Jacky Rosen', 'Jacklyn Rosen'] },
  // New Hampshire
  { id: 'maggie-hassan', firstName: 'Maggie', lastName: 'Hassan', state: 'NH', party: 'D', aliases: ['Maggie Hassan', 'Margaret Hassan'] },
  { id: 'kelly-ayotte', firstName: 'Kelly', lastName: 'Ayotte', state: 'NH', party: 'R', aliases: ['Kelly Ayotte'] },
  // New Jersey
  { id: 'cory-booker', firstName: 'Cory', lastName: 'Booker', state: 'NJ', party: 'D', aliases: ['Cory Booker', 'Corey Booker'] },
  { id: 'andy-kim', firstName: 'Andy', lastName: 'Kim', state: 'NJ', party: 'D', aliases: ['Andy Kim', 'Andrew Kim'] },
  // New Mexico
  { id: 'martin-heinrich', firstName: 'Martin', lastName: 'Heinrich', state: 'NM', party: 'D', aliases: ['Martin Heinrich'] },
  { id: 'ben-ray-lujan', firstName: 'Ben Ray', lastName: 'Luján', state: 'NM', party: 'D', aliases: ['Ben Ray Luján', 'Ben Ray Lujan'] },
  // New York
  { id: 'chuck-schumer', firstName: 'Chuck', lastName: 'Schumer', state: 'NY', party: 'D', aliases: ['Chuck Schumer', 'Charles Schumer'] },
  { id: 'kirsten-gillibrand', firstName: 'Kirsten', lastName: 'Gillibrand', state: 'NY', party: 'D', aliases: ['Kirsten Gillibrand'] },
  // North Carolina
  { id: 'thom-tillis', firstName: 'Thom', lastName: 'Tillis', state: 'NC', party: 'R', aliases: ['Thom Tillis', 'Thomas Tillis'] },
  { id: 'ted-budd', firstName: 'Ted', lastName: 'Budd', state: 'NC', party: 'R', aliases: ['Ted Budd', 'Theodore Budd'] },
  // North Dakota
  { id: 'john-hoeven', firstName: 'John', lastName: 'Hoeven', state: 'ND', party: 'R', aliases: ['John Hoeven'] },
  { id: 'kevin-cramer', firstName: 'Kevin', lastName: 'Cramer', state: 'ND', party: 'R', aliases: ['Kevin Cramer'] },
  // Ohio
  { id: 'bernie-moreno', firstName: 'Bernie', lastName: 'Moreno', state: 'OH', party: 'R', aliases: ['Bernie Moreno', 'Bernardo Moreno'] },
  { id: 'jon-husted', firstName: 'Jon', lastName: 'Husted', state: 'OH', party: 'R', aliases: ['Jon Husted', 'Jonathan Husted'] },
  // Oklahoma
  { id: 'james-lankford', firstName: 'James', lastName: 'Lankford', state: 'OK', party: 'R', aliases: ['James Lankford'] },
  { id: 'markwayne-mullin', firstName: 'Markwayne', lastName: 'Mullin', state: 'OK', party: 'R', aliases: ['Markwayne Mullin'] },
  // Oregon
  { id: 'ron-wyden', firstName: 'Ron', lastName: 'Wyden', state: 'OR', party: 'D', aliases: ['Ron Wyden', 'Ronald Wyden'] },
  { id: 'jeff-merkley', firstName: 'Jeff', lastName: 'Merkley', state: 'OR', party: 'D', aliases: ['Jeff Merkley', 'Jeffrey Merkley'] },
  // Pennsylvania
  { id: 'john-fetterman', firstName: 'John', lastName: 'Fetterman', state: 'PA', party: 'D', aliases: ['John Fetterman'] },
  { id: 'dave-mccormick', firstName: 'Dave', lastName: 'McCormick', state: 'PA', party: 'R', aliases: ['Dave McCormick', 'David McCormick'] },
  // Rhode Island
  { id: 'jack-reed', firstName: 'Jack', lastName: 'Reed', state: 'RI', party: 'D', aliases: ['Jack Reed', 'John Reed'] },
  { id: 'sheldon-whitehouse', firstName: 'Sheldon', lastName: 'Whitehouse', state: 'RI', party: 'D', aliases: ['Sheldon Whitehouse'] },
  // South Carolina
  { id: 'lindsey-graham', firstName: 'Lindsey', lastName: 'Graham', state: 'SC', party: 'R', aliases: ['Lindsey Graham'] },
  { id: 'tim-scott', firstName: 'Tim', lastName: 'Scott', state: 'SC', party: 'R', aliases: ['Tim Scott', 'Timothy Scott'] },
  // South Dakota
  { id: 'john-thune', firstName: 'John', lastName: 'Thune', state: 'SD', party: 'R', aliases: ['John Thune'] },
  { id: 'mike-rounds', firstName: 'Mike', lastName: 'Rounds', state: 'SD', party: 'R', aliases: ['Mike Rounds', 'Michael Rounds'] },
  // Tennessee
  { id: 'marsha-blackburn', firstName: 'Marsha', lastName: 'Blackburn', state: 'TN', party: 'R', aliases: ['Marsha Blackburn'] },
  { id: 'bill-hagerty', firstName: 'Bill', lastName: 'Hagerty', state: 'TN', party: 'R', aliases: ['Bill Hagerty', 'William Hagerty'] },
  // Texas
  { id: 'john-cornyn', firstName: 'John', lastName: 'Cornyn', state: 'TX', party: 'R', aliases: ['John Cornyn'] },
  { id: 'ted-cruz', firstName: 'Ted', lastName: 'Cruz', state: 'TX', party: 'R', aliases: ['Ted Cruz', 'Rafael Cruz'] },
  // Utah
  { id: 'mike-lee', firstName: 'Mike', lastName: 'Lee', state: 'UT', party: 'R', aliases: ['Mike Lee', 'Michael Lee'] },
  { id: 'john-curtis', firstName: 'John', lastName: 'Curtis', state: 'UT', party: 'R', aliases: ['John Curtis'] },
  // Vermont
  { id: 'bernie-sanders', firstName: 'Bernie', lastName: 'Sanders', state: 'VT', party: 'I', aliases: ['Bernie Sanders', 'Bernard Sanders'] },
  { id: 'peter-welch', firstName: 'Peter', lastName: 'Welch', state: 'VT', party: 'D', aliases: ['Peter Welch'] },
  // Virginia
  { id: 'mark-warner', firstName: 'Mark', lastName: 'Warner', state: 'VA', party: 'D', aliases: ['Mark Warner', 'Mark R. Warner'] },
  { id: 'tim-kaine', firstName: 'Tim', lastName: 'Kaine', state: 'VA', party: 'D', aliases: ['Tim Kaine', 'Timothy Kaine'] },
  // Washington
  { id: 'patty-murray', firstName: 'Patty', lastName: 'Murray', state: 'WA', party: 'D', aliases: ['Patty Murray', 'Patricia Murray'] },
  { id: 'maria-cantwell', firstName: 'Maria', lastName: 'Cantwell', state: 'WA', party: 'D', aliases: ['Maria Cantwell'] },
  // West Virginia
  { id: 'shelley-moore-capito', firstName: 'Shelley', lastName: 'Moore Capito', state: 'WV', party: 'R', aliases: ['Shelley Moore Capito', 'Shelley Capito'] },
  { id: 'jim-justice', firstName: 'Jim', lastName: 'Justice', state: 'WV', party: 'R', aliases: ['Jim Justice', 'James Justice'] },
  // Wisconsin
  { id: 'ron-johnson', firstName: 'Ron', lastName: 'Johnson', state: 'WI', party: 'R', aliases: ['Ron Johnson', 'Ronald Johnson'] },
  { id: 'tammy-baldwin', firstName: 'Tammy', lastName: 'Baldwin', state: 'WI', party: 'D', aliases: ['Tammy Baldwin'] },
  // Wyoming
  { id: 'john-barrasso', firstName: 'John', lastName: 'Barrasso', state: 'WY', party: 'R', aliases: ['John Barrasso'] },
  { id: 'cynthia-lummis', firstName: 'Cynthia', lastName: 'Lummis', state: 'WY', party: 'R', aliases: ['Cynthia Lummis'] },
]

export const STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
]
