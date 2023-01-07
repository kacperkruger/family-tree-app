const editPerson = 'MATCH (person: Person {id: $personId})\n' +
    'SET person.name = $name\n' +
    'SET person.surname = $surname\n' +
    'SET person.male = $gender\n' +
    'SET person.dateOfBirth = $dateOfBirth\n' +
    'WITH person\n' +
    'OPTIONAL MATCH (person)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (person)-[:PARTNERS]-(partners: Person)\n' +
    'RETURN person.id as id, person.name as name, person.surname AS surname, person.gender as gender, date(person.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners';

export default editPerson;