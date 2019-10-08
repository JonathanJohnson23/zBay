import React from 'react';
import MapGL from 'react-map-gl';
import { withRouter } from 'react-router-dom';
import Geocoder from "react-map-gl-geocoder";
import DeckGL, { GeoJsonLayer} from "deck.gl";
import {writeApolloHook} from './with_apollo_hook'

const token = process.env.REACT_APP_TOKEN

class MapSearchBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      viewport: {
        width: 1,
        height: 1,
        longitude: -122.466233,
        latitude: 37.684638,
        zoom: 7,
      },
      searchResultLayer: null,
    }
  }

  mapRef = React.createRef()
  geocoderContainerRef = React.createRef();


  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  };

  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResult = event => {
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10}),
      viewport: event.result
    })
    this.props.setCache(this.state.viewport)
    this.props.history.push("/home")
  }

  render(){
    const {viewport} = this.state
    return(
      <div className="search-bar">
          <div  
            ref={this.geocoderContainerRef}
            className="landing-page-map-search"
          />
        <MapGL className="the-display-none-map"
          ref={this.mapRef}
          {...viewport}
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={token}
          >
          <Geocoder 
            mapRef={this.mapRef}
            containerRef={this.geocoderContainerRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={token}
          />
        </MapGL>
      </div>
    )
  }

}

export default withRouter(writeApolloHook(MapSearchBar))
