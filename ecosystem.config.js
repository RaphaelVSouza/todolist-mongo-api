module.exports = {
  apps: [
    {
      name: "todolist-server",
      script: "node dist/server.js"
    },
    {
      name: "todolist-queue",
      script: "node dist/queue.js"
    }
  ]
}
