const addChildToPerson = 'MATCH (child: Person {id: $childId})\n' +
    'MATCH (person: Person {id: $personId})\n' +
    'MERGE (child)-[:CHILD_OF]->(person)\n' +
    'WITH child\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (child)-[:PARTNERS]-(partners: Person)\n' +
    'OPTIONAL MATCH (editedPerson)-[:OPTIONAL_CHILD_OF]-(optionalParents: Person)\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners, collect(optionalParents.id) as optionalParents';

export default addChildToPerson;
