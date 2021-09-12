import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styles: [],
})
export class ChatsComponent implements OnInit {
  mensaje: string = '';
  elemento: any;
  private limite: number;

  constructor(public _cs: ChatService) {
    this.limite = 5;

    this.cargarMensajes(this.limite);
  }

  cargarMensajes(limiteMensajes: number) {

    this._cs
    .cargarMensajes(limiteMensajes)
    .subscribe(() => {
      if(limiteMensajes <= 5) {
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 50);
      }

    });
  }

  cargarMasMensajes() {
    this.limite += 5;
    console.log("this.limite: ", this.limite);
    this.cargarMensajes(this.limite);
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje() {
    console.log(this.mensaje);

    if (this.mensaje.length === 0) {
      return;
    }

    this._cs
      .agregarMensaje(this.mensaje)
      .then(() => (this.mensaje = ''))
      .catch((err) => console.error('Error al enviar', err));
  }
}
