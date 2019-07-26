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
const abvLevelSelectOptions = selectOptions.abvLevelSelectOptions;
const stateSelectOptions = selectOptions.stateSelectOptions;

// Styles
const styles = {
  wrapperDiv: {
    display: "flex",
    padding: '15px',
    width: "80%",
    margin: "auto"
  },
  selectContainerDiv: {
    flex: 1,
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  label: {
    display: 'block',
    textAlign: 'left'
  },
  paper: {
    margin: '20px'
  },
  searchButtonContainer: {
    width: '80%',
    margin: 'auto',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  searchButton: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 0
  },
  beerCard: {
    minWidth: '100px',
    height: 'auto',
    margin: '15px'
  },
  about: {
    marginLeft: 'auto',
    marginRight: 0
  }
}

class App extends Component {
  brewerySelectOptions = [];

  state = {
    abvLevelSelectedOption: null,
    stateSelectedOption: null,
    brewerySelectedOption: null,
    brewerySelectOptions: null,
    queryInProgress: false,
    popoverAnchorEl: null,
    beersReturnedFromQuery: null
  };

  /**
   * Event handlers
   */
  handleSelectedAbvLevelChange = abvLevelSelectedOption => {
    this.setState({ abvLevelSelectedOption });
  };

  handleSelectedStateChange = stateSelectedOption => {
    this.setState({ stateSelectedOption });
  };

  handleSelectedBreweryChange = brewerySelectedOption => {
    this.setState({ brewerySelectedOption });
  };

  handleSearchButtonClick = () => {
    if (!this.state.brewerySelectedOption && !this.state.abvLevelSelectedOption && !this.state.stateSelectedOption) {
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

  togglePopover = (event) => {
    this.setState({
      popoverAnchorEl: this.state.popoverAnchorEl ? null : event.target
    });
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
    return !this.state.stateSelectedOption ? [] : 
      this.state.stateSelectedOption.map((option) => option.value)
  }

  getSelectedAbvLevelsArray = () => {
    return !this.state.abvLevelSelectedOption ? [] : 
      this.state.abvLevelSelectedOption.map((option) => option.value)
  }

  getSelectedBreweriesArray = () => {
    return !this.state.brewerySelectedOption ? [] : 
      this.state.brewerySelectedOption.map((option) => option.value)
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
          <Card style={styles.beerCard}> 
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
          this.updateBrewerySelectOptions(response.data);
        })
    }
  }

  render() {

    const { 
      abvLevelSelectedOption, 
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
              style={styles.about} 
              variant="h6" 
              color="inherit"
              onClick={this.togglePopover}>
              About </Typography>
            <Popover 
              open={this.state.popoverAnchorEl ? true : false}
              anchorEl={this.state.popoverAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              onClose={this.togglePopover}>
              <Typography> The about section </Typography>
            </Popover>
          </Toolbar>
        </AppBar>

        <Paper style={styles.paper}>
          <div style={styles.wrapperDiv}>
            <div style={styles.selectContainerDiv}>
              <label style={styles.label}>ABV Level</label>
              <Select 
                className="abvSelect"
                isMulti={true}
                value={abvLevelSelectedOption}
                onChange={this.handleSelectedAbvLevelChange}
                options={abvLevelSelectOptions}
              />
            </div>
            <div style={styles.selectContainerDiv}>
              <div>
                <label style={styles.label}>State</label>
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
            <div style={styles.selectContainerDiv}>
              <label style={styles.label}>Brewery</label>
              <Select
                className="brewerySelect"
                isMulti={true}           
                value={brewerySelectedOption}
                onChange={this.handleSelectedBreweryChange}
                options={brewerySelectOptions}
              />
            </div>
          </div>
          <div style={styles.searchButtonContainer}>
            <Button 
              className="searchButton"
              variant="contained"
              color="primary"
              style={styles.searchButton}
              onClick={this.handleSearchButtonClick}>Search</Button>
          </div>
        </Paper>

        <Paper style={styles.paper}>
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
