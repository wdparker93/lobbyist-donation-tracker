import "../css/NoSenatorsExist.css";

function NoSenatorsExist(emptyDataSet) {
  //[usState, party, senator]
  emptyDataSet = emptyDataSet.emptyDataSet;
  let emptySetMessage = "There are no ";
  if (emptyDataSet[1] !== "--") {
    if (emptyDataSet[1] === "R") {
      emptySetMessage += "Republican ";
    } else if (emptyDataSet[1] === "D") {
      emptySetMessage += "Democratic ";
    } else if (emptyDataSet[1] === "I") {
      emptySetMessage += "Independent ";
    }
  }
  emptySetMessage += "senators ";
  if (emptyDataSet[0] !== "--") {
    emptySetMessage += "from " + emptyDataSet[0] + ".";
  }
  return (
    <>
      <div id="output-wrapper-no-senators-exist">
        <div id="output-wrapper-no-senators-exist-text">
          <p id="no-senators-exist">{emptySetMessage}</p>
        </div>
      </div>
    </>
  );
}

export default NoSenatorsExist;
