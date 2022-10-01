import async_hooks from 'async_hooks';

// process._rawDebug('asyncHooks', async_hooks.executionAsyncId(), async_hooks.triggerAsyncId());

const resources = new Map();

// Only init to start context-based promise hook
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    resources.set(asyncId, {
      asyncId,
      type,
      triggerAsyncId,
      resource,
      init: true,
      before: false,
      after: false,
      promiseResolve: false
    });
  },
  before(asyncId) {
    if (resources.has(asyncId)) {
      resources.get(asyncId).before = true;
    }
  },
  after(asyncId) {
    if (resources.has(asyncId)) {
      resources.get(asyncId).after = true;
    }
  },
  promiseResolve(asyncId) {
    if (resources.has(asyncId)) {
      resources.get(asyncId).promiseResolve = true;
    }
  }
}).enable();


process._rawDebug('async resources that are pending when user code begins running:')
const pendingAsyncIds = new Set()
resources.forEach(resource => {
  const { triggerAsyncId } = resource
  if (!pendingAsyncIds.has(triggerAsyncId)) {
    pendingAsyncIds.add(triggerAsyncId)
    process._rawDebug(globalThis.debugAsyncHooks.get(triggerAsyncId))
  }
})

process._rawDebug(`\nwe want to find the line of code that creates the following async resources: ${Array.from(pendingAsyncIds).join(', ')}`)


process._rawDebug([...debugAsyncHooks].filter(resource => resource.tagged))
