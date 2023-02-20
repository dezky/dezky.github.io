/**
 *  all these files are needed because we need to mock summerian dependencies that are tightly coupled to the HUD
 *  keep in mind when designing our app, to separate as much as possible from anyhting in here, as we'll simply remove it as soon as we can.
 */

import { isEmpty, isPlainObject } from 'lodash'
import { EventEmitter } from './eventEmitter'

class Point3 {
  x = 0
  y = 0
  z = 0

  set(p: { x: number; y: number; z: number }) {
    this.x = p.x
    this.y = p.y
    this.z = p.z
  }
}

export const getJunk = (emitter: EventEmitter<any>) => {
  const sumerian = {
    SystemBus: emitter,
    World: {
      diagramNamespace: 'diagramNamespace',
      forPublicWorld: () => {
        return context.world
      }
    },
    Entity: {
      forPublicEntity: (c: any) => ({
        ...c,
        attachChild: () => {},
        detachChild: () => {}
      })
    }
  }

  const values = {} as any
  const events = {} as any

  const baseEntityNames = [
    'diagram_base',
    'specular_base',
    'edge_glow_top',
    'edge_glow_bottom',
    'edge_glow_right',
    'edge_glow_left',
    'grid'
  ]

  const context = {
    engine: '2d',
    start: ([fn, args]: [(ctx: any, args: any) => void, any]) => {
      fn(context, args)
    },
    sequence: (...args: any[]) => {
      console.log('running sequence', ...args)
      let listener: any
      const res = {
        onComplete: (l: any) => {
          listener = l
        }
      }
      const runSeq = async () => {
        for (const [fn, arg] of args) {
          console.log(fn.name)
          if (fn) await fn(context, arg)
        }
        if (listener) {
          listener()
        }
      }
      setTimeout(() => {
        runSeq().catch(err => console.log(err)) // run the sequence async
      }, 0)
      return res
    },
    world: {
      sumerianRunner: {
        is2D: true,
        renderer: {
          setClearColor: () => {}
        },
        renderSystem: { postRenderers: [] },
        callbacksPreRender: { push: () => {} }
      },
      entities: {
        ...baseEntityNames.map(name => ({
          name,
          meshRendererComponent: {
            isPickable: true,
            materials: [{ getTextures: () => [] }]
          },
          position: new Point3(),
          scale: new Point3()
        })),
        select: (...arr: any[]) => new Set(arr ?? [])
      },
      value: function (key: string) {
        if (!values[key]) {
          let monitorCb: any
          values[key] = {
            current: {},
            set: (val: any) => {
              values[key].current = val
              if (monitorCb) {
                monitorCb(values[key])
              }
            },
            get: () => values[key].current,
            monitor: (ctx: any, cb: (val: any) => void) => {
              monitorCb = cb
            }
          }
        }
        return values[key]
      },
      event: (key: string) => {
        if (!events[key]) {
          const ev = {
            key: key,
            emit: function (val: string) {
              console.log(this.key)
              setTimeout(() => emitter.emit(this.key, val), 10)
              return this
            },
            monitor: function (ctx: any, cb: any) {
              setTimeout(() => emitter.addListener(this.key, cb), 10)
              return this
            }
          }
          events[key] = ev
        }
        return events[key]
      }
    }
  }

  return { context, sumerian }
}

// copy from sumerianUtils
const pushIfNotIncluded = (mapObj: any, key: string, entity: any) => {
  if (!mapObj[key]) mapObj[key] = [] // ensure array exists
  if (!mapObj[key].includes(entity)) mapObj[key].push(entity)
}

// copy from diagramInteractionUtils
const makeEntityIdConfigDataMap = (config: any) => ({
  [config.id]: config,
  ...(config.children?.flatMap(makeEntityIdConfigDataMap) ?? []).reduce(
    (idMap: any, child: any) => ({ ...idMap, ...child }),
    {}
  )
})

// It initialize the expected world values to be used in the HUD
export const setWorldValues = (
  context: any,
  versionData: any,
  entitiesMap: any
) => {
  const versionDataMap = makeEntityIdConfigDataMap(versionData.sumerianUiData)
  const entityIdMap = {} as any
  const tagMap = {
    keyValues: {},
    keys: {},
    noTags: [],
    values: {}
  } as any

  for (const id in versionDataMap) {
    const entities = entitiesMap.get(id)

    if (!entities || entities.length === 0) {
      continue
    }

    entityIdMap[id] = entities

    const {
      displayData: { tags: resourcesTags, labels }
    } = versionDataMap[id]

    for (const entity of entities) {
      const tags = resourcesTags ?? (isPlainObject(labels) ? labels : {}) // GCP has labels, not tags and labels is an object.
      if (!tags || isEmpty(tags)) {
        // we still need to capture this entity
        if (!tagMap.noTags.includes(entity)) {
          tagMap.noTags.push(entity)
        }
      } else {
        Object.keys(tags).forEach(key => {
          pushIfNotIncluded(tagMap.keys, key, entity)
        })
        Object.values(tags).forEach((value: any) => {
          pushIfNotIncluded(tagMap.values, value, entity)
        })
        // set the key:value lookup
        Object.entries(tags)
          .map(
            kv => `${kv[0]}!!${kv[1]}` // transformed Key Values
          )
          .forEach(kv => {
            pushIfNotIncluded(tagMap.keyValues, kv, entity)
          })
      }
    }
  }

  context.world.value('entityIdMap').set(entityIdMap)
  context.world
    .event('entityMapComplete')
    .emit({ globalEntityMap: entityIdMap })
  context.world.value('entityTagMap').set(tagMap)
}
