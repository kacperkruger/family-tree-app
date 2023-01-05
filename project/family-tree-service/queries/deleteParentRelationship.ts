const deleteParentRelationship = 'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(child: Person {id: $childId})\n' +
    'MATCH (user)-[:OWNS]->(parent: Person {id: $parentId})\n' +
    'MATCH (child)-[r:CHILD_OF]->(parent)\n' +
    'DELETE r';

export default deleteParentRelationship;