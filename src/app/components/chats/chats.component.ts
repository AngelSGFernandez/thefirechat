import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styles: [
  ]
})
export class ChatsComponent implements OnInit {

  mensaje: string = "";
  elemento: any;

  constructor( public _cs: ChatService) {

    this._cs.cargarMensajes()
        .subscribe( () => {

          setTimeout( () => {
            this.elemento.scrollTop = this.elemento.scrollHeight;
          }, 50)
        });
  }

  ngOnInit(){
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje() {
    console.log( this.mensaje );

    if( this.mensaje.length === 0 ) {
      return;
    }

    this._cs.agregarMensaje( this.mensaje )
            .then( () => this.mensaje = "" )
            .catch( (err) => console.error('Error al enviar', err) );
  }

}
