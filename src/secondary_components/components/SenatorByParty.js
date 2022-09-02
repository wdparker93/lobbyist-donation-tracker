import "../css/SenatorByParty.css";

let columnNameArr = [
  {
    id: "ID",
    firstName: "First",
    lastName: "Last",
    state: "State",
    dollarsReceived: "$ Received",
  },
];

let senatorDataArr = [];

function SenatorByParty(senatorPartyData) {
  let partyAbbrev = Object.values(senatorPartyData.senatorPartyData[0])[2];
  let partyName = "";
  if (partyAbbrev == "R") {
    partyName = "Republican";
  } else if (partyAbbrev == "D") {
    partyName = "Democratic";
  } else if (partyAbbrev == "I") {
    partyName = "Independent";
  } else {
    partyName = "Invalid";
  }

  const populateSenatorData = () => {
    for (let i = 0; i < senatorPartyData.senatorPartyData.length; i++) {
      let senObj = new Object();
      let id = i + 1;
      let firstName = Object.values(senatorPartyData.senatorPartyData[i])[0];
      let lastName = Object.values(senatorPartyData.senatorPartyData[i])[1];
      let party = Object.values(senatorPartyData.senatorPartyData[i])[2];
      let state = Object.values(senatorPartyData.senatorPartyData[i])[3];
      let dollarsReceived = Object.values(
        senatorPartyData.senatorPartyData[i]
      )[4];
      senObj.id = id;
      senObj.firstName = firstName;
      senObj.lastName = lastName;
      senObj.state = state;
      senObj.dollarsReceived = dollarsReceived.toLocaleString("en-US");
      senatorDataArr.push(senObj);
    }
  };

  const SenatorTableElement = (props) => {
    const { elementData } = props;
    const { id, firstName, lastName, state, dollarsReceived } = elementData;
    let rowClassName = "data-row";
    let numId = "id-" + { id };
    let firstNameId = "first-name-" + { id };
    let lastNameId = "last-name-" + { id };
    let stateId = "state-" + { id };
    let dollarsReceivedId = "dollars-received-" + { id };
    return (
      <>
        <div className={rowClassName}>
          <div id={numId}>{id}</div>
          <div id={firstNameId}>{firstName}</div>
          <div id={lastNameId}>{lastName}</div>
          <div id={stateId}>{state}</div>
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
      <div id="output-wrapper-party">
        {partyName} Senators:
        <div id="senator-names-list-wrapper-party">
          <div id="data-column-names">{generateColumnNames()}</div>
          <div id="senator-names-list-party">{generateSenatorData()}</div>
        </div>
      </div>
    </>
  );
}

export default SenatorByParty;
