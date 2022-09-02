import "../css/SenatorByStateParty.css";

let columnNameArr = [
  {
    id: "ID",
    firstName: "First",
    lastName: "Last",
    party: "Party",
    dollarsReceived: "$ Received",
  },
];

let senatorDataArr = [];

function SenatorByStateParty(senatorStatePartyData) {
  let stateAbbrev = Object.values(
    senatorStatePartyData.senatorStatePartyData[0]
  )[3];
  let partyAbbrev = Object.values(
    senatorStatePartyData.senatorStatePartyData[0]
  )[2];
  let partyName = "";
  if (partyAbbrev === "R") {
    partyName = "Republican";
  } else if (partyAbbrev === "D") {
    partyName = "Democratic";
  } else if (partyAbbrev === "I") {
    partyName = "Independent";
  } else {
    partyName = "Invalid";
  }

  const populateSenatorData = () => {
    for (
      let i = 0;
      i < senatorStatePartyData.senatorStatePartyData.length;
      i++
    ) {
      let senObj = new Object();
      let id = i + 1;
      let firstName = Object.values(
        senatorStatePartyData.senatorStatePartyData[i]
      )[0];
      let lastName = Object.values(
        senatorStatePartyData.senatorStatePartyData[i]
      )[1];
      let party = Object.values(
        senatorStatePartyData.senatorStatePartyData[i]
      )[2];
      let dollarsReceived = Object.values(
        senatorStatePartyData.senatorStatePartyData[i]
      )[4];
      senObj.id = id;
      senObj.firstName = firstName;
      senObj.lastName = lastName;
      senObj.party = party;
      senObj.dollarsReceived = dollarsReceived.toLocaleString("en-US");
      senatorDataArr.push(senObj);
    }
  };

  const SenatorTableElement = (props) => {
    const { elementData } = props;
    const { id, firstName, lastName, party, dollarsReceived } = elementData;
    let rowClassName = "data-row";
    let numId = "id-" + { id };
    let firstNameId = "first-name-" + { id };
    let lastNameId = "last-name-" + { id };
    let partyId = "party-" + { id };
    let dollarsReceivedId = "dollars-received-" + { id };
    return (
      <>
        <div className={rowClassName}>
          <div id={numId}>{id}</div>
          <div id={firstNameId}>{firstName}</div>
          <div id={lastNameId}>{lastName}</div>
          <div id={partyId}>{party}</div>
          <div id={dollarsReceivedId}>{dollarsReceived}</div>
        </div>
      </>
    );
  };

  const generateColumnNames = () => {
    return columnNameArr.map((el) => <SenatorTableElement elementData={el} />);
  };

  const generateSenatorData = () => {
    return senatorDataArr.map((el) => <SenatorTableElement elementData={el} />);
  };

  senatorDataArr = [];
  populateSenatorData();

  return (
    <>
      <div id="output-wrapper-state-party">
        {partyName} Senators from {stateAbbrev}:
        <div id="senator-names-list-wrapper-state-party">
          <div id="data-column-names">{generateColumnNames()}</div>
          <div id="senator-names-list-state-party">{generateSenatorData()}</div>
        </div>
      </div>
    </>
  );
}

export default SenatorByStateParty;
