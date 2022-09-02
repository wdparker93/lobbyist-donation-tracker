import "./App.css";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import SenatorByState from "./secondary_components/components/SenatorByState.js";
import SenatorByParty from "./secondary_components/components/SenatorByParty.js";
import SenatorByStateParty from "./secondary_components/components/SenatorByStateParty.js";
import NoSenatorsExist from "./secondary_components/components/NoSenatorsExist.js";
import LoadingSenators from "./secondary_components/components/LoadingSenators.js";

function App() {
  const [usState, setUsState] = useState("--");
  const [senator, setSenator] = useState("--");
  const [party, setParty] = useState("--");
  const [senatorData, setSenatorData] = useState([]);
  const [outputComponent, setOutputComponent] = useState("");
  let loading = false;

  /**
   * Main driver for page updates.
   * Output component is chosen after queries are chosen and run.
   *
   * @param {event} event Button click action that triggers updates
   */
  const handleClick = (event) => {
    event.preventDefault();
    console.log(usState);
    console.log(senator);
    console.log(party);
    if (usState !== "--" && senator === "--" && party === "--") {
      getSenatorByState();
    } else if (usState === "--" && senator === "--" && party !== "--") {
      getSenatorByParty();
    } else if (usState !== "--" && senator === "--" && party !== "--") {
      getSenatorByStateParty();
    }
  };

  const handleUsStateChange = (event) => {
    setUsState(event.target.value);
  };

  const handleSenatorChange = (event) => {
    setSenator(event.target.value);
  };

  const handlePartyChange = (event) => {
    setParty(event.target.value);
  };

  const getSenatorByState = () => {
    loading = true;
    chooseOutputComponent(null);
    Axios.get("http://localhost:3001/api/get/byUsState/" + usState).then(
      (response) => {
        loading = false;
        setSenatorData(response.data);
        chooseOutputComponent(response.data);
      }
    );
  };

  const getSenatorByParty = () => {
    loading = true;
    chooseOutputComponent(null);
    Axios.get("http://localhost:3001/api/get/byParty/" + party).then(
      (response) => {
        loading = false;
        setSenatorData(response.data);
        chooseOutputComponent(response.data);
      }
    );
  };

  const getSenatorByStateParty = () => {
    loading = true;
    chooseOutputComponent(null);
    Axios.get(
      "http://localhost:3001/api/get/byStateParty/" + usState + "/" + party
    ).then((response) => {
      loading = false;
      setSenatorData(response.data);
      chooseOutputComponent(response.data);
    });
  };

  const chooseOutputComponent = (dataParam) => {
    if (loading) {
      setOutputComponent(<LoadingSenators />);
    } else {
      if (dataParam.length > 0) {
        if (usState !== "--" && senator === "--" && party === "--") {
          setOutputComponent(<SenatorByState senatorStateData={dataParam} />);
        } else if (usState === "--" && senator === "--" && party !== "--") {
          setOutputComponent(<SenatorByParty senatorPartyData={dataParam} />);
        } else {
          setOutputComponent(
            <SenatorByStateParty senatorStatePartyData={dataParam} />
          );
        }
      } else {
        let paramList = [];
        paramList.push(usState);
        paramList.push(party);
        paramList.push(senator);
        setOutputComponent(<NoSenatorsExist emptyDataSet={paramList} />);
      }
    }
  };

  return (
    <div className="App">
      <div className="header" id="main-header">
        <div id="main-headers">
          <h1 id="main-title">Where Does The Money Go?</h1>
          <h1 id="data-source-title">Where Does This Information Come From?</h1>
        </div>
        <div id="secondary-headers">
          <h2 id="secondary-title">
            See how much your senators are getting from lobbyists.
          </h2>
          <h2 id="data-source-explanation">
            Monetary donations to public officials are available per the
            Lobbying Disclosure Act of 1995 and can be found at{" "}
            <a class="data-link" href="https://lda.senate.gov/api/">
              https://lda.senate.gov/api/
            </a>
            .
          </h2>
        </div>
      </div>
      <div id="divider-wrapper">
        <div id="header-selection-dividers">
          <hr id="header-selection-divider-1" align="left"></hr>
          <hr id="header-selection-divider-2" align="right"></hr>
        </div>
      </div>
      <br></br>
      <div id="selection-output-wrapper">
        <div id="selection-criteria-button-wrapper">
          <div className="selector-wrapper" id="state-selector-wrapper">
            <p className="selector-label-text" id="state-selector-label">
              Select State
            </p>
            <select id="state-selector" onChange={handleUsStateChange}>
              <option value="--">--</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
          <div className="selector-wrapper" id="senator-selector-wrapper">
            <p className="selector-label-text" id="senator-selector-label">
              Select Senator
            </p>
            <select id="senator-selector" onChange={handleSenatorChange}>
              <option value="--">--</option>
              <option value="William Parker">William Parker</option>
            </select>
          </div>
          <div className="selector-wrapper" id="party-selector-wrapper">
            <p className="selector-label-text" id="party-selector-label">
              Select Political Party
            </p>
            <select id="party-selector" onChange={handlePartyChange}>
              <option value="--">--</option>
              <option value="D">Democrat</option>
              <option value="R">Republican</option>
              <option value="I">Independent</option>
            </select>
          </div>
          <div className="search-button-wrapper">
            <button id="search-button" onClick={handleClick}>
              Get Data
            </button>
          </div>
        </div>
        <div id="output-component">{outputComponent}</div>
      </div>
    </div>
  );
}

export default App;
