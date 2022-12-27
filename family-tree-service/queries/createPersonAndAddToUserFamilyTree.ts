const createPersonAndAddToUserFamilyTree =
    'MERGE (user: User {userId: $userId})\n' +
    'CREATE (user)-[:OWNS]->(createdPerson :Person {id: apoc.create.uuid(), name: $name})\n' +
    'RETURN createdPerson.id AS id, createdPerson.name AS name, collect(NULL) AS parents, collect(null) AS partners';

export default createPersonAndAddToUserFamilyTree;