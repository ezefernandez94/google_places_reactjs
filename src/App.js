/* global google */

import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './App.css';
import Place from './Place';
import Horario from './Horario';
import Rating from './Rating';
import Dropdown from './DropdownMenu';
import Map from './Map';
//import NearbyPlaces from './NearbyPlaces';

class App extends Component {

  constructor( props ){
    super( props );
    this.state = { photo:'',
                  newMap:'',
                  listaTransportes: [{id: 0,
                                      title:'Caminando',
                                      value: 'WALKING',
                                      selected: true,
                                      key: 'transporte'
                                      },
                                      {id: 1,
                                      title:'Auto', 
                                      value: 'DRIVING',
                                      selected: false,
                                      key: 'transporte'
                                      },
                                      {id: 2,
                                      title:'Bicicleta',
                                      value: 'BICYCLING', 
                                      selected: false,
                                      key: 'transporte'
                                      },
                                      {id: 3,
                                      title:'Transporte Público', 
                                      value: 'TRANSIT',
                                      selected: false,
                                      key: 'transporte'
                                    }],
                  transporteElegido:''
    }
  }

  map=''

  componentDidMount(){
    var latitud = 4;
    var longitud = -74;
    
    navigator.geolocation.getCurrentPosition(function(position) {
      latitud = position.coords.latitude
      longitud = position.coords.longitude
    }, function(error){
      latitud = 4
      longitud = -74
    });
    
    const googlePlaceAPILoad = setInterval(() => {
      if (window.google){
        
        this.google=window.google;
        clearInterval(googlePlaceAPILoad);
        this.state.newMap = <Map latitud={latitud} longitud = {longitud} />
                
        const mapCenter = new this.google.maps.LatLng(latitud,longitud);
        this.map = new this.google.maps.Map(document.getElementById('gmapContainer'), {
          center: mapCenter,
          zoom: 15
        });
        //this.state.directionsRenderer.setMap(this.map);
        var marcador = new this.google.maps.Marker({position:mapCenter, map:this.map})
        this.showMap(mapCenter);
        
      };
    },100);
  }
  
