const removePerson = 'MATCH (user)-[:OWNS]->(person: Person {id: $personId})\n' +
    'DETACH DELETE person';

export default removePerson;