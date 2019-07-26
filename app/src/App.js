import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';
import Select from 'react-select';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './App.css';
const axios = require('axios');
const selectOptions = require('./selectOptions');
const ibuSelectOptions = selectOptions.ibuSelectOptions;
const stateSelectOptions = selectOptions.stateSelectOptions;

// Styles
const wrapperDivStyles = {
  display: "flex",
  padding: '15px',
  width: "80%",
  margin: "auto"
}

const selectContainerDivStyles = {
  flex: 1,
  paddingLeft: '10px',
  paddingRight: '10px'
}

const labelStyles = {
  display: 'block',
  textAlign: 'left'
}

const paperStyles = {
  margin: '20px'
}

const searchButtonContainerStyles = {
  width: '80%',
  margin: 'auto',
  paddingRight: '20px',
  paddingTop: '10px',
  paddingBottom: '10px'
}

const searchButtonStyles = {
  display: 'block',
  marginLeft: 'auto',
  marginRight: 0
}

const beerCardStyles = {
  minWidth: '100px',
  height: 'auto',
  margin: '15px'
}

const aboutStyles = {
  marginLeft: 'auto',
  marginRight: 0
}

class App extends Component {
  brewerySelectOptions = [];

  state = {
    ibuSelectedOption: null,
    stateSelectedOption: null,
    brewerySelectedOption: null,
    brewerySelectOptions: null,
    queryInProgress: false,
    isAboutPopoverOpen: false,
    beersReturnedFromQuery: null
  };

  /**
   * Globals
   */
  queryInProgress = false;

  /**
   * Event handlers
   */
  handleSelectedIbuChange = ibuSelectedOption => {
    this.setState({ ibuSelectedOption });
  };

  handleSelectedStateChange = stateSelectedOption => {
    this.setState({ stateSelectedOption });
  };

  handleSelectedBreweryChange = brewerySelectedOption => {
    this.setState({ brewerySelectedOption });
  };

  handleSearchButtonClick = () => {
    if (!this.state.brewerySelectedOption && !this.state.ibuSelectedOption && !this.state.stateSelectedOption) {
      alert("Please select at least one search criteria");
      return;
    }
    this.setState({ queryInProgress: true});
    this.getBeersFromServer()
      .then((response) => {
        return this.parseQueryForBeersResponse(response.data)
      })
      .then((newState) => {
        this.setState({
          beersReturnedFromQuery: newState,
          queryInProgress: false
        });
      })
  }

  handleAboutClick = () => {
    console.log(this.state.isAboutPopoverOpen);
    this.setState({
      isAboutPopoverOpen: !this.state.isAboutPopoverOpen
    })
  }

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
    if (!this.state.stateSelectedOption) {
      return this.getAllBreweriesFromServer();
    }
    return axios({
      method: "post",
      url: "http://localhost:8080/api/getBreweriesByState/",
      data: { 
        statesToCheck: this.getSelectedStatesArray() 
      }
    })
  }

  getBeersFromServer = () => {
    return axios({
      method: "post",
      url: "http://localhost:8080/api/getBeers",
      data: {
        abvLevels: this.getSelectedAbvLevelsArray(),
        states: this.getSelectedStatesArray(),
        breweries: this.getSelectedBreweriesArray()
      }
    })
  }

  /**
   * Miscellaneous helper methods
   */
  parseQueryForBeersResponse = (beersFromServer) => {
    return beersFromServer.map((beerFromServer) => {
      return {
        "beerId": beerFromServer.beer_id,
        "beerName": beerFromServer.beer_name,
        "breweryName": beerFromServer.brewery_name,
        "city": beerFromServer.city
      }
    })
  }

  getSelectedStatesArray = () => {
    if (this.state.stateSelectedOption) {
      return this.state.stateSelectedOption.map((option) => option.value)
    }
    return [];
  }

  getSelectedAbvLevelsArray = () => {
    if (this.state.ibuSelectedOption) {
      return this.state.ibuSelectedOption.map((option) => option.value)
    }
    return []
  }

  getSelectedBreweriesArray = () => {
    if (this.state.brewerySelectedOption) {
      return this.state.brewerySelectedOption.map((option) => option.value)
    }
    return []
  }

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

  getQueryResultTiles = () => {
      if (!this.state.beersReturnedFromQuery) return null;
      return this.state.beersReturnedFromQuery.map((beer) => {
        return <GridListTile cols={1} key={beer.beer_id}>
          <Card style={beerCardStyles}> 
                <CardContent className='BeerCardContent'>
                    <Typography variant='h5'>{beer.beerName}</Typography>
                    <Typography>{beer.breweryName}</Typography>
                    <Typography>{beer.city}</Typography>
                </CardContent>
            </Card>
        </GridListTile>
      })
  }

  getGridList = (gridListTileArray) => {
    if (!gridListTileArray) {
      return <div/>
    }  
    return gridListTileArray.length > 0 ? 
      <GridList cellHeight={'auto'} cols={3}>
        {gridListTileArray}
      </GridList> :
      <Typography variant='h5'>Sorry! I couldn't find beers meeting those criteria...</Typography>
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
      <div className="App">

        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Beer Recommendation Engine
            </Typography>
            <Typography 
              style={aboutStyles} 
              variant="h6" 
              color="inherit"
              onClick={this.handleAboutClick}>
              About </Typography>
            <Popover open={this.state.isAboutPopoverOpen}>
              <Typography> The about section </Typography>
            </Popover>
          </Toolbar>
        </AppBar>

        <Paper style={paperStyles}>
          <div style={wrapperDivStyles}>
            <div style={selectContainerDivStyles}>
              <label style={labelStyles}>IBU Level</label>
              <Select 
                className="ibuSelect"
                isMulti={true}
                value={ibuSelectedOption}
                onChange={this.handleSelectedIbuChange}
                options={ibuSelectOptions}
              />
            </div>
            <div style={selectContainerDivStyles}>
              <div>
                <label style={labelStyles}>State</label>
              </div>
              <div>
                <Select
                  className="stateSelect"
                  isMulti={true}            
                  value={stateSelectedOption}
                  onChange={this.handleSelectedStateChange}
                  options={stateSelectOptions}
                />
              </div>
            </div>
            <div style={selectContainerDivStyles}>
              <label style={labelStyles}>Brewery</label>
              <Select
                className="brewerySelect"
                isMulti={true}           
                value={brewerySelectedOption}
                onChange={this.handleSelectedBreweryChange}
                options={brewerySelectOptions}
              />
            </div>
          </div>
          <div style={searchButtonContainerStyles}>
            <Button 
              className="searchButton"
              variant="contained"
              color="primary"
              style={searchButtonStyles}
              onClick={this.handleSearchButtonClick}>Search</Button>
          </div>
        </Paper>

        <Paper style={paperStyles}>
          { 
            this.state.queryInProgress ? <CircularProgress size={100} disableShrink={true}/> :
              this.getGridList(this.getQueryResultTiles())
          }
        </Paper>
      </div>
    );
  }
}

export default App;
