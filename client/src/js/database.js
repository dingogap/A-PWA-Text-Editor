import { openDB } from 'idb';

const JATE = 'jate'

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

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log('PUT to the database');
  const jateDb = await openDB(JATE, 1);
  const tx = jateDb.transaction(JATE, 'readwrite');
  const store = tx.objectStore(JATE);
  const request = store.put({ value: content });
  const result = await request;
  console.log('Data saved to the database', result);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET all from the database');
  const jateDb = await openDB(JATE, 1);
  const tx = jateDb.transaction(JATE, 'readonly');
  const store = tx.objectStore(JATE);
  const request = store.getAll();
  const result = await request;
  console.log('result.value', result);
  return result;
};

initdb();
