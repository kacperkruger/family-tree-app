const addChildToPerson = 'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(child: Person {id: $childId})\n' +
    'MATCH (user)-[:OWNS]->(person: Person {id: $personId})\n' +
    'MERGE (child)-[:CHILD_OF]->(person)\n' +
    'WITH child\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (child)-[:PARTNERS]-(partners: Person)\n' +
    'RETURN child.id AS id, child.name AS name, child.surname AS surname, child.gender as gender, date(child.dateOfBirth) AS dateOfBirth, collect(parents.id) AS parents, collect(partners.id) AS partners';

export default addChildToPerson;
