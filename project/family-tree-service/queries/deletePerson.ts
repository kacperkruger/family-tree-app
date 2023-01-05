const deletePerson = 'MERGE (user: User {userId: \'123\'})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(person: Person {id: \'509a923c-c19e-4abf-9004-095014e928a0\'})\n' +
    'DETACH DELETE person'

export default deletePerson