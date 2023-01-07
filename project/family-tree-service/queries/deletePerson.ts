const deletePerson = 'MATCH (user)-[:OWNS]->(person: Person {id: $personId})\n' +
    'DETACH DELETE person';

export default deletePerson;