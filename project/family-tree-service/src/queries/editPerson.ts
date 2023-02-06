const editPerson = 'MATCH (person: Person {id: $personId})\n' +
    'SET person.name = $name\n' +
    'SET person.surname = $surname\n' +
    'SET person.gender = $gender\n' +
    'SET person.dateOfBirth = $dateOfBirth\n' +
    'WITH person\n' +
    'OPTIONAL MATCH (person)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (person)-[:PARTNERS]-(partners: Person)\n' +
    'OPTIONAL MATCH (editedPerson)-[:OPTIONAL_CHILD_OF]-(optionalParents: Person)\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners, collect(optionalParents.id) as optionalParents';

export default editPerson;