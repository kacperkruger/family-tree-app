const findPersonById = 'MATCH (person: Person {id: $personId})\n' +
    'OPTIONAL MATCH (person)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (person)-[:PARTNERS]-(partners: Person)\n' +
    'RETURN person.id AS id, person.name AS name, collect(parents.id) AS parents, collect(partners.id) AS partners';

export default findPersonById;