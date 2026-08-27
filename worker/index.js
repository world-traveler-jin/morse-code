const ROOM_CODE_PATTERN = /^[a-z0-9-]{3,32}$/;
const MAX_PARTICIPANTS = 2;

// Live Chat is temporarily disabled (unmoderated real-time relay, no
// report/block mechanism — see pages/chat.js and archive/chat.page.js.txt).
// Flip this back to true to restore the WebSocket relay; the MorseRoom
// Durable Object below is untouched and ready to go.
const CHAT_ENABLED = false;

// Relays messages between the (at most two) WebSocket clients connected to a
// single chat room. Each room is its own Durable Object instance, keyed by
// room code, so rooms never see each other's messages.
export class MorseRoom {
  constructor(state, env) {
    this.state = state;
    this.sessions = new Set();
  }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected websocket upgrade', { status: 426 });
    }

    if (this.sessions.size >= MAX_PARTICIPANTS) {
      return new Response('Room is full', { status: 403 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();
    this.sessions.add(server);

    this.broadcastPresence();

    server.addEventListener('message', (event) => {
      for (const session of this.sessions) {
        if (session !== server) {
          try {
            session.send(event.data);
          } catch (e) {
            this.sessions.delete(session);
          }
        }
      }
    });

    const cleanup = () => {
      this.sessions.delete(server);
      this.broadcastPresence();
    };
    server.addEventListener('close', cleanup);
    server.addEventListener('error', cleanup);

    return new Response(null, { status: 101, webSocket: client });
  }

  broadcastPresence() {
    const payload = JSON.stringify({ type: 'presence', count: this.sessions.size });
    for (const session of this.sessions) {
      try {
        session.send(payload);
      } catch (e) {
        this.sessions.delete(session);
      }
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/ws/')) {
      if (!CHAT_ENABLED) {
        return new Response('Live Chat is currently unavailable', { status: 503 });
      }
      const roomCode = url.pathname.slice('/ws/'.length).toLowerCase();
      if (!ROOM_CODE_PATTERN.test(roomCode)) {
        return new Response('Invalid room code', { status: 400 });
      }
      const id = env.MORSE_ROOM.idFromName(roomCode);
      const stub = env.MORSE_ROOM.get(id);
      return stub.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
