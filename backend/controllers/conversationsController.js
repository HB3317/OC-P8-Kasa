const { randomUUID } = require('crypto');
const LIMIT = 5000;
const fail = (res, error) => res.status(500).json({ error: 'Messagerie indisponible.' });
async function list(req, res) {
  const db = req.app.locals.db; const id = req.user.id;
  try {
    const rows = await db.allAsync(`SELECT c.id,c.property_id,c.client_id,c.owner_id,c.created_at,c.updated_at,p.title AS property_title,
      u.name AS peer_name,u.picture AS peer_picture,
      (SELECT body FROM conversation_messages m WHERE m.conversation_id=c.id ORDER BY m.id DESC LIMIT 1) AS last_message,
      (SELECT created_at FROM conversation_messages m WHERE m.conversation_id=c.id ORDER BY m.id DESC LIMIT 1) AS last_message_at,
      (SELECT COUNT(*) FROM conversation_messages m WHERE m.conversation_id=c.id AND m.sender_id<>? AND m.read_at IS NULL) AS unread
      FROM conversations c JOIN properties p ON p.id=c.property_id
      JOIN users u ON u.id=CASE WHEN c.client_id=? THEN c.owner_id ELSE c.client_id END
      WHERE c.client_id=? OR c.owner_id=? ORDER BY COALESCE(last_message_at,c.created_at) DESC,c.id DESC`,[id,id,id,id]);
    res.json(rows);
  } catch(e) { console.error(e); fail(res,e); }
}
async function create(req,res) {
  const db=req.app.locals.db;const id=req.user.id;
  const propertyId=typeof req.body?.propertyId==='string'?req.body.propertyId.trim():'';
  if(!propertyId || propertyId.length>100) return res.status(400).json({error:'Logement invalide.'});
  try {
    const property=await db.getAsync('SELECT id,host_id FROM properties WHERE id=?',[propertyId]);
    if(!property) return res.status(404).json({error:'Logement introuvable.'});
    if(Number(property.host_id)===id) return res.status(403).json({error:'Vous ne pouvez pas vous contacter vous-même.'});
    await db.runAsync('INSERT OR IGNORE INTO conversations(property_id,client_id,owner_id) VALUES (?,?,?)',[propertyId,id,property.host_id]);
    const row=await db.getAsync('SELECT id FROM conversations WHERE property_id=? AND client_id=? AND owner_id=?',[propertyId,id,property.host_id]);
    res.status(200).json(row);
  } catch(e){console.error(e);fail(res,e);}
}
async function member(db,id,userId){
  return db.getAsync('SELECT id,client_id,owner_id FROM conversations WHERE id=? AND (client_id=? OR owner_id=?)',[id,userId,userId]);
}
async function messages(req,res){
  const db=req.app.locals.db;const id=Number(req.params.id);
  if(!Number.isSafeInteger(id)||id<1) return res.status(400).json({error:'Conversation invalide.'});
  try {
    if(!await member(db,id,req.user.id))return res.status(404).json({error:'Conversation introuvable.'});
    const latest=await db.allAsync('SELECT id,conversation_id,sender_id,body,created_at,read_at FROM conversation_messages WHERE conversation_id=? ORDER BY id DESC LIMIT 500',[id]);
    const rows=latest.reverse();
    res.json(rows);
  }catch(e){console.error(e);fail(res,e);}
}
async function send(req,res){
  const db=req.app.locals.db;const id=Number(req.params.id);
  const body=typeof req.body?.body==='string'?req.body.body.trim():'';
  if(!Number.isSafeInteger(id)||id<1)return res.status(400).json({error:'Conversation invalide.'});
  if(!body || body.length>LIMIT)return res.status(400).json({error:'Message requis (maximum 5000 caractères).'});
  try {
    if(!await member(db,id,req.user.id))return res.status(404).json({error:'Conversation introuvable.'});
    const {lastID}=await db.runAsync('INSERT INTO conversation_messages(conversation_id,sender_id,body) VALUES(?,?,?)',[id,req.user.id,body]);
    await db.runAsync('UPDATE conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?',[id]);
    const row=await db.getAsync('SELECT id,conversation_id,sender_id,body,created_at,read_at FROM conversation_messages WHERE id=?',[lastID]);
    res.status(201).json(row);
  }catch(e){console.error(e);fail(res,e);}
}
async function read(req,res){
  const db=req.app.locals.db;const id=Number(req.params.id);
  if(!Number.isSafeInteger(id)||id<1)return res.status(400).json({error:'Conversation invalide.'});
  try {
    if(!await member(db,id,req.user.id))return res.status(404).json({error:'Conversation introuvable.'});
    await db.runAsync('UPDATE conversation_messages SET read_at=CURRENT_TIMESTAMP WHERE conversation_id=? AND sender_id<>? AND read_at IS NULL',[id,req.user.id]);
    res.json({ok:true});
  }catch(e){console.error(e);fail(res,e);}
}
module.exports={list,create,messages,send,read};
