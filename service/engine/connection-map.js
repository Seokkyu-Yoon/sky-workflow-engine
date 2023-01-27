function Connection () {
  return {
    inPortMap: new Map(),
    prevNodeIds: new Set(),
    nextNodeIds: new Set()
  }
}

export function ConnectionMap (nodes, links) {
  const nodeIds = new Set(nodes.map(({ id }) => id))
  const map = links.reduce((map = new Map(), {
    src: { node: prevNodeId, port: outPortId },
    tar: { node: nextNodeId, port: inPortId }
  }) => {
    if (!nodeIds.has(nextNodeId)) return map
    if (!map.has(nextNodeId)) map.set(nextNodeId, Connection())
    const nextNodeConn = map.get(nextNodeId)
    nextNodeConn.inPortMap.set(inPortId, `${prevNodeId}.${outPortId}`)

    if (!nodeIds.has(prevNodeId)) return map
    if (!map.has(prevNodeId)) map.set(prevNodeId, Connection())
    const prevNodeConn = map.get(prevNodeId)
    prevNodeConn.nextNodeIds.add(nextNodeId)
    nextNodeConn.prevNodeIds.add(prevNodeId)
    return map
  }, new Map())

  return {
    get: key => map.get(key) || Connection(),
    has: key => map.has(key)
  }
}
