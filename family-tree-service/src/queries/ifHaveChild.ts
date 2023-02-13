const ifHaveChild = 'MATCH (person1: Person {id: $person1Id})\n' +
    'MATCH (person2: Person {id: $person2Id})\n' +
    'RETURN EXISTS( (person1)<-[:CHILD_OF]-(:Person)-[:CHILD_OF]->(person2) ) as ifHaveChild';

export default ifHaveChild;