const addParentToPerson = 'MATCH (child: Person {id: $childId})\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH child, count(parents) AS numberOfParents\n' +
    'WHERE numberOfParents < 2\n' +
    'WITH child\n' +
    'MATCH (newParent: Person {id: $parentId})\n' +
    'MERGE (child)-[:CHILD_OF]->(newParent)\n' +
    'WITH child\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (child)-[:PARTNERS]-(partners: Person)\n' +
    'OPTIONAL MATCH (editedPerson)-[:OPTIONAL_CHILD_OF]-(optionalParents: Person)\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners, collect(optionalParents.id) as optionalParents';

export default addParentToPerson;