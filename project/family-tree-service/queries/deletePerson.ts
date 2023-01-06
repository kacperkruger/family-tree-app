const deletePerson = 'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(person: Person {id: $personId})\n' +
    'DETACH DELETE person';

export default deletePerson;