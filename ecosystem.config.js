module.exports = {
  apps: [
    {
      name: "todolist-server",
      script: "./dist/server.js"
    },
    {
      name: "todolist-queue",
      script: "./dist/queue.js"
    }
  ]
}
