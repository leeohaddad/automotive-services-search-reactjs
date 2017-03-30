import React, { Component } from 'react';
import ReactList from 'react-list';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentCEP:"",
      bounds: null,
      initialLocation: {
        lat: -23.5592668,
        lng: -46.7364076,
      },
      map: null,
      markers: [],
      places: [],
      placesByDistance: [],
      placesByRating: [],
      radius: 2000,
      service: null
    };
  }

  componentDidMount() {
    var pMap = new window.google.maps.Map(document.getElementById('map'), {
      center: this.state.initialLocation,
      zoom: 15
    });
    this.setState({ map: pMap });
  }

  requestNearbyServices(pLat,pLng) {
    var that = this;
    var myLocation = new window.google.maps.LatLng(pLat,pLng);
    if (this.state.map == null) {
      var pMap = new window.google.maps.Map(document.getElementById('map'), {
        center: myLocation,
        zoom: 15
      });
      this.setState({ map: pMap });
    }
    else {
      this.state.map.setCenter(myLocation);
      this.state.map.setZoom(15);
    }
    var request = {
      location: myLocation,
      radius: that.state.radius,
      types: ['car_repair']
    };
    if (this.state.service == null) {
      var pService = new window.google.maps.places.PlacesService(this.state.map);
      this.setState({ service: pService });
    }
    this.state.service.nearbySearch(request, (results, status) => this.onNearbySearchResults(results,status,this));
  }

  onNearbySearchResults(results, status) {
    var i;
    this.setState({ places: [] });
    this.setState({ placesByDistance: [] });
    this.setState({ placesByRating: [] });
    for (i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].setMap(null);
    }
    this.setState({ markers: [] });
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      for (i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
      this.setState({ places: results });
      this.setState({ placesByDistance: results.slice() });
    }
  }

  buildMarkerText(markerDetails) {
    var returnValue = "Nome: " + markerDetails.name + "\n";
    if (markerDetails.rating != null)
      returnValue += "Avaliação: " + markerDetails.rating + "\n";
    if (markerDetails.opening_hours != null)
      returnValue += "Aberto agora: " + (markerDetails.opening_hours.open_now ? "Sim" : "Não") + "\n";
    if (markerDetails.vicinity != null)
      returnValue += "Localização: " + markerDetails.vicinity + "\n";
    return returnValue;
  }

  sortPlacesListByRating() {
    if (this.state.placesByRating.length > 0) {
      this.setState({ places: this.state.placesByRating });
      return;
    }
    var res = this.state.places.slice();
    res.sort(function (a, b) {
      if (a.rating == null)
        return 1;
      if (b.rating == null)
        return -1;
      return b.rating - a.rating;
    });
    this.setState({ places: res });
    this.setState({ placesByRating: res });
  }

  sortPlacesListByDistance() {
    this.setState({ places: [] });
    this.setState({ places: this.state.placesByDistance });
  }

  createMarker(markerDetails) {
    var that = this;
    var marker = new window.google.maps.Marker({
      position: markerDetails.geometry.location,
      map: that.state.map,
      label: markerDetails.name,
      title: that.buildMarkerText(markerDetails)
    });
    marker.addListener('click', function() {
      alert(marker.title);
    });
    this.state.markers.push(marker);
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

  handleRadiusChange(event,pthis) {
    pthis.setState({ radius: event.target.value });
  }

  handleMapMounted = this.handleMapMounted.bind(this);
  handleBoundsChanged = this.handleBoundsChanged.bind(this);
  handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
  handlePlacesChanged = this.handlePlacesChanged.bind(this);

  handleMapMounted(pMap) {
    this._map = pMap;
    this.setState({ map: pMap });
  }

  handleBoundsChanged() {
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
    });
  }

  handleSearchBoxMounted(pSearchBox) {
    this._searchBox = pSearchBox;
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

  handleKeyPress(target) {
    if (target.charCode===13) {
      this.onSubmitCEP();    
    }
  }

  renderPlaceName(place, index) {
    if (place.name == null)
      return '';
    else
      return (
        <h3>
          Nome: {place.name}
        </h3>
      );
  }

  renderPlaceRating(place, index) {
    if (place.rating == null)
      return '';
    else
      return (
        <p>
          Avaliação: {place.rating}
        </p>
      );
  }

  renderPlaceOpening(place, index) {
    if (place.opening_hours == null)
      return '';
    else
      return (
        <p>
          {(place.opening_hours.open_now ? "Aberto Agora" : "Fechado Agora")}
        </p>
      );
  }

  renderPlaceVicinity(place, index) {
    if (place.vicinity == null || place.vicinity==='')
      return '';
    else
      return (
        <p>
          Localização: {place.vicinity}
        </p>
      );
  }

  zoomInMap (thisPlace) {
    this.state.map.setZoom((this.state.map.getZoom() < 20 ? 20 : this.state.map.getZoom()));
    this.state.map.setCenter(thisPlace.geometry.location);
  }

  renderListItemComponent(index, key) {
    var places = this.state.places.slice();
    var thisPlace = places[index];
    var name = this.renderPlaceName(thisPlace, index);
    if (name === '')
      return '';
    var rating = this.renderPlaceRating(thisPlace, index);
    var opening = this.renderPlaceOpening(thisPlace, index);
    var vicinity = this.renderPlaceVicinity(thisPlace, index);
    return (
      <div key={key} >
        <div style={{backgroundColor: '#000'}}><br/></div>
        <div style={{verticalAlign: 'middle'}}>
          <div style={{width:'90%', margin: '0 auto'}}>
            <br/>
            {name}
            {rating}
            {opening}
            {vicinity}
            <div>
              <input type="submit" onClick={()=>this.zoomInMap(thisPlace)} value="VER NO MAPA" />
            </div>
            <br/>
          </div>
        </div>
      </div>
    );
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
          <input type="text" value={this.state.currentCEP} placeholder="Digite seu CEP/endereço aqui!" style={{width: '70%', textAlign: 'center'}} onChange={(event) => this.handleCurrentCEPChange(event,this)} onKeyPress={(target) => this.handleKeyPress(target)} />
          <br/><br/>
          Raio de busca (em metros): <input type="text" value={this.state.radius} placeholder="Raio" style={{width: '10%', textAlign: 'center'}} onChange={(event) => this.handleRadiusChange(event,this)} onKeyPress={(target) => this.handleKeyPress(target)} />
          <br/><br/>
          <input id="submitCEP" type="submit" onClick={()=>this.onSubmitCEP()} value="BUSCAR OFICINAS" />
        </div>
        <div className="App-searchResults">
          <div id="map" className="App-placesMap">
          </div>
          <div className="App-placesList" style={{overflow: 'auto'}}>
            <div className="App-listTitle">
              LISTA DE OFICINAS NAS PROXIMIDADES
            </div>
            <div className="App-listTitle">
              <input id="sortByRating" type="submit" onClick={()=>this.sortPlacesListByRating()} value="Ordenar por avaliações!" />
              <p></p>
              <input id="sortByDistance" type="submit" onClick={()=>this.sortPlacesListByDistance()} value="Ordenar por distância!" />
            </div>
            <ReactList 
              length={this.state.places.length}
              itemRenderer={(index, key) => this.renderListItemComponent(index,key,this)}
              type='variable' />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
