const socketIo = require("socket.io");
const express = require("express");
const http = require("http");

class Socket {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server);
    this.users = {};
    this.clientConnection();
  }

  clientConnection() {
    this.io.on("connection", (socket) => {
      socket.on("register", (userId) => {
        this.users[userId] = socket.id;
      });
      socket.on("disconnect", () => {
        Object.keys(this.users).forEach((userId) => {
          if (this.users[userId] === socket.id) {
            delete this.users[userId];
          }
        });
      });
    });
  }
}

class ServerSocket {
  constructor() {
    if (!this.instance) {
      this.instance = new Socket();
    }
  }
  getInstance() {
    return this.instance;
  }
}

const socket = new ServerSocket().getInstance();
module.exports = socket;
