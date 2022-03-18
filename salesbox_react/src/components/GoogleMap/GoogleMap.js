import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "react-google-maps";
import { compose, withProps } from "recompose"
import { Popup } from 'semantic-ui-react'
import AppConfig from '../../../config/app.config'
import css from './GoogleMap.css';


const GOOGLE_GEOCODING = `https://maps.googleapis.com/maps/api/geocode/json?key=${AppConfig.gmap_api_key}`;
const GOOGLE_DIRECTIONS = `https://maps.googleapis.com/maps/api/directions/json?key=${AppConfig.gmap_api_key}`

const geocoding = (placeName: string) => {
  return new Promise((resolve, reject) => {
    fetch(`${GOOGLE_GEOCODING}&address=${placeName}`)
      .then(r => r.json())
      .then(result => resolve(result))
      .catch(error => reject(error))
  })
}

const MyMapComponent = compose(
  withProps({
    // googleMapURL:
    //   `https://maps.googleapis.com/maps/api/js?key=${AppConfig.gmap_api_key}`,
    // loadingElement: <div style={{ height: `100%` }} />,
    // containerElement: <div className={css.mapContainer} />,
    // mapElement: <div style={{ height: `100%`, borderBottomRightRadius: 5, borderBottomLeftRadius: 5 }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  return (
      <GoogleMap
      options={{
        mapTypeControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_TOP,
          mapTypeIds: ['roadmap', 'satellite', 'custom-map'],
        },
        fullscreenControl: true,
        streetViewControl: true,
      }}
      defaultZoom={14} center={props.center}>
        <Marker

        onClick={props.direction}
        position={props.center} />
        {props.directions && <DirectionsRenderer
        options={{
          polylineOptions: {
            strokeColor: 'red',
            strokeWeight: 5
          }
        }}

        directions={props.directions} />}
      </GoogleMap>
  )
});
class GoogleMap1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: null,
      appointmentLocationInvalidMessage: '',
      directions: null,
      currentLocation: null
    }
  }

  async componentDidMount() {
    const { appointment } = this.props;
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        currentLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      })
    });
    this.getMapData(appointment);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appointment !== this.props.appointment) {
      this.getMapData(nextProps.appointment)
    }
  }

  direction = async () => {
    const { currentLocation, current } = this.state;
    if (!currentLocation || !current){
      return;
    }
    const dirctionSv = new window.google.maps.DirectionsService();
    dirctionSv.route({
      origin: new window.google.maps.LatLng(currentLocation.latitude, currentLocation.longitude),
      destination: new window.google.maps.LatLng(current.lat, current.lng),
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {

        this.setState({
          directions: result,
          isDirection: true
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
    // const { currentLocation, current } = this.state;
    // const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
    // // const destination = `${current.lat},${current.lng}`;
    // // const directionResult = await getDirections(origin, destination);
  }

  getMapData = async appointment => {

    let location = appointment.location;
    if (!appointment.location || appointment.location == '') {
      // Try to get contact address
      if (appointment.firstContactAddress) {
        location = appointment.firstContactAddress;
      } else if (appointment.organisation && appointment.organisation.fullAddress !== null) {
        location = appointment.organisation.fullAddress;
      }
    }
    if (!location) {
      return;
    }
    try {
      const response = await geocoding(location);
      if (response) {

        if (response.results && response.results.length > 0) {
          this.setState({
            appointmentLocationInvalidMessage: '',
            current: {
              lat: response.results[0].geometry.location.lat,
              lng: response.results[0].geometry.location.lng,
              formatted_address: response.results[0].formatted_address
            }
          })
        } else if (response.status === "ZERO_RESULTS" && location !== '') {
          this.setState({
            appointmentLocationInvalidMessage: `This address ${location} does not exist or invalid. Please check again!', ${location}`
          })
        } else {
          this.setState({
            appointmentLocationInvalidMessage: '',
            current: {}
          })
        }

      }
    } catch (error) {

      this.setState({
        appointmentLocationInvalidMessage: '',
        current: null
      })

    }
  }

  render() {
    const { current, appointmentLocationInvalidMessage, directions } = this.state;
    let defaultPos = { lat: 59.95, lng: 30.33 };
    if (appointmentLocationInvalidMessage) {
      return <div className={css.addContainer}>
        <div>{appointmentLocationInvalidMessage}</div>
      </div>
    }

    if (!current && appointmentLocationInvalidMessage === '') {
      return <div />

    }

    return (
      <MyMapComponent directions={directions} direction={this.direction} center={current} />
    )
  }
}

export default compose(withProps({
  googleMapURL:
    `https://maps.googleapis.com/maps/api/js?key=${AppConfig.gmap_api_key}`,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div className={css.mapContainer} />,
  mapElement: <div style={{ height: `100%`, borderRadius: 10 }} />
}))(GoogleMap1);
