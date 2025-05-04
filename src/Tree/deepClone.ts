export function deepClone(obj: object, cache = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (cache.has(obj)) {
        return cache.get(obj)
    }

    const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj))

    cache.set(obj, clone)

    const descriptors = Object.getOwnPropertyDescriptors(obj)

    for (const key in descriptors) {
        if (descriptors.hasOwnProperty(key)) {
            const descriptor = descriptors[key]

            if (descriptor.get || descriptor.set) {
                Object.defineProperty(clone, key, {
                    get: descriptor.get ? descriptor.get.bind(clone) : undefined,
                    set: descriptor.set ? descriptor.set.bind(clone) : undefined,
                    enumerable: descriptor.enumerable,
                    configurable: descriptor.configurable,
                })
            } else {
                descriptor.value = deepClone(descriptor.value, cache)
                Object.defineProperty(clone, key, descriptor)
            }
        }
    }

    return clone
}