  showMap(mapCenter) {
    //var map = new window.google.maps.Map(document.getElementById('map'), {zoom: 15, center: mapCenter});
    //var marker = new window.google.maps.Marker({position: mapCenter, map: map});
    if( this.props.origin && this.props.destiny ){
      console.log('entre')
      console.log( this.props.origin )
      let directionsService = new google.maps.DirectionsService();
      let directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map); // Existing map object displays directions
      // Create route from existing points used for markers
      const route = {
        origin: this.props.origin,
        destination: this.props.destiny,
        travelMode: 'DRIVING'
      }

      directionsService.route(route, function(response, status) { 
        // anonymous function to capture directions
        if (status !== 'OK') {
          window.alert('Directions request failed due to ' + status);
          return;
        } else {
          directionsRenderer.setDirections(response); // Add route to the map
        }
      });
    } else {
      const directionsService = new this.google.maps.DirectionsService()
      const directionsDisplay = new this.google.maps.DirectionsRenderer()

      //directionsService.setMap(map)

      mapCenter = new this.google.maps.LatLng( this.props.latitud, this.props.longitud );
      var map = new this.google.maps.Map(document.getElementById('map'), {
          center: mapCenter,
          zoom: 15 
      });
      var marker = new window.google.maps.Marker({position: mapCenter, map: map});
    }
  }

  manejoOnClick = (e) => {
    //alert(document.getElementById('origen').value);
    const request = {
      query: document.getElementById('origen').value ,
      fields: ['photos', 'formatted_address', 'geometry', 'name','place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map);
    //alert( request['fields'] )
    this.service.findPlaceFromQuery(request, this.findPlaceResult);
  }

  findPlaceResult = (results, status) => {
    var placesTemp=[]
    var placeId = ''
    if (status ===  'OK') {
      results.map((place) => {
        var placePhotos=['']
        const placeTemp = {id:place.place_id, name:place.name, geometry:place.geometry.location,
          address:place.formatted_address,photos:placePhotos}
          placeId = place.place_id;
        placesTemp.push(<Place placeData={placeTemp}/>);
      })
    }
    if (placesTemp.length>0)
      this.findPlaceDetail(placeId);
    else{
      const placeTemp = {id:'N/A', name:<div className='mt-5'><strong className='text-center'>
          No hay resultados</strong></div>,
        address:'',photos:['']}
      placesTemp.push(<Place placeData={placeTemp}/>);
      this.setState({places:placesTemp})
    }
  }

  findPlaceDetail = (placeIdFound) => {
    var request = {
      placeId: placeIdFound,
      fields: ['address_component', 'adr_address', 'alt_id', 'formatted_address',
       'icon', 'id', 'name', 'business_status', 'photo', 'place_id', 'plus_code', 'scope', 
       'type', 'url', 'utc_offset_minutes', 'vicinity','geometry','rating','reviews','opening_hours']
    };
    this.service.getDetails(request, this.foundPlaceDatail);
  }

  manejoOnClickLugares = (e) => {
    if (e.target.id==='btnLugares')
      this.setState((prevState) => {
        return {mostrarLugares: !prevState.mostrarLugares}
      })
  }

  foundPlaceDatail = (place, status) => {
    if (status === 'OK'){
      var placePhotos=['']
      if (place.photos){
        place.photos.map((placePhoto, index) => {
          placePhotos[index]=placePhoto.getUrl({'maxWidth': 160, 'maxHeight': 120})
          if (index === 2) return;
        })
      }
      const maxPhotos = 6
      const maxPhotosRow = 3
      const placeSize = 12
      const placeTemp = {id:place.place_id, name:place.name, geometry:place.geometry.location, size:placeSize,
        address:place.formatted_address,photos:placePhotos, photosMax: maxPhotos, photosMaxRow: maxPhotosRow}
      const placesTemp = <Place placeData={placeTemp} placeDetail = {'full'}/>;
      const placeHorarios = <Horario horarios={place.opening_hours}/>
      var rating=''
      if (place.rating){
        rating = <Rating placeRating={place.rating} placeReviews={place.reviews} placeDetail = {'full'} placeId = {place.place_id}/>
      }
      else{
        rating = <div key={1} className='row mt-2 mb-1 pl-3' >
                  <strong>No hay comentarios</strong>
                 </div>;
      }
      //console.log('address_component: '+ place.address_component, 
      //'adr_address: '+place.adr_address, 'alt_id', 'formatted_address', 'geometry: '+place.geometry,
      //'icon: '+place.icon, 'permanently_closed', 'photo',' rating: '+place.rating,
      //'type: '+place.type, 'url: '+place.url, 'utc_offset', 'vicinity')
      this.setState({places:placesTemp,
                     placeRating:rating,
                     placeHorarios:placeHorarios})
      //this.showMap(place.geometry.location);
    }
  }

  resetThenSet = (id, key) => {
    const temp = this.state.listaTransportes;
    //console.log(id)
    //console.log(key)
  
    temp.forEach((item) => item.selected = false);
    temp[id].selected = true;
  
    this.setState({
      transporteElegido: temp[id].value
    });


  }

  FindNearPlacesOnClick = (e) => {
    //console.log(this.state.places.props.placeData.geometry);
    const request = {
      //query: document.getElementById('origen').value ,
      location: this.state.places.props.placeData.geometry,
      radius: '500',
      query: 'restaurant'
      //fields: ['photos', 'formatted_address', 'name','place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(request, this.cargarResultados);
  }

  cargarResultados = ( results, status ) => {
    //alert('llego algo!');
    console.log(results);
    if( status === 'OK' ){
      var htmlPrimeraParte = [];
      var htmlSegundaParte = [];
      var htmlCompletoNearbyPlaces = [];
      var htmlCompletoTemporal = [];
      var placesRow = 3;
      var contadorRows = 1;
      const placeSize = 4;
      var maxDesplegadas = 9;
      results.map((nearbyPlaceArrayElement, index) => {
        //if( index < ( contadorRows * placesRow ) ){
          var placePhotos = ['']
          if(nearbyPlaceArrayElement.photos){
            nearbyPlaceArrayElement.photos.map((placePhoto, index) => {
              placePhotos[index] = placePhoto.getUrl({'maxWidth': 160, 'maxHeight':120})
              if(index === 2) return;
            })
          }
          const nearbyPlace = {id: nearbyPlaceArrayElement.place_id,
                               name:nearbyPlaceArrayElement.name, 
                               address: nearbyPlaceArrayElement.vicinity,
                               photosMax: 1,
                               photosMaxRow: 1,
                               photos: placePhotos,
                               size: placeSize
                              };
          const nearbyPlaces = <Place placeData = {nearbyPlace} placeDetail = {'simple'} funcionCallback = {this.handleCallback} />;
          var ratingNearbyPlaces = ''
          if( nearbyPlaceArrayElement.rating ){
            ratingNearbyPlaces = <Rating placeRating = {nearbyPlaceArrayElement.rating} placeDetail = {'simple'} placeId = {nearbyPlaceArrayElement.place_id} />
          }
          if( index < maxDesplegadas ){
            //htmlCompletoTemporal.push(nearbyPlaces);
            //htmlCompletoTemporal.push(ratingNearbyPlaces);
            htmlPrimeraParte.push(nearbyPlaces);
            htmlPrimeraParte.push(ratingNearbyPlaces);
            //contadorRows = contadorRows + 1;
            htmlCompletoTemporal = []
          } else {
            //if( index === results.length ){
              //htmlCompletoTemporal.push(nearbyPlaces);
              //htmlCompletoTemporal.push(ratingNearbyPlaces);
              htmlSegundaParte.push(nearbyPlaces);
              htmlSegundaParte.push(ratingNearbyPlaces);
            //} else {
            //  htmlCompletoTemporal.push(nearbyPlaces);
            //  htmlCompletoTemporal.push(ratingNearbyPlacess);
            //}
          }
        //}  
        
      })
      
      const listaTransportes = <Dropdown title="Seleccione el Medio de Transporte" list={this.state.listaTransportes} resetThenSet={this.resetThenSet} />
      this.setState((prevState) => {
        return {mostrarDirecciones: !prevState.mostrarDirecciones}
      })
      this.setState({
        nearbyPlacesPrimeraParte: htmlPrimeraParte,
        nearbyPlacesSegundaParte: htmlSegundaParte,
        lista: listaTransportes
        //nearbyPlacesRating: ratingNearbyPlaces
      })
    }
  }

  handleCallback = (childData) => {
    //alert(childData);
    document.getElementById('origen').value = childData;
    this.state.nearbyPlacesPrimeraParte = ''
    this.state.nearbyPlacesSegundaParte = ''
    this.manejoOnClick()
  }
  
  FindRoutesOnClick = (e) => {
    var start = document.getElementById('origenDirecciones').value;
    var end = document.getElementById('destinoDirecciones').value;
    var request = {
      origin: start,
      destination: end,
      travelMode: this.state.transporteElegido
    };
    
    this.state.directionsService.route(request, function(result, status) {
      if (this.state.directionsRenderer.getMap() == null){
        this.state.directionsRenderer.setMap(this.map);
      }
      if (status == 'OK') {
        this.state.directionsRenderer.setDirections(result);
      }
    });

  }
  
  
  render(){
    const btnName = this.state.mostrarLugares ? 'Ocultar Más Lugares' : 'Mostrar Más Lugares';
    const mostrar = this.state.mostrarLugares ? 'd-block' : 'd-none'
    const mostrarDirecciones = this.state.mostrarDirecciones ? 'd-block' : 'd-none'
    
    return (
      
      <div className="App" >
        <div className='container border rounded p-3 mt-4' style={{width:'50%'}}>
          <div className='row'>
            <div className='col-4'></div>
            <div className='col-4 text-center'>
              
              <label><strong>Indica el lugar</strong></label>
            </div>
            <div className='col-4'></div>
          </div>
          <div className='row'>
            <div className='col-4'></div>
            <div className='col-4 py-2'><input id='origen' type='text'/></div>
            <div className='col-4'></div>
          </div>
          <div className='row'>
            <div className='col-4'></div>
            <div className='col-4 text-center'>
              <div className='btn btn-primary text-center' onClick={this.manejoOnClick}>Buscar Lugar</div>
            </div>
            <div className='col-4'></div>
          </div>
          {this.state.places}
          {this.state.placeHorarios}
          {this.state.placeRating}
          <div>
            <div className='btn btn-primary text-center' onClick={this.FindNearPlacesOnClick}>Buscar Lugares Cercanos</div>
          </div>
          <div>
            {this.state.nearbyPlacesPrimeraParte}
            <div className={'container '+mostrar}>
              {this.state.nearbyPlacesSegundaParte}
            </div>
            <div className='mb-3 '><a href='#' id='btnLugares' onClick={this.manejoOnClickLugares}>{btnName}</a></div>
          </div>
          <div>
            {this.state.lista}
          </div>
          <div className={'row '+mostrarDirecciones} id='direcciones'>
            <div className='col-4'><input id='origenDirecciones' type='text'/></div>
            <div className='col-4 py-2'><input id='destinoDirecciones' type='text'/></div>
            <div className='col-4'><div className='btn btn-primary text-center' id='recorrido' onClick={this.FindRoutesOnClick}>Buscar Recorrido</div></div>
          </div>
          <div id='map' className='mt-2' ></div>
        </div>
      </div>
      
    );
  
  }
}

export default App;
