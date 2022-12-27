const findFamilyTreeByUser =
    'MERGE (user: User {userId: \'123\'})\n' +
    'WITH user\n' +
    'MATCH (user)-[:OWNS]->(persons: Person)\n' +
    'WITH persons\n' +
    'OPTIONAL MATCH (persons)-[:CHILD_OF]->(parents: Person)\n' +
    'WITH parents, persons\n' +
    'OPTIONAL MATCH (partners: Person)-[:PARTNERS]-(persons)\n' +
    'RETURN persons.name as name, id(persons) as id, collect(id(parents)) as parents, collect(id(partners)) as partners';