function createAppContext(config, models) {
  return {
    config,
    models,
    state: {
      useMemoryStore: false,
      memoryStore: {
        users: [],
        watchlists: [],
      },
    },
  }
}

export { createAppContext }
