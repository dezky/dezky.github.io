type EventType = string | number

// @NOTE: random event emitter implementation...we should use something else

export type BaseEvents = Record<EventType, any[]>

/**
 *Event bus
 *In fact, it is a simple implementation of publish subscribe mode
 *The type definition is restricted by {@ link} https://github.com/andywer/typed-emitter/blob/master/index.d.ts }But you just need to declare the parameter, and you don't need to return the value (it should be {@ code void})
 */
export class EventEmitter<Events extends BaseEvents> {
  private readonly events = new Map<keyof Events, Function[]>()

  /**
   *Add an event listener
   *@ param type listening type
   *@ param callback processing callback
   * @returns {@code this}
   */
  addListener<E extends keyof Events>(
    type: E,
    callback: (...args: Events[E]) => void
  ) {
    const callbacks = this.events.get(type) || []
    callbacks.push(callback)
    this.events.set(type, callbacks)
    return this
  }
  /**
   *Remove an event listener
   *@ param type listening type
   *@ param callback processing callback
   * @returns {@code this}
   */
  removeListener<E extends keyof Events>(
    type: E,
    callback: (...args: Events[E]) => void
  ) {
    const callbacks = this.events.get(type) || []
    this.events.set(
      type,
      callbacks.filter((fn: any) => fn !== callback)
    )
    return this
  }
  /**
   *Remove a class of event listeners
   *@ param type listening type
   * @returns {@code this}
   */
  removeByType<E extends keyof Events>(type: E) {
    this.events.delete(type)
    return this
  }
  /**
   *Trigger a kind of event listener
   *@ param type listening type
   *@ param args the parameters needed to process the callback
   * @returns {@code this}
   */
  emit<E extends keyof Events>(type: E, ...args: Events[E]) {
    const callbacks = this.events.get(type) || []
    callbacks.forEach(fn => {
      fn(...args)
    })
    return this
  }

  /**
   *Get a kind of event listener
   *@ param type listening type
   *@ returns is a read-only array. If it cannot be found, it will return an empty array {@ code []}
   */
  listeners<E extends keyof Events>(type: E) {
    return Object.freeze(this.events.get(type) || [])
  }
}
