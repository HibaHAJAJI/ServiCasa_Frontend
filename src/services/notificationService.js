if (typeof window !== "undefined" && !window.global) {
  window.global = window;
}

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class NotificationSocketService {
  constructor() {
    this.stompClient = null;
    this.isConnecting = false;
  }

  connect(token, onNotificationReceived) {
    if (this.stompClient && this.stompClient.active) {
      return;
    }
    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    const socketUrl = import.meta.env.VITE_WS_URL || "http://localhost:8081/ws";

    try {
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
        this.isConnecting = false;
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

      this.stompClient.onWebSocketError = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
      };

      this.stompClient.activate();
    } catch (error) {
      console.error("Failed to initialize WebSocket connection:", error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.isConnecting = false;
  }
}

export default new NotificationSocketService();
