import "./App.css";
import Axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [usState, setUsState] = useState("");
  const [senatorData, setSenatorData] = useState([]);

  const handleClick = (event) => {
    event.preventDefault();
    getSenatorByState();
    //console.log("handleClick with: " + usState);
  };

  const handleChange = (event) => {
    setUsState(event.target.value);
    //console.log("value is: " + event.target.value);
  };

  const getSenatorByState = () => {
    //console.log(usState);
    Axios.get("http://localhost:3001/api/get/" + usState).then((response) => {
      //console.log(response.data[0]);
      setSenatorData(response.data[0]);
    });
  };

  /*
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      console.log(response.data);
    });
  }, []);
  */

  return (
    <div className="App">
      <div className="header" id="main-header">
        <div id="main-headers">
          <h1 id="main-title">How Did They Vote?</h1>
          <h1 id="data-source-title">Where Does This Information Come From?</h1>
        </div>
        <div id="secondary-headers">
          <h2 id="secondary-title">
            See how your elected officials are voting - fast and easy.
          </h2>
          <h2 id="data-source-explanation">
            The voting data presented by this page are publicly available and
            can be found at{" "}
            <a id="congress-gov-link" href="https://www.congress.gov/">
              congress.gov
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
      <div id="selection-criteria-wrapper">
        <div className="selector-wrapper" id="state-selector-wrapper">
          <p id="state-selector-label">Select State</p>
          <select id="state-selector" onChange={handleChange}>
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
        <div className="selector-wrapper" id="issue-selector-wrapper">
          <p id="issue-selector-label">Select Issue or Enter Custom</p>
          <input type="text" list="issue-list" />
          <datalist id="issue-list">
            <option>Abortion</option>
            <option>Gun Control</option>
            <option>Climate Change</option>
            <option>War in Ukraine</option>
            <option>January 6th, 2021</option>
            <option>Education</option>
            <option>LGBTQ Rights</option>
            <option>Immigration</option>
          </datalist>
        </div>
      </div>
      <div className="search-button-wrapper">
        <button id="search-button" onClick={handleClick}>
          Get Data
        </button>
      </div>
      <div id="output-window">
        <p id="output-text">
          Senator {senatorData.SEN_FIRST_NAME} {senatorData.SEN_LAST_NAME} of{" "}
          {senatorData.STATE} is cool.
        </p>
      </div>
    </div>
  );
}

export default App;
