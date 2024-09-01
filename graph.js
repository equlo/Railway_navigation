// backend/graph.js
function getShortestPath(graph, start, end) {
    const distances = {};
    const prev = {};
    const unvisited = new Set(Object.keys(graph));
  
    Object.keys(graph).forEach(node => {
      distances[node] = Infinity;
    });
    distances[start] = 0;
  
    while (unvisited.size > 0) {
      let currentNode = [...unvisited].reduce((minNode, node) => {
        return distances[node] < distances[minNode] ? node : minNode;
      });
  
      if (distances[currentNode] === Infinity) break;
  
      unvisited.delete(currentNode);
  
      Object.entries(graph[currentNode]).forEach(([neighbor, distance]) => {
        const tentative = distances[currentNode] + distance;
        if (tentative < distances[neighbor]) {
          distances[neighbor] = tentative;
          prev[neighbor] = currentNode;
        }
      });
    }
  
    const path = [];
    let currentNode = end;
  
    while (currentNode !== start) {
      path.unshift(currentNode);
      currentNode = prev[currentNode];
    }
  
    path.unshift(start);
    const distance = distances[end];
  
    return { path, distance };
  }
  
  module.exports = { getShortestPath };
  