const findFamilyTreeByUser =
    'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(persons: Person)\n' +
    'WITH persons\n' +
    'OPTIONAL MATCH (persons)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH parents, persons\n' +
    'OPTIONAL MATCH (partners: Person)-[:PARTNERS]-(persons)\n' +
    'RETURN persons.id AS id, persons.name AS name, persons.surname AS surname, persons.gender as gender, date(persons.dateOfBirth) AS dateOfBirth, collect(parents.id) AS parents, collect(partners.id) AS partners';

export default findFamilyTreeByUser;