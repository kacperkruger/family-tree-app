const addParent = 'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(child: Person {id: $childId})\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH user, child, count(parents) AS numberOfParents\n' +
    'WHERE numberOfParents < 2\n' +
    'WITH user, child\n' +
    'MATCH (user)-[:OWNS]->(newParent: Person {id: $parentId})\n' +
    'MERGE (child)-[:CHILD_OF]->(newParent)\n' +
    'WITH child, newParent\n' +
    'UNWIND [child, newParent] AS editedPerson\n' +
    'OPTIONAL MATCH (editedPerson)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (editedPerson)-[:PARTNERS]-(partners: Person)\n' +
    'RETURN editedPerson.id AS id, editedPerson.name AS name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) AS parents, collect(partners.id) AS partners';

export default addParent;