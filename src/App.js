import React, { Component } from 'react';
import ReactList from 'react-list';
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import logo from './logo.svg';
import './App.css';

const apiKey = "AIzaSyDVvC4VGoi6XXBTrPHuBpJ7FYb_xoGvXTk";

const SearchBoxExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    {props.markers.map((marker, index) => (
      <Marker position={marker.position} key={index} />
    ))}
  </GoogleMap>
));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentCEP:"",
      bounds: null,
      center: {
        lat: -23.5592668,
        lng: -46.7364076,
      },
      markers: [],
      places: [
        {
          name: "Oficina A"
        },
        {
          name: "Oficina B"
        },
        {name: "Oficina C"},{name: "Oficina D"},{name: "Oficina E"},{name: "Oficina F"},{name: "Oficina G"},
        {name: "Oficina H"},{name: "Oficina I"},{name: "Oficina J"},{name: "Oficina K"},{name: "Oficina L"},
        {name: "Oficina M"},{name: "Oficina N"},{name: "Oficina O"},{name: "Oficina P"},{name: "Oficina Q"},
        {name: "Oficina R"},{name: "Oficina S"},{name: "Oficina T"},{name: "Oficina U"},{name: "Oficina V"},
        {name: "Oficina W"},{name: "Oficina X"},{name: "Oficina Y"},{name: "Oficina Z"},{name: "Oficina 1"},
        {name: "Oficina 2"},{name: "Oficina 3"},{name: "Oficina 4"},{name: "Oficina 5"},{name: "Oficina 6"},
        {name: "Oficina 7"},{name: "Oficina 8"},{name: "Oficina 9"}
      ]
    };
  }

  renderItem(index, key, that) {
    return <div key={key} style={{backgroundColor: (key%2==0?'#fff':'#ddd')}}>{that.state.places[index].name}</div>;
  }

  componentWillMount() {
    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.
    // var pyrmont = new window.google.maps.LatLng(-33.8665, 151.1956);

    // var map = new window.google.maps.Map(document.getElementById('placesMap'), {
    //   center: pyrmont,
    //   zoom: 15,
    //   scrollwheel: false
    // });
    // var infowindow = new window.google.maps.InfoWindow();
    // var service = new window.google.maps.places.PlacesService(map);
  }

  requestNearbyServices(pLat,pLng) {
    
    var baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    var requestUrl = baseUrl
      + "?key=" + apiKey
      + "&location=" + pLat + "," + pLng
      + "&radius=1000"
      + "&rankBy=distance"
      + "&type=car_repair";

    console.log(requestUrl);

    var that = this;
    fetch(requestUrl) 
      .then(response => response.json()
        .then(data => ({
          data: data,
          status: response.status
        }))
        .then(res => {
          that.setState({ places: res.data.results });
        })
      );
  }

  onSubmitCEP() {
    var that = this;
    fetch("https://maps.google.com/maps/api/geocode/json?address=" + this.state.currentCEP) 
      .then(response => response.json()
        .then(data => ({
          data: data,
          status: response.status
        }))
        .then(res => {
          var myLocation = res.data.results[0].geometry.location;
          var myLat = myLocation.lat;
          var myLng = myLocation.lng;

          that.setState({ center: { lat: myLat, lng: myLng }});
          that.requestNearbyServices(myLat,myLng);
        })
      );
  }

  handleCurrentCEPChange(event,pthis) {
    pthis.setState({ currentCEP: event.target.value });
  }

  handleMapMounted = this.handleMapMounted.bind(this);
  handleBoundsChanged = this.handleBoundsChanged.bind(this);
  handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
  handlePlacesChanged = this.handlePlacesChanged.bind(this);

  handleBoundsChanged() {
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
    });
  }

  handleMapMounted(map) {
    this._map = map;
  }

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
  }

  handlePlacesChanged() {
    const places = this._searchBox.getPlaces();

    // Add a marker for each place returned from search bar
    const markers = places.map(place => ({
      position: place.geometry.location,
    }));

    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;

    this.setState({
      center: mapCenter,
      markers,
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Simplificaa - Serviços Automotivos</h2>
        </div>
        <p className="App-intro">
          Para iniciar, preencha o campo abaixo com o <code>CEP</code> ou <code>endereço</code> desejado.
        </p>
        <div className="App-getAddress">
          <input type="text" value={this.state.currentCEP} placeholder="Digite seu CEP/endereço aqui!" style={{width: '70%', textAlign: 'center'}} onChange={(event) => this.handleCurrentCEPChange(event,this)} />
          <br/><br/>
          <input id="submitCEP" type="submit" onClick={()=>this.onSubmitCEP()} value="Buscar oficinas!" />
        </div>
        <div className="App-searchResults">
          <div id="maps" className="App-placesMap">
            <SearchBoxExampleGoogleMap
              containerElement={
                <div style={{ height: `100%` }} />
              }
              mapElement={
                <div style={{ height: `100%` }} />
              }
              center={this.state.center}
              onMapMounted={this.handleMapMounted}
              onBoundsChanged={this.handleBoundsChanged}
              onSearchBoxMounted={this.handleSearchBoxMounted}
              bounds={this.state.bounds}
              onPlacesChanged={this.handlePlacesChanged}
              markers={this.state.markers}
      />
          </div>
          <div className="App-placesList" style={{overflow: 'auto'}}>
            <div  className="App-listTitle">LISTA DE OFICINAS NAS PROXIMIDADES:</div>
            <ReactList 
              length={this.state.places.length}
              itemRenderer={(index, key) => this.renderItem(index,key,this)}
              type='uniform' />
          </div>
        </div>
      </div>
    );
  }
}

export default App;