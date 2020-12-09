

async function truncate (db) {
  const collections = Object.keys(db.collections);
  console.log(collections)

 await Promise.all(collections.map( async collection => {
  await db.dropCollection(collection);
}));


}

export default truncate;
