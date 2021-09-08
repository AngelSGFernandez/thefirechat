import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { map } from 'rxjs/operators';

import { Mensaje } from "../interface/mensaje.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection?: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {}

  constructor( private afs: AngularFirestore,
                public afAuth: AngularFireAuth ) {
                  this.afAuth.authState.subscribe( user => {
                    console.log( 'Estado de usuario: ', user );

                    if( !user ) {
                      return;
                    }

                    this.usuario.nombre = user.displayName;
                    this.usuario.uid = user.uid;
                  })
                }

  login( proveedor: string ) {
    if ( proveedor === 'google') {
      this.afAuth.signInWithPopup( new firebase.auth.GoogleAuthProvider );

    } else if ( proveedor === 'github') {
      this.afAuth.signInWithPopup( new firebase.auth.GithubAuthProvider )
                  .then((result) => { console.log( result);})
                  .catch( err => console.log( err ));

     } else {
       return;
     }
  }

  logout() {
    this.usuario = {};
    this.afAuth.signOut();
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc')
                                                                            .limit(5));

    return this.itemsCollection.valueChanges()
                                .pipe( map( (mensajes: Mensaje[]) => {
                                  console.log( mensajes );

                                  this.chats = [];

                                  for ( let mensaje of mensajes ) {
                                    this.chats.unshift( mensaje );
                                  }

                                  return this.chats;
                                  // this.chats = mensajes;
                                }))
  }

  agregarMensaje( texto: string ) {

    // TODO FALTA UID DEL USUARIO
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }

    return this.itemsCollection!.add( mensaje );
  }
}
