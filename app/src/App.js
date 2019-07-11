import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';

// Options:
//  TODO: These should come from the database
const ibuSelectOptions = [
  { value: 'low', label: 'Low' },
  { value: 'med', label: 'Medium' },
  { value: 'high', label: 'High'}
];

const stateSelectOptions = [
  { value: "SC", label: "South Carolina" },
  { value: "NC", label: "North Carolina" },
  { value: "WI", label: "Wisconsin" },
  { value: "CA", label: "California" }
]

// Styles
const wrapperDivStyles = {
  display: "flex",
  width: "80%",
  margin: "auto"
}

const selectContainerDivStyles = {
  flex: 1
}

class App extends Component {
  state = {
    ibuSelectedOption: null,
    stateSelectedOption: null
  };

  handleIbuChange = ibuSelectedOption => {
    this.setState({ ibuSelectedOption });
  };

  handleStateChange = stateSelectedOption => {
    this.setState({ stateSelectedOption });
  };

  render() {
    const { ibuSelectedOption, stateSelectedOption } = this.state;

    return (
      <div className="App" style={wrapperDivStyles}>
        <div style={selectContainerDivStyles}>
          <Select 
            className="ibuSelect"
            value={ibuSelectedOption}
            onChange={this.handleIbuChange}
            options={ibuSelectOptions}
          />
        </div>
        <div style={selectContainerDivStyles}>
          <Select
            className="stateSelect"
            value={stateSelectedOption}
            onChange={this.handleStateChange}
            options={stateSelectOptions}
          />
        </div>
      </div>
    );
  }
}

export default App;
