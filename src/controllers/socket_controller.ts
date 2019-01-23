import { Listen } from "../models/listen";
import SocketIO from 'socket.io';

export class SocketController {

  public static handleConnection(socket: SocketIO.Socket) {
    const listenerCallback = (listen: Listen) => {
      socket.emit('listen', listen.toJSON());
    };

    Listen.events.on('listen', listenerCallback);

    socket.on('disconnect', () => {
      Listen.events.removeListener('listen', listenerCallback);
    });
  }

}
