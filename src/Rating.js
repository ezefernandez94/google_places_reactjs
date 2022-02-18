import React, { Component } from 'react'
import '../node_modules/font-awesome/css/font-awesome.css'

export default class Rating extends Component {
  constructor(props){
    super(props);
    this.state={mostrarComentarios:this.props.mostrarComentarios};
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius,color) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath();
    ctx.lineWidth=2;
    ctx.strokeStyle='blue';
    ctx.stroke();
    ctx.fillStyle=color;
    ctx.fill();
  }
    
  componentDidMount(){
    if( this.props.placeDetail == 'full' ){
      var canvas = document.getElementById("canvas");
      //var idTemporal = this.props.placeId;
      //console.log(idTemporal);
      //var canvas = document.getElementById(idTemporal);
      //console.log(canvas);
      var ctx = canvas.getContext("2d");
      //console.log(ctx)
      const initx=15;
      const stepPos = 30;
      const completeStar = Math.floor(this.props.placeRating);
      //console.log(completeStar);
      const partialStar = (this.props.placeRating - completeStar).toFixed(1);
      //console.log(partialStar);
      for (let index = 0; index < completeStar; index++) {
          this.drawStar(ctx, initx+(stepPos*index), 12, 5, 10, 4.5,'skyblue');
      }
      const partialFill=this.props.placeRating-completeStar
      if (partialFill>0){
        var gradient = ctx.createLinearGradient(125.48943483704846,2,144.51056516295154,2);
        gradient.addColorStop(0, 'skyblue');
        gradient.addColorStop(partialStar, 'skyblue');
        gradient.addColorStop(partialStar, 'white');
        gradient.addColorStop(1, 'white');
        this.drawStar(ctx, initx+(stepPos*completeStar), 12, 5, 10, 4.5,gradient);
      }
    }
  }

  manejoOnClick = (e) => {
    if (e.target.id==='btnComentarios')
      this.setState((prevState) => {
        return {mostrarComentarios: !prevState.mostrarComentarios}
      })
  }

  render() {
    const startRating = []
    const completeStar = Math.floor(this.props.placeRating);
    var reviews
    for (let index = 0; index < completeStar; index++) {
        startRating[index]=<span className='fa fa-star'></span>;
    }
    if (this.props.placeReviews && this.props.placeReviews.length > 0){
      //console.log('1');
      reviews = this.props.placeReviews.map((review,index) => {
      return <div key={index} className='row mt-2 mb-1' >
                <div className='col-2'><strong>{review.author_name}</strong></div>
                <div className='col-10'>{review.text}</div>
              </div>;
      })
    }else{
      //console.log('2');
      reviews = <div key={1} className='row mt-2 mb-1' >
                <strong>No hay comentarios</strong>
              </div>;
    }

    const btnName = this.state.mostrarComentarios ? 'Ocultar Comentarios' : 'Mostrar Comentarios';
    const mostrar = this.state.mostrarComentarios ? 'd-block' : 'd-none'
    if( this.props.placeDetail == 'full' ){
      return (
        <div className='container'>
          <div className='row mt-2 mb-1' >
            <div className='col-3'><strong>Rating: </strong></div>
            <div className='col-1'><strong>{this.props.placeRating}</strong></div>
            <div className='col-6'><canvas id="canvas"></canvas></div>
          </div>
          <div className='mb-3 '><a href='#' id='btnComentarios' onClick={this.manejoOnClick}>{btnName}</a></div>
          <div className={'container '+mostrar}>
            {reviews}
          </div>
        </div>

      )
    } else if( this.props.placeDetail == 'simple' ) {
      return (
        <div className='container'>
          <div className='row mt-2 mb-1' >
            <strong>Rating: {this.props.placeRating}</strong>
          </div>
        </div>
      )

    }
  }
}
