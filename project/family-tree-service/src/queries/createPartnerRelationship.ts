const createPartnerRelationship = 'MATCH (partner1: Person {id: $partner1Id})\n' +
    'MATCH (partner2: Person {id: $partner2Id})\n' +
    'MERGE (partner1)-[:PARTNERS]->(partner2)\n' +
    'WITH partner1, partner2\n' +
    'UNWIND [partner1, partner2] AS editedPersons\n' +
    'OPTIONAL MATCH (editedPersons)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH editedPersons, collect(parents.id) as parents\n' +
    'OPTIONAL MATCH (editedPersons)-[:PARTNERS]-(partners: Person)\n' +
    'WITH editedPersons, parents, collect(partners.id) as partners\n' +
    'OPTIONAL MATCH (editedPersons)-[:OPTIONAL_CHILD_OF]->(optionalParents: Person)\n' +
    'WITH editedPersons, parents, partners, collect(optionalParents.id) as optionalParents\n' +
    'RETURN editedPersons.id as id, editedPersons.name as name, editedPersons.surname AS surname, editedPersons.gender as gender, date(editedPersons.dateOfBirth) AS dateOfBirth, parents, partners, optionalParents';

export default createPartnerRelationship;