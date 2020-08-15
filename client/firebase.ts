import * as firebase from 'firebase/app';
import 'firebase/auth';
import { config } from "./config/config";

export const initFirebase = () => {
    if (typeof window !== 'undefined' && !firebase.apps.length){
        firebase.initializeApp(config.firebaseConfig);
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
        });
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              window.location.href ='/dashboard';
            } else {
              console.log(user);
            }
        });
    } 
}