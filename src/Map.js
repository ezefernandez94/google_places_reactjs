import React, { Component } from 'react';

export default class Map extends Component {

    constructor( props ){
        super( props );
        this.state = {}
    }

    render() {
        //aca pueden ir otras cosas
        console.log(this.props.longitud)
        console.log(this.props.latitud)
        return(
            // aca va el html
            <div>Vacio pero esta es la latitud: {this.props.latitud} y esta es la longitud: {this.props.longitud}</div>
        );
    }

}