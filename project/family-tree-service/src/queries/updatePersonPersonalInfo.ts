const updatePersonPersonalInfo = 'MATCH (person: Person {id: $personId})\n' +
    'SET person.name = $name\n' +
    'SET person.surname = $surname\n' +
    'SET person.gender = $gender\n' +
    'SET person.dateOfBirth = $dateOfBirth\n' +
    'WITH person as editedPerson\n' +
    'OPTIONAL MATCH (editedPerson)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH editedPerson, collect(parents.id) as parents\n' +
    'OPTIONAL MATCH (editedPerson)-[:PARTNERS]-(partners: Person)\n' +
    'WITH editedPerson, parents, collect(partners.id) as partners\n' +
    'OPTIONAL MATCH (editedPerson)-[:OPTIONAL_CHILD_OF]->(optionalParents: Person)\n' +
    'WITH editedPerson, parents, partners, collect(optionalParents.id) as optionalParents\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, parents, partners, optionalParents';

export default updatePersonPersonalInfo;