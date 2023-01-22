const addParentToPerson = 'MATCH (child: PersonResponse {id: $childId})\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: PersonResponse)\n' +
    'WITH child, count(parents) AS numberOfParents\n' +
    'WHERE numberOfParents < 2\n' +
    'WITH child\n' +
    'MATCH (newParent: PersonResponse {id: $parentId})\n' +
    'MERGE (child)-[:CHILD_OF]->(newParent)\n' +
    'WITH child\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: PersonResponse)\n' +
    'OPTIONAL MATCH (child)-[:PARTNERS]-(partners: PersonResponse)\n' +
    'RETURN child.id AS id, child.name AS name, child.surname AS surname, child.gender as gender, date(child.dateOfBirth) AS dateOfBirth, collect(parents.id) AS parents, collect(partners.id) AS partners';

export default addParentToPerson;