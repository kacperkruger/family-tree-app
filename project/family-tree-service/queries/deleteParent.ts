const deleteParent = 'MATCH (child: Person {id: $childId})\n' +
    'MATCH (parent: Person {id: $parentId})\n' +
    'MATCH (child)-[r:CHILD_OF]->(parent)\n' +
    'DELETE r \n' +
    'WITH partner1, partner2\n' +
    'UNWIND [partner1, partner2] AS editedPerson\n' +
    'OPTIONAL MATCH (editedPerson)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (editedPerson)-[:PARTNERS]-(partners: Person)\n' +
    'RETURN editedPerson.id as id, editedPerson.name as name, editedPerson.surname AS surname, editedPerson.gender as gender, date(editedPerson.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners';


export default deleteParent;