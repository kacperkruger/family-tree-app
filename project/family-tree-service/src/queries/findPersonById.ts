const findPersonById = 'MATCH (person: PersonResponse {id: $personId})\n' +
    'OPTIONAL MATCH (person)-[:CHILD_OF]->(parents: PersonResponse)\n' +
    'OPTIONAL MATCH (person)-[:PARTNERS]-(partners: PersonResponse)\n' +
    'RETURN person.id AS id, person.name AS name, person.surname AS surname, person.gender as gender, date(person.dateOfBirth) AS dateOfBirth, collect(parents.id) AS parents, collect(partners.id) AS partners';

export default findPersonById;