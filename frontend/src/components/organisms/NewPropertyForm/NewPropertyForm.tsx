'use client';
import {useRef,useState,type FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import type {AuthUser} from '@/types/auth';
import PropertyImageField from '@/components/molecules/PropertyImageField/PropertyImageField';
import styles from '@/styles/organisms/NewPropertyForm.module.css';
const equipmentOptions=['Micro-Ondes','Clic-clac','Douche italienne','Four','Frigo','Rangements','WIFI','Lit','Parking','Bouilloire','Sèche Cheveux','SDB','Machine à laver','Toilettes sèches','Cuisine équipée','Cintres','Télévision','Baie vitrée','Chambre Séparée','Hotte','Climatisation','Baignoire','Frigo Américain','Vue Parc'];
const categoryOptions=['Parc','Night Life','Culture','Nature','Touristique','Vue sur mer','Pour les couples','Famille','Forêt'];
export default function NewPropertyForm({user}:{user:AuthUser}){
  const router=useRouter();
  const [cover,setCover]=useState<File[]>([]);
  const [pictures,setPictures]=useState<File[]>([]);
  const [avatar,setAvatar]=useState<File[]>([]);
  const [equipments,setEquipments]=useState<string[]>([]);
  const [tags,setTags]=useState<string[]>([]);
  const [customTag,setCustomTag]=useState('');
  const [busy,setBusy]=useState(false);
  const submitting=useRef(false);
  const [error,setError]=useState('');
  const toggle=(value:string, values:string[], setter:(v:string[])=>void)=>setter(values.includes(value)?values.filter(v=>v!==value):[...values,value]);
  function addTag(){const value=customTag.trim();if(value && value.length<=40 && tags.length<20 && !tags.includes(value))setTags([...tags,value]);setCustomTag('');}
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(submitting.current)return;setError('');
    const formElement=event.currentTarget;
    if(!formElement.reportValidity())return;
    if(!cover.length)return setError('Ajoute une photo de couverture.');
    if(!equipments.length)return setError('Sélectionne au moins un équipement.');
    const chosen=[...cover,...pictures,...avatar];
    if(chosen.some(file=>file.size>10*1024*1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)))return setError('Photos JPEG, PNG ou WebP, 10 Mo maximum chacune.');
    const form=new FormData(formElement);
    form.delete('cover');form.set('equipments',JSON.stringify(equipments));form.set('tags',JSON.stringify(tags));
    form.append('cover',cover[0]);pictures.forEach(file=>form.append('pictures',file));avatar.forEach(file=>form.append('avatar',file));
    submitting.current=true;setBusy(true);
    try{
      const response=await fetch('/api/properties/publish',{method:'POST',body:form});
      const result=await response.json() as {id?:string;error?:string;warning?:string};
      if(!response.ok || !result.id)throw new Error(result.error||'Publication impossible.');
      router.push(`/properties/${encodeURIComponent(result.id)}`);router.refresh();
    }catch(caught){setError(caught instanceof Error?caught.message:'Publication impossible.');setBusy(false);submitting.current=false;}
  }
  return <form onSubmit={submit} className={styles.form}>
    <div className={styles.heading}><h1>Ajouter une propriété</h1><button className={styles.submit} disabled={busy} type="submit">{busy?'Publication…':'Ajouter'}</button></div>
    {error&&<p className={styles.error} role="alert">{error}</p>}
    {user.role === "client" && <div className={styles.passwordConfirm}><label htmlFor="confirmation_password">Mot de passe (confirmation pour devenir propriétaire)</label><input id="confirmation_password" name="confirmation_password" type="password" required autoComplete="current-password" minLength={6}/></div>}
    <div className={styles.grid}>
      <section className={`${styles.card} ${styles.general}`} aria-label="Informations du logement">
        <label htmlFor="title">Titre de la propriété</label><input id="title" name="title" required minLength={5} maxLength={120} placeholder="Ex : Appartement cosy au cœur de Paris"/>
        <label htmlFor="description">Description</label><textarea id="description" name="description" required minLength={20} maxLength={5000} rows={6} placeholder="Décrivez votre propriété en détail..."/>
        <label htmlFor="location">Localisation</label><input id="location" name="location" required minLength={2} maxLength={120}/>
        <label htmlFor="price_per_night">Prix par nuit (€)</label><input id="price_per_night" name="price_per_night" type="number" required min={1} max={100000} step={1}/>
      </section>
      <section className={`${styles.card} ${styles.photos}`} aria-label="Photos du logement">
        <PropertyImageField label="Image de couverture" files={cover} onChange={setCover}/>
        <PropertyImageField label="Image du logement" files={pictures} onChange={setPictures} max={12} multiple hint="+ Ajouter une image"/>
      </section>
      <section className={`${styles.card} ${styles.host}`} aria-label="Informations sur l'hôte">
        <label htmlFor="host_name">Nom de l&apos;hôte</label><input id="host_name" value={user.name} readOnly aria-readonly="true"/>
        {user.picture&&<p className={styles.existingPicture}>Photo actuelle du profil : <a href={user.picture} target="_blank" rel="noreferrer">Voir la photo</a></p>}
        <PropertyImageField label="Photo de profil" files={avatar} onChange={setAvatar} hint="Facultatif — remplacer la photo du profil"/>
      </section>
      <section className={`${styles.card} ${styles.equipment}`} aria-labelledby="equipment-title"><h2 id="equipment-title">Équipements</h2>
        <div className={styles.checkGrid}>{equipmentOptions.map(option=><label key={option} className={styles.check}><input type="checkbox" checked={equipments.includes(option)} onChange={()=>toggle(option,equipments,setEquipments)}/>{option}</label>)}</div>
      </section>
      <section className={`${styles.card} ${styles.category}`} aria-labelledby="category-title"><h2 id="category-title">Catégories</h2>
        <div className={styles.tags}>{categoryOptions.map(tag=><button key={tag} type="button" className={`${styles.tag} ${tags.includes(tag)?styles.selected:''}`} aria-pressed={tags.includes(tag)} onClick={()=>toggle(tag,tags,setTags)}>{tag}</button>)}{tags.filter(tag=>!categoryOptions.includes(tag)).map(tag=><button type="button" className={`${styles.tag} ${styles.selected}`} key={tag} aria-pressed="true" onClick={()=>toggle(tag,tags,setTags)}>{tag} ×</button>)}</div>
        <label htmlFor="custom-category">Ajouter une catégorie personnalisée</label><div className={styles.customRow}><input id="custom-category" value={customTag} maxLength={40} placeholder="Nouveau tag" onChange={e=>setCustomTag(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTag();}}}/><button type="button" onClick={addTag} aria-label="Ajouter une catégorie">+</button></div><p className={styles.hint}>+ Ajouter un tag</p>
      </section>
    </div>
  </form>;
}
