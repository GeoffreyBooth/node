import { createHook } from 'async_hooks';


const resources = new Map();

// Only init to start context-based promise hook
createHook({
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


console.log('async resources that are pending when user code begins running:')
const pendingAsyncIds = new Set()
resources.forEach(resource => {
  const { triggerAsyncId } = resource
  if (!pendingAsyncIds.has(triggerAsyncId)) {
    pendingAsyncIds.add(triggerAsyncId)
    console.log(globalThis.debugAsyncHooks.get(triggerAsyncId))
  }
})

console.log(`\nwe want to find the line of code that creates the following async resources: ${Array.from(pendingAsyncIds).join(', ')}`)
