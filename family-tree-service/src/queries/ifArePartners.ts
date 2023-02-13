const ifArePartners = 'MATCH (person1: Person {id: $person1Id})\n' +
    'MATCH (person2: Person {id: $person2Id})\n' +
    'RETURN EXISTS( (person1)-[:PARTNERS]-(person2) )as ifArePartners';
export default ifArePartners;