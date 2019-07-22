import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';
const axios = require('axios');
const selectOptions = require('./selectOptions');

const ibuSelectOptions = selectOptions.ibuSelectOptions;
const stateSelectOptions = selectOptions.stateSelectOptions;

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
  brewerySelectOptions = [];

  state = {
    ibuSelectedOption: null,
    stateSelectedOption: null,
    brewerySelectedOption: null,
    brewerySelectOptions: null
  };

  handleSelectedIbuChange = ibuSelectedOption => {
    this.setState({ ibuSelectedOption });
  };

  handleSelectedStateChange = stateSelectedOption => {
    this.setState({ stateSelectedOption });
  };

  handleSelectedBreweryChange = brewerySelectedOption => {
    this.setState({ brewerySelectedOption });
  };

  /**
   * Methods to communicate with the backend
   */
  getAllBreweriesFromServer = () => {
    return axios({
      method: "get",
      url: "http://localhost:8080/api/getAllBreweries/"
    })
  }

  getBreweriesByStateFromServer = () => {
    return axios({
      method: "post",
      url: "http://localhost:8080/api/getBreweriesByState/",
      data: { 
        statesToCheck: this.getSelectedStatesArray() 
      }
    })
  }

  getSelectedStatesArray = () => {
    var selectedStatesArray = [];
    if (this.state.stateSelectedOption) {
      for (var i=0; i < this.state.stateSelectedOption.length; i++) {
        selectedStatesArray.push(this.state.stateSelectedOption[i].value);
      }
    }
    return selectedStatesArray;
  };

  updateBrewerySelectOptions = (breweryData) => {
    var breweryOptions = []
    for (var i=0; i < breweryData.length; i++) {
      breweryOptions.push({ 
        value: breweryData[i].brewery_id,
        label: breweryData[i].name
      })
    }
    this.setState({ 
      brewerySelectOptions: breweryOptions
    });
  }

  /** 
   * Lifecycle methods 
   */
  componentDidMount() {
    this.getAllBreweriesFromServer()
      .then((response) => {
        this.updateBrewerySelectOptions(response.data);
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stateSelectedOption !== prevState.stateSelectedOption) {
      this.getBreweriesByStateFromServer()
        .then((response)=> {
          console.log(response);
          this.updateBrewerySelectOptions(response.data);
        })
    }
  }

  render() {
    const { 
      ibuSelectedOption, 
      stateSelectedOption, 
      brewerySelectedOption,
      brewerySelectOptions
    } = this.state;

    return (
      <div className="App" style={wrapperDivStyles}>
        <div style={selectContainerDivStyles}>
          <Select 
            className="ibuSelect"
            isMulti={true}
            value={ibuSelectedOption}
            onChange={this.handleSelectedIbuChange}
            options={ibuSelectOptions}
          />
        </div>
        <div style={selectContainerDivStyles}>
          <Select
            className="stateSelect"
            isMulti={true}            
            value={stateSelectedOption}
            onChange={this.handleSelectedStateChange}
            options={stateSelectOptions}
          />
        </div>
        <div style={selectContainerDivStyles}>
          <Select
            className="brewerySelect"
            isMulti={true}           
            value={brewerySelectedOption}
            onChange={this.handleSelectedBreweryChange}
            options={brewerySelectOptions}
          />
        </div>
      </div>
    );
  }
}

export default App;
