import { openDB } from 'idb';

const JATE=JATE

const initdb = async () =>
  openDB(JATE, 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains(JATE)) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore(JATE, { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Add all data to a single record, nominally called '1'
export const putDb = async (content) => {
  console.log('PUT to the database');
  const jateDb = await openDB(JATE, 1);
  const tx = jateDb.transaction(JATE, 'readwrite');
  const store = tx.objectStore(JATE);
  const request = store.put({id: "1" , value: content });
  const result = await request;
  console.log('Data saved to the database', result);
};

// Get all data from a single record, nominally called '1'
export const getDb = async () => {
  console.log('GET from the database');
  const jateDb = await openDB(JATE, 1);
  const tx = jateDb.transaction(JATE, 'readonly');
  const store = tx.objectStore(JATE);
  const request = store.get("1");
  const result = await request;
  console.log('result.value', result.value);
  return result.value;
}
initdb();
