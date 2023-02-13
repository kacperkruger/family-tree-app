const createPerson =
    'MERGE (user: User {userId: $userId})\n' +
    'CREATE (user)-[:OWNS]->(createdPerson :Person {id: randomUUID(), name: $name, surname: $surname, gender: $gender, dateOfBirth: date($dateOfBirth)})\n' +
    'RETURN createdPerson.id AS id, createdPerson.name AS name, createdPerson.surname AS surname, createdPerson.gender as gender, createdPerson.dateOfBirth AS dateOfBirth, collect(NULL) AS parents, collect(NULL) AS partners, collect(NULL) AS optionalParents';

export default createPerson;