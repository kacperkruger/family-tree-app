const findFamilyTreeByUser =
    'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(persons: Person)\n' +
    'WITH persons\n' +
    'OPTIONAL MATCH (persons)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH persons, collect(parents.id) as parents\n' +
    'OPTIONAL MATCH (persons)-[:PARTNERS]-(partners: Person)\n' +
    'WITH persons, parents, collect(partners.id) as partners\n' +
    'OPTIONAL MATCH (persons)-[:OPTIONAL_CHILD_OF]->(optionalParents: Person)\n' +
    'WITH persons, parents, partners, collect(optionalParents.id) as optionalParents\n' +
    'RETURN persons.id as id, persons.name as name, persons.surname AS surname, persons.gender as gender, date(persons.dateOfBirth) AS dateOfBirth, parents, partners, optionalParents';
export default findFamilyTreeByUser;