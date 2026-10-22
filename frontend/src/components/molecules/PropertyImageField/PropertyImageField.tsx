'use client';
import {useEffect,useId,useRef,useState} from 'react';
import PlusIcon from '@/components/quarks/PlusIcon';
import styles from '@/styles/molecules/PropertyImageField.module.css';
type Props={label:string; files:File[]; onChange:(files:File[])=>void; multiple?:boolean; max?:number; hint?:string};
export default function PropertyImageField({label,files,onChange,multiple=false,max=1,hint}:Props){
  const input=useRef<HTMLInputElement>(null);
  const inputId=useId();
  const hintId=useId();
  return <div className={styles.field}>
    <label className={styles.label} htmlFor={inputId}>{label}</label>
    <div className={styles.row}>
      <div className={styles.previewLine}>
        {files.length ? files.map((file,i)=><Preview key={`${file.name}-${file.lastModified}-${i}`} file={file} label={label} index={i} onRemove={()=>onChange(files.filter((_,n)=>n!==i))}/>) : <span className={styles.empty} aria-hidden="true"/>}
      </div>
      <button type="button" className={styles.add} aria-label={`Ajouter ${label.toLowerCase()}`} onClick={()=>input.current?.click()} disabled={files.length>=max}><PlusIcon/></button>
      <input id={inputId} ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} aria-describedby={hint ? hintId : undefined} className={styles.hidden}
        onChange={e=>{const selected=Array.from(e.target.files||[]);onChange(multiple?[...files,...selected].slice(0,max):selected.slice(0,1));e.target.value='';}}/>
    </div>
    {hint&&<p className={styles.hint} id={hintId}>{hint}</p>}
  </div>;
}

function Preview({file,label,index,onRemove}:{file:File;label:string;index:number;onRemove:()=>void}) {
  const [url]=useState(()=>URL.createObjectURL(file));
  useEffect(()=>()=>URL.revokeObjectURL(url),[url]);
  return <div className={styles.preview}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={url} alt={`${label} ${index+1}`}/>
    <button type="button" aria-label={`Retirer ${label} ${index+1}`} onClick={onRemove}>×</button>
  </div>;
}
