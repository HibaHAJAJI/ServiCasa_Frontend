if (typeof window !== "undefined" && !window.global) {
  window.global = window;
}

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class NotificationSocketService {
  constructor() {
    this.stompClient = null;
  }

  connect(token, onNotificationReceived) {
    if (this.stompClient && this.stompClient.active) {
      return;
    }

    const socketUrl = "http://localhost:8081/ws";

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        token: token,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe("/user/queue/notifications", (message) => {
        if (message.body) {
          try {
            const notification = JSON.parse(message.body);
            onNotificationReceived(notification);
          } catch (e) {
            console.error("Erreur parsing notification WS:", e);
          }
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}

export default new NotificationSocketService();
