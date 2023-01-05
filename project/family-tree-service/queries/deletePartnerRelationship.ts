const deletePartnerRelationship = 'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(partner1: Person {id: $partner1Id})\n' +
    'MATCH (user)-[:OWNS]->(partner2: Person {id: $partner2Id})\n' +
    'MATCH (partner1)-[r:PARTNERS]-(partner2)\n' +
    'DELETE r';

export default deletePartnerRelationship;