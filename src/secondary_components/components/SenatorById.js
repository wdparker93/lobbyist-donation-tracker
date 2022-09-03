import "../css/SenatorById.css";

let columnNameArr = [
  {
    id: "ID",
    firstName: "First",
    lastName: "Last",
    state: "State",
    party: "Party",
    dollarsReceived: "$ Received",
  },
];

let senatorDataArr = [];

function SenatorById(senatorIdData) {
  let firstNamePrint = Object.values(senatorIdData.senatorIdData[0])[0];
  let lastNamePrint = Object.values(senatorIdData.senatorIdData[0])[1];
  let fullNamePrint = firstNamePrint + " " + lastNamePrint;

  const populateSenatorData = () => {
    for (let i = 0; i < senatorIdData.senatorIdData.length; i++) {
      let senObj = {};
      let id = i + 1;
      let firstName = Object.values(senatorIdData.senatorIdData[i])[0];
      let lastName = Object.values(senatorIdData.senatorIdData[i])[1];
      let party = Object.values(senatorIdData.senatorIdData[i])[2];
      let state = Object.values(senatorIdData.senatorIdData[i])[3];
      let dollarsReceived = Object.values(senatorIdData.senatorIdData[i])[4];
      senObj.id = id;
      senObj.firstName = firstName;
      senObj.lastName = lastName;
      senObj.state = state;
      senObj.party = party;
      senObj.dollarsReceived = dollarsReceived.toLocaleString("en-US");
      senatorDataArr.push(senObj);
    }
  };

  const SenatorTableElement = (props) => {
    const { elementData } = props;
    const { id, firstName, lastName, state, party, dollarsReceived } =
      elementData;
    let rowClassName = "data-row-by-id";
    let numId = "id-" + { id };
    let firstNameId = "first-name-" + { id };
    let lastNameId = "last-name-" + { id };
    let stateId = "state-" + { id };
    let partyId = "party-" + { id };
    let dollarsReceivedId = "dollars-received-" + { id };
    return (
      <>
        <div className={rowClassName}>
          <div id={numId}>{id}</div>
          <div id={firstNameId}>{firstName}</div>
          <div id={lastNameId}>{lastName}</div>
          <div id={stateId}>{state}</div>
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
      <div id="output-wrapper-id">
        Senator {fullNamePrint}:
        <div id="senator-names-list-wrapper-id">
          <div id="data-column-names">{generateColumnNames()}</div>
          <div id="senator-names-list-id">{generateSenatorData()}</div>
        </div>
      </div>
    </>
  );
}

export default SenatorById;
