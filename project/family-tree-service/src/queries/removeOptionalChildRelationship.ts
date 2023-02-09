const deleteChildFromParent = 'MATCH (child: Person {id: $childId})\n' +
    'MATCH (parent: Person {id: $parentId})\n' +
    'MATCH (child)-[r:OPTIONAL_CHILD_OF]->(parent)\n' +
    'DELETE r \n' +
    'WITH child\n' +
    'OPTIONAL MATCH (child)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH child, collect(parents.id) as parents\n' +
    'OPTIONAL MATCH (child)-[:PARTNERS]-(partners: Person)\n' +
    'WITH child, parents, collect(partners.id) as partners\n' +
    'OPTIONAL MATCH (child)-[:OPTIONAL_CHILD_OF]->(optionalParents: Person)\n' +
    'WITH child, parents, partners, collect(optionalParents.id) as optionalParents\n' +
    'RETURN child.id as id, child.name as name, child.surname AS surname, child.gender as gender, date(child.dateOfBirth) AS dateOfBirth, parents, partners, optionalParents';


export default deleteChildFromParent;