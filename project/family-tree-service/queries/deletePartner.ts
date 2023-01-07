const deletePartner = 'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(partner1: Person {id: $partner1Id})\n' +
    'MATCH (user)-[:OWNS]->(partner2: Person {id: $partner2Id})\n' +
    'MATCH (partner1)-[r:PARTNERS]-(partner2)\n' +
    'DELETE r\n' +
    'WITH partner1, partner2\n' +
    'UNWIND [partner1, partner2] AS editedPerson\n' +
    'OPTIONAL MATCH (editedPerson)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (editedPerson)-[:PARTNERS]-(partners: Person)\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners';


export default deletePartner;