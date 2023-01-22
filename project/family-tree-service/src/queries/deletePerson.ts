const deletePerson = 'MATCH (user)-[:OWNS]->(person: PersonResponse {id: $personId})\n' +
    'DETACH DELETE person';

export default deletePerson;