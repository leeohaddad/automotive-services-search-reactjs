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
      service: null
    };
  }

  renderItem(index, key, that) {
    return <div key={key} style={{backgroundColor: (key%2===0?'#fff':'#ddd')}}>{that.state.places[index].name}</div>;
  }

  componentDidMount() {
    var pMap = new window.google.maps.Map(document.getElementById('map'), {
      center: this.state.initialLocation,
      zoom: 15
    });
    this.setState({ map: pMap });
  }

  requestNearbyServices(pLat,pLng) {
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
      radius: '2000',
      types: ['car_repair']
    };
    if (this.state.service == null) {
      var pService = new window.google.maps.places.PlacesService(this.state.map);
      this.setState({ service: pService });
    } 
    this.state.service.nearbySearch(request, (results, status) => this.onNearbySearchResults(results,status,this));
  }

  onNearbySearchResults(results, status, that) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      this.setState({ markers: [] });
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
      console.log(results);
      that.setState({ places: results });
    }
  }

  buildMarkerText(markerDetails) {
    var returnValue = "Nome: " + markerDetails.name + "\n";
    if (markerDetails.opening_hours != null)
      returnValue += "Aberto agora: " + (markerDetails.opening_hours.open_now ? "Sim" : "Não") + "\n";
    if (markerDetails.vicinity != null)
      returnValue += "Localização: " + markerDetails.vicinity + "\n";
    return returnValue;
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
      that.state.map.setZoom((that.state.map.getZoom() < 20 ? 20 : that.state.map.getZoom()));
      that.state.map.setCenter(marker.getPosition());
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
          <input id="submitCEP" type="submit" onClick={()=>this.onSubmitCEP()} value="Buscar oficinas!" />
        </div>
        <div className="App-searchResults">
          <div id="map" className="App-placesMap">
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
