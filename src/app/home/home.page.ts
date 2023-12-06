import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  latitude: any = 0;
  longitude: any = 0;

  constructor(
    private geolocation: Geolocation,
    private inAppBrowser: InAppBrowser,
    private firestore: AngularFirestore
  ) { }

  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
  
      // Guarda las coordenadas en Firestore sin vincularlas a un usuario específico
      this.firestore.collection('ubicaciones').add({
        latitude: this.latitude,
        longitude: this.longitude,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log('Ubicación guardada en Firebase');
      })
      .catch((error) => {
        console.error('Error al guardar ubicación en Firebase:', error);
      });
    }).catch((error) => {
      console.log('Error, no se puede obtener tu ubicacion', error);
    });
  }
  
  openGoogleMaps() {
    const googleMapsUrl = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
    this.inAppBrowser.create(googleMapsUrl, '_system');
  }

}
