import { Peer, DataConnection } from 'peerjs';
import { RemoteControlMessage } from '../types/snellen';

export class RemotePeerManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;

  public initHost(
    onPeerOpen: (peerId: string) => void,
    onMessage: (msg: RemoteControlMessage) => void,
    onError?: (err: any) => void
  ) {
    // Initialize PeerJS host with random short session ID prefix
    const randomId = 'os-' + Math.random().toString(36).substring(2, 8);
    this.peer = new Peer(randomId);

    this.peer.on('open', (id) => {
      onPeerOpen(id);
    });

    this.peer.on('connection', (conn) => {
      this.connection = conn;
      conn.on('data', (data: any) => {
        onMessage(data as RemoteControlMessage);
      });
    });

    this.peer.on('error', (err) => {
      if (onError) onError(err);
    });
  }

  public initClient(
    hostPeerId: string,
    onConnected: () => void,
    onDisconnected: () => void,
    onError?: (err: any) => void
  ) {
    this.peer = new Peer();

    this.peer.on('open', () => {
      if (!this.peer) return;
      const conn = this.peer.connect(hostPeerId);
      this.connection = conn;

      conn.on('open', () => {
        onConnected();
      });

      conn.on('close', () => {
        onDisconnected();
      });

      conn.on('error', (err) => {
        if (onError) onError(err);
      });
    });

    this.peer.on('error', (err) => {
      if (onError) onError(err);
    });
  }

  public send(msg: RemoteControlMessage) {
    if (this.connection && this.connection.open) {
      this.connection.send(msg);
    }
  }

  public destroy() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}
