const findPersonById = 'MATCH (person: Person {id: $personId})\n' +
    'OPTIONAL MATCH (person)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH person, collect(parents.id) as parents\n' +
    'OPTIONAL MATCH (person)-[:PARTNERS]-(partners: Person)\n' +
    'WITH person, parents, collect(partners.id) as partners\n' +
    'OPTIONAL MATCH (person)-[:OPTIONAL_CHILD_OF]->(optionalParents: Person)\n' +
    'WITH person, parents, partners, collect(optionalParents.id) as optionalParents\n' +
    'RETURN person.id as id, person.name as name, person.surname AS surname, person.gender as gender, date(person.dateOfBirth) AS dateOfBirth, parents, partners, optionalParents';

export default findPersonById;