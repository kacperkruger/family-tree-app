const findFamilyTreeByUser =
    'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(persons: Person)\n' +
    'WITH persons\n' +
    'OPTIONAL MATCH (persons)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH parents, persons\n' +
    'OPTIONAL MATCH (partners: Person)-[:PARTNERS]-(persons)\n' +
    'OPTIONAL MATCH (editedPerson)-[:OPTIONAL_CHILD_OF]-(optionalParents: Person)\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners, collect(optionalParents.id) as optionalParents';

export default findFamilyTreeByUser;