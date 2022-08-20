import "../css/SenatorByParty.css";

let senFirstNamesArr = [];
let senLastNamesArr = [];
let senStateArr = [];
let htmlString = "";
let htmlBody = "";
let htmlElement = "";
let innerHTML = "";

function SenatorByParty(senatorPartyData) {
  const generateSenatorNames = () => {
    htmlString = "";
    for (let i = 0; i < senFirstNamesArr.length; i++) {
      htmlString += "<li classname='senator-name' id='senator-name-" + i + "'>";
      htmlString +=
        i +
        1 +
        ". " +
        senFirstNamesArr[i] +
        " " +
        senLastNamesArr[i] +
        " - " +
        senStateArr[i];
      htmlString += "</li>";
    }
    htmlBody = new DOMParser().parseFromString(htmlString, "text/html");
    innerHTML = "";
    for (let i = 0; i < senFirstNamesArr.length; i++) {
      htmlElement = "";
      htmlElement = htmlBody.getElementById("senator-name-" + i);
      innerHTML += htmlElement.innerHTML + "\n";
    }
  };

  let partyAbbrev = Object.values(senatorPartyData.senatorPartyData[0])[4];
  let partyName = "";
  if (partyAbbrev === "D") {
    partyName = "Democratic";
  } else if (partyAbbrev === "R") {
    partyName = "Republican";
  } else {
    partyName = "Independent";
  }

  senFirstNamesArr = [];
  senLastNamesArr = [];
  senStateArr = [];
  for (let i = 0; i < senatorPartyData.senatorPartyData.length; i++) {
    let firstName = Object.values(senatorPartyData.senatorPartyData[i])[3];
    let lastName = Object.values(senatorPartyData.senatorPartyData[i])[2];
    let usState = Object.values(senatorPartyData.senatorPartyData[i])[5];
    senFirstNamesArr.push(firstName);
    senLastNamesArr.push(lastName);
    senStateArr.push(usState);
  }
  generateSenatorNames();

  return (
    <>
      <div id="output-wrapper">
        {partyName} Senators:
        <div id="senator-names-list-wrapper-party">
          <ul id="senator-names-list-party">{innerHTML}</ul>
        </div>
      </div>
    </>
  );
}

export default SenatorByParty;
