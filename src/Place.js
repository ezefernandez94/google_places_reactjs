import React, { Component } from 'react'

export default class Place extends Component {

  manejoOnClickPlace = (e) => {
    //console.log(e.target.id)
    this.props.funcionCallback(e.target.id);
    e.preventDefault();

  }

  render() {
    var cantPhotos = this.props.placeData.photos.length;
    var maxPhotos = this.props.placeData.photosMax;
    var maxPhotosRow = this.props.placeData.photosMaxRow;
    if (cantPhotos > maxPhotos)
      cantPhotos = maxPhotos;
    else
      cantPhotos = maxPhotosRow;
    const colSize = Math.floor(12 / maxPhotosRow);
    var cantidadFilas = maxPhotos / maxPhotosRow;
    var htmlPhotos=[];
    var contadorFilas= 1;
    var htmlCompleto = [];
    this.props.placeData.photos.map((photo, index) => {
      if( index < ( contadorFilas * maxPhotosRow ) ){
        htmlPhotos.push(
          <div key={index} className={'col-'+colSize+' text-center'} >
            <img src={photo} alt={this.props.placeData.name}/>
          </div>);
        if( index === ( ( contadorFilas * maxPhotosRow ) - 1 ) ){
          htmlCompleto.push(
            <div className='row py-2'>
              {htmlPhotos} 
            </div>
          );
          htmlPhotos = [];
          if( contadorFilas === cantidadFilas ){
            return;
          } else {
            contadorFilas = contadorFilas + 1;
          }
        }
      }
      
    })
    if(this.props.placeDetail == 'full' ){
      return (
        <div>
          <div className='row py-2'>
            <div className='col-12 text-center' >{this.props.placeData.name}</div>
          </div>
          {htmlCompleto}
          <div className='row' >
            <div className='col-2'></div>
            <div className='col-8'> {this.props.placeData.address}</div>
            <div className='col-2'></div>
          </div>
        </div>
      )
    } else if(this.props.placeDetail == 'simple' ){
      return (
        <div>
          <div className='row py-2'>
            <div className='col-12 text-center' ><a href='#' id={this.props.placeData.name} onClick={this.manejoOnClickPlace}>{this.props.placeData.name}</a></div>
          </div>
          {htmlCompleto}
          <div className='row' >
            <div className='col-2'></div>
            <div className='col-8'> {this.props.placeData.address}</div>
            <div className='col-2'></div>
          </div>
        </div>
      )
    }
  }
}
