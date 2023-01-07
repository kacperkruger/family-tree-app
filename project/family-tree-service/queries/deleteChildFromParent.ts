const deleteChildFromParent = 'MATCH (child: Person {id: $childId})\n' +
    'MATCH (parent: Person {id: $parentId})\n' +
    'MATCH (child)-[r:CHILD_OF]->(parent)\n' +
    'DELETE r \n' +
    'WITH child\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: Person)\n' +
    'OPTIONAL MATCH (child)-[:PARTNERS]-(partners: Person)\n' +
    'RETURN child.id as id, child.name as name, child.surname AS surname, child.gender as gender, date(child.dateOfBirth) AS dateOfBirth, collect(parents.id) as parents, collect(partners.id) as partners';


export default deleteChildFromParent;