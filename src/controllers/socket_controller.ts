import { Listen } from "../models/listen";
import SocketIO from 'socket.io';

export class SocketController {

  /**
   * Will handle a socket io connection and subscribe them to listens
   * @param socket - The socket io socket that just connected
   */
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
