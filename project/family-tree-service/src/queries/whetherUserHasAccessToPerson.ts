const whetherUserHasAccessToPerson = 'MERGE (user: User {userId: $userId})\n' +
    'WITH user\n' +
    'MATCH (person: Person {id: $personId})\n' +
    'RETURN EXISTS((user)-[:OWNS]->(person)) AS hasAccess';

export default whetherUserHasAccessToPerson;