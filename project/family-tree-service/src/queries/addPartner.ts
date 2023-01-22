const addPartner = 'MATCH (partner1: PersonResponse {id: $partner1Id})\n' +
    'MATCH (partner2: PersonResponse {id: $partner2Id})\n' +
    'MERGE (partner1)-[:PARTNERS]->(partner2)\n' +
    'WITH partner1, partner2\n' +
    'UNWIND [partner1, partner2] AS editedPerson\n' +
    'OPTIONAL MATCH (editedPerson)-[:CHILD_OF]->(parents: PersonResponse)\n' +
    'OPTIONAL MATCH (editedPerson)-[:PARTNERS]-(partners: PersonResponse)\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners';

export default addPartner;